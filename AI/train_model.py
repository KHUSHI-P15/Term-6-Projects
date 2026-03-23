"""
Disease Prediction System Model Training
Trains and evaluates DecisionTreeClassifier and RandomForestClassifier
on symptom-to-disease dataset, then saves the best performing model.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import pickle
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

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

# Get all unique symptoms from the dataset
all_symptoms = set()
for col in df.columns[1:]:  # Skip 'Disease' column
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
    for col in df.columns[1:]:  # Skip 'Disease' column
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

X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"Training set size: {X_train.shape[0]} samples")
print(f"Test set size: {X_test.shape[0]} samples")

# ============================================================================
# 5. TRAIN MODELS
# ============================================================================
print("\n[5] Training classification models...")

# Train Decision Tree Classifier
print("\n  Training DecisionTreeClassifier...")
dt_classifier = DecisionTreeClassifier(
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42
)
dt_classifier.fit(X_train, y_train)
print("  ✓ DecisionTreeClassifier trained")

# Train Random Forest Classifier
print("  Training RandomForestClassifier...")
rf_classifier = RandomForestClassifier(
    n_estimators=100,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)
rf_classifier.fit(X_train, y_train)
print("  ✓ RandomForestClassifier trained")

# ============================================================================
# 6. EVALUATE MODELS
# ============================================================================
print("\n[6] Evaluating models...")

# Decision Tree predictions
dt_train_pred = dt_classifier.predict(X_train)
dt_test_pred = dt_classifier.predict(X_test)
dt_train_accuracy = accuracy_score(y_train, dt_train_pred)
dt_test_accuracy = accuracy_score(y_test, dt_test_pred)

# Random Forest predictions
rf_train_pred = rf_classifier.predict(X_train)
rf_test_pred = rf_classifier.predict(X_test)
rf_train_accuracy = accuracy_score(y_train, rf_train_pred)
rf_test_accuracy = accuracy_score(y_test, rf_test_pred)

# Display results
print("\n" + "-" * 60)
print("MODEL PERFORMANCE COMPARISON")
print("-" * 60)
print(f"\nDecision Tree Classifier:")
print(f"  Training Accuracy: {dt_train_accuracy:.4f} ({dt_train_accuracy*100:.2f}%)")
print(f"  Test Accuracy:     {dt_test_accuracy:.4f} ({dt_test_accuracy*100:.2f}%)")

print(f"\nRandom Forest Classifier:")
print(f"  Training Accuracy: {rf_train_accuracy:.4f} ({rf_train_accuracy*100:.2f}%)")
print(f"  Test Accuracy:     {rf_test_accuracy:.4f} ({rf_test_accuracy*100:.2f}%)")

# ============================================================================
# 7. SELECT BEST MODEL
# ============================================================================
print("\n[7] Selecting best model...")

if rf_test_accuracy > dt_test_accuracy:
    best_model = rf_classifier
    best_model_name = "Random Forest Classifier"
    best_accuracy = rf_test_accuracy
else:
    best_model = dt_classifier
    best_model_name = "Decision Tree Classifier"
    best_accuracy = dt_test_accuracy

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
