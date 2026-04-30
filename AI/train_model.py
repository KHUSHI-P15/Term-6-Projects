"""
Disease Prediction System Model Training
Trains and evaluates DecisionTreeClassifier and RandomForestClassifier
on symptom-to-disease dataset, then saves the best performing model.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import GroupShuffleSplit, StratifiedKFold, cross_val_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import BernoulliNB
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import pickle
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

RANDOM_SEED = 42
MISSING_SYMPTOM_RATE = 0.3
AUGMENTATION_PASSES = 2

print("=" * 60)
print("DISEASE PREDICTION SYSTEM - MODEL TRAINING")
print("=" * 60)

# ============================================================================
# 1. LOAD AND EXPLORE DATASET
# ============================================================================
print("\n[1] Loading dataset...")
df = pd.read_csv('dataset.csv')
print(f"Dataset shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")

# ============================================================================
# 2. HANDLE MISSING VALUES AND DATA PREPROCESSING
# ============================================================================
print("\n[2] Preprocessing data...")

# Replace NaN and empty strings with None
df = df.fillna('')
df = df.replace('', np.nan)

# Identify symptom columns once (ignore the target column)
symptom_cols = [col for col in df.columns if col.lower() != 'disease']

def build_signature(row):
    """
    Build an unordered symptom-set signature for leakage-safe splitting.
    """
    values = []
    for col in symptom_cols:
        cell = row[col]
        if pd.notna(cell):
            for part in str(cell).split(','):
                part = part.strip()
                if part:
                    values.append(part)
    return '|'.join(sorted(set(values)))

# Drop duplicate symptom sets to avoid leakage in train/test split
df['symptom_signature'] = df.apply(build_signature, axis=1)
before_rows = len(df)
df = df.drop_duplicates(subset=['symptom_signature']).reset_index(drop=True)
after_rows = len(df)
print(f"Removed duplicate symptom sets: {before_rows - after_rows}")
print(f"Unique symptom sets: {df['symptom_signature'].nunique()}")

# Get all unique symptoms from the dataset
all_symptoms = set()
for col in symptom_cols:
    for cell_value in df[col].dropna():
        # Handle multiple symptoms separated by commas
        symptoms = [s.strip() for s in str(cell_value).split(',')]
        all_symptoms.update(symptoms)

# Remove empty strings
all_symptoms.discard('')
all_symptoms = sorted(list(all_symptoms))
print(f"Total unique symptoms identified: {len(all_symptoms)}")

# ============================================================================
# 3. ENCODE SYMPTOMS AS NUMERICAL FEATURES (0/1)
# ============================================================================
print("\n[3] Encoding symptoms as binary features (0/1)...")

# Create binary feature matrix for each symptom
X = pd.DataFrame(0, index=range(len(df)), columns=all_symptoms)

# Populate the feature matrix
for idx, row in df.iterrows():
    # Collect all symptoms for this row
    row_symptoms = set()
    for col in symptom_cols:
        if pd.notna(row[col]):
            symptoms = [s.strip() for s in str(row[col]).split(',')]
            row_symptoms.update(symptoms)
    
    # Set binary values (1 if symptom present, 0 otherwise)
    for symptom in row_symptoms:
        if symptom in X.columns:
            X.loc[idx, symptom] = 1

print(f"Feature matrix shape: {X.shape}")
print(f"Sample features (first 5 symptoms): {X.columns[:5].tolist()}")

# Extract target variable (Disease)
y = df['Disease']
print(f"Target classes: {y.nunique()} diseases")
print(f"Class distribution:\n{y.value_counts().head()}")

# Encode target labels as numerical values
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)
print(f"\nDisease encoding: {dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))}")

# ============================================================================
# 4. SPLIT DATA INTO TRAIN AND TEST SETS
# ============================================================================
print("\n[4] Splitting dataset into train/test (80/20)...")

groups = df['symptom_signature']
gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
train_idx, test_idx = next(gss.split(X, y_encoded, groups=groups))

X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
y_train, y_test = y_encoded[train_idx], y_encoded[test_idx]

print(f"Training set size: {X_train.shape[0]} samples")
print(f"Test set size: {X_test.shape[0]} samples")
print(f"Symptom dropout rate for masked evaluation: {MISSING_SYMPTOM_RATE:.0%}")

rng = np.random.default_rng(RANDOM_SEED)

def apply_symptom_dropout(features, dropout_rate, rng):
    if dropout_rate <= 0:
        return features.copy()
    mask = rng.random(features.shape) < dropout_rate
    dropped = features.copy()
    dropped[mask] = 0
    return dropped

X_train_np = X_train.to_numpy()
X_test_np = X_test.to_numpy()
X_train_masked = apply_symptom_dropout(X_train_np, MISSING_SYMPTOM_RATE, rng)
X_test_masked = apply_symptom_dropout(X_test_np, MISSING_SYMPTOM_RATE, rng)

if AUGMENTATION_PASSES > 0:
    augmented_features = [X_train_np]
    augmented_labels = [y_train]
    for _ in range(AUGMENTATION_PASSES):
        augmented_features.append(apply_symptom_dropout(X_train_np, MISSING_SYMPTOM_RATE, rng))
        augmented_labels.append(y_train)
    X_train_fit = np.vstack(augmented_features)
    y_train_fit = np.concatenate(augmented_labels)
else:
    X_train_fit = X_train_np
    y_train_fit = y_train

# ============================================================================
# 5. TRAIN AND EVALUATE MODELS
# ============================================================================
print("\n[5] Training and evaluating models...")

models = {
    'Decision Tree Classifier': DecisionTreeClassifier(
        max_depth=12,
        min_samples_split=10,
        min_samples_leaf=4,
        random_state=42
    ),
    'Random Forest Classifier': RandomForestClassifier(
        n_estimators=200,
        max_depth=14,
        min_samples_split=8,
        min_samples_leaf=3,
        random_state=42,
        n_jobs=-1
    ),
    'Logistic Regression': LogisticRegression(
        solver='lbfgs',
        max_iter=2000
    ),
    'SVM (RBF Kernel)': SVC(
        kernel='rbf',
        probability=True,
        C=1.0,
        gamma='scale'
    ),
    'Naive Bayes (Bernoulli)': BernoulliNB()
}

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
results = []

for name, model in models.items():
    print(f"\n  Training {name}...")
    model.fit(X_train_fit, y_train_fit)

    train_pred = model.predict(X_train_np)
    test_pred_clean = model.predict(X_test_np)
    test_pred = model.predict(X_test_masked)

    train_accuracy = accuracy_score(y_train, train_pred)
    test_accuracy_clean = accuracy_score(y_test, test_pred_clean)
    test_accuracy = accuracy_score(y_test, test_pred)
    cv_scores = cross_val_score(model, X_train_masked, y_train, cv=skf, scoring='accuracy')

    results.append({
        'name': name,
        'model': model,
        'train_accuracy': train_accuracy,
        'test_accuracy_clean': test_accuracy_clean,
        'test_accuracy': test_accuracy,
        'cv_mean': float(cv_scores.mean()),
        'cv_std': float(cv_scores.std())
    })

# Display results
print("\n" + "-" * 60)
print("MODEL PERFORMANCE COMPARISON")
print("-" * 60)

for result in results:
    print(f"\n{result['name']}:")
    print(f"  Test Accuracy: {result['test_accuracy']:.4f} ({result['test_accuracy']*100:.2f}%)")

# ============================================================================
# 6. SELECT BEST MODEL
# ============================================================================
print("\n[6] Selecting best model...")

best_result = max(results, key=lambda r: (r['test_accuracy'], r['cv_mean']))
best_model = best_result['model']
best_model_name = best_result['name']
best_accuracy = best_result['test_accuracy']

print(f"\n✓ Best Model: {best_model_name}")
print(f"✓ Test Accuracy: {best_accuracy:.4f} ({best_accuracy*100:.2f}%)")

# ============================================================================
# 8. SAVE MODEL TO PICKLE FILE
# ============================================================================
print("\n[8] Saving model...")

model_data = {
    'model': best_model,
    'model_name': best_model_name,
    'accuracy': best_accuracy,
    'accuracy_clean_test': best_result['test_accuracy_clean'],
    'cv_accuracy_mean': best_result['cv_mean'],
    'cv_accuracy_std': best_result['cv_std'],
    'symptoms': all_symptoms,
    'label_encoder': label_encoder,
    'feature_columns': X.columns.tolist()
}

with open('model.pkl', 'wb') as file:
    pickle.dump(model_data, file)

print(f"✓ Model saved as 'model.pkl'")
print(f"  - Model: {best_model_name}")
print(f"  - Test Accuracy: {best_accuracy*100:.2f}%")
print(f"  - Symptoms Count: {len(all_symptoms)}")

print("\n" + "=" * 60)
print("TRAINING COMPLETE!")
print("=" * 60)
