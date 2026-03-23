"""
Disease Prediction Module
Loads trained model and generates disease predictions based on symptoms.
"""

import pickle
import numpy as np
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

# Global variables to store loaded model
_model_data = None


def load_model(model_path='model.pkl'):
    """
    Load the trained model from pickle file.
    
    Args:
        model_path (str): Path to the model.pkl file
        
    Returns:
        dict: Model data dictionary containing model, symptoms, and encoder
        
    Raises:
        FileNotFoundError: If model file doesn't exist
        Exception: If model pickle is corrupted
    """
    global _model_data
    
    try:
        with open(model_path, 'rb') as file:
            _model_data = pickle.load(file)
        
        print(f"✓ Model loaded successfully from '{model_path}'")
        print(f"  - Model: {_model_data['model_name']}")
        print(f"  - Test Accuracy: {_model_data['accuracy']*100:.2f}%")
        print(f"  - Known Symptoms: {len(_model_data['symptoms'])}")
        
        return _model_data
    
    except FileNotFoundError:
        raise FileNotFoundError(f"Model file '{model_path}' not found.")
    except Exception as e:
        raise Exception(f"Error loading model: {str(e)}")


def _check_model_loaded():
    """
    Internal function to verify model is loaded.
    
    Raises:
        RuntimeError: If model hasn't been loaded yet
    """
    if _model_data is None:
        raise RuntimeError(
            "Model not loaded. Call load_model() first."
        )


def _normalize_symptom(symptom):
    """
    Normalize symptom string to match training data format.
    Handles spacing and underscore variations.
    
    Args:
        symptom (str): Raw symptom string
        
    Returns:
        str: Normalized symptom string
    """
    # Convert to lowercase and replace spaces with underscores
    normalized = symptom.strip().lower().replace(' ', '_')
    return normalized


def predict_disease(symptoms):
    """
    Predict disease and confidence score based on provided symptoms.
    
    Args:
        symptoms (list): List of symptom strings (e.g., ['itching', 'skin_rash'])
        
    Returns:
        dict: Dictionary containing:
            - 'disease': Predicted disease name
            - 'confidence': Confidence score (0-1)
            - 'known_symptoms': Count of recognized symptoms
            - 'unknown_symptoms': List of unrecognized symptoms
            
    Raises:
        RuntimeError: If model not loaded
        ValueError: If symptoms list is empty
        TypeError: If symptoms is not a list
    """
    _check_model_loaded()
    
    # Validate input
    if not isinstance(symptoms, list):
        raise TypeError("Symptoms must be provided as a list")
    
    if len(symptoms) == 0:
        raise ValueError("Symptoms list cannot be empty")
    
    # Extract model components
    model = _model_data['model']
    known_symptoms = _model_data['symptoms']
    label_encoder = _model_data['label_encoder']
    
    # Normalize input symptoms
    normalized_symptoms = [_normalize_symptom(s) for s in symptoms]
    
    # Identify unknown symptoms
    unknown_symptoms = [
        s for s in normalized_symptoms 
        if s not in known_symptoms
    ]
    
    # Create feature vector
    feature_vector = np.zeros((1, len(known_symptoms)))
    
    # Set features for known symptoms
    for idx, symptom in enumerate(known_symptoms):
        if symptom in normalized_symptoms:
            feature_vector[0, idx] = 1
    
    # Make prediction
    predicted_label = model.predict(feature_vector)[0]
    predicted_disease = label_encoder.inverse_transform([predicted_label])[0]
    
    # Calculate confidence score
    # For tree-based models, we use the prediction probabilities
    try:
        probabilities = model.predict_proba(feature_vector)[0]
        confidence = float(np.max(probabilities))
    except AttributeError:
        # Fallback if model doesn't support predict_proba
        confidence = 0.0
    
    result = {
        'disease': predicted_disease,
        'confidence': round(confidence, 4),
        'known_symptoms': len(normalized_symptoms) - len(unknown_symptoms),
        'unknown_symptoms': unknown_symptoms,
        'total_symptoms_provided': len(normalized_symptoms)
    }
    
    return result


def predict_disease_detailed(symptoms):
    """
    Enhanced prediction function with detailed output and warnings.
    
    Args:
        symptoms (list): List of symptom strings
        
    Returns:
        dict: Prediction result with additional metadata
    """
    _check_model_loaded()
    
    # Get base prediction
    result = predict_disease(symptoms)
    
    # Add warnings for unknown symptoms
    if result['unknown_symptoms']:
        print(f"\n⚠ Warning: {len(result['unknown_symptoms'])} unknown symptom(s):")
        for symptom in result['unknown_symptoms']:
            print(f"  - '{symptom}' not in training data")
    
    if result['known_symptoms'] == 0:
        print("\n⚠ Warning: No known symptoms provided. Prediction may be unreliable.")
    
    return result


def print_prediction_report(prediction_result):
    """
    Print formatted prediction report.
    
    Args:
        prediction_result (dict): Result from predict_disease()
    """
    print("\n" + "="*60)
    print("DISEASE PREDICTION RESULT")
    print("="*60)
    print(f"\nPredicted Disease: {prediction_result['disease']}")
    print(f"Confidence Score:  {prediction_result['confidence']:.2%}")
    print(f"\nSymptoms Processed:")
    print(f"  - Known:   {prediction_result['known_symptoms']}")
    print(f"  - Unknown: {len(prediction_result['unknown_symptoms'])}")
    print(f"  - Total:   {prediction_result['total_symptoms_provided']}")
    
    if prediction_result['unknown_symptoms']:
        print(f"\nUnrecognized Symptoms:")
        for symptom in prediction_result['unknown_symptoms']:
            print(f"  - {symptom}")
    
    print("\n" + "="*60)


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

if __name__ == "__main__":
    """
    Example usage of the disease prediction module.
    """
    
    print("Disease Prediction Module - Example Usage\n")
    
    # Load the model
    try:
        load_model('model.pkl')
    except FileNotFoundError:
        print("Error: model.pkl not found. Please run train_model.py first.")
        exit(1)
    
    # Example 1: Common symptoms
    print("\n--- Example 1: Fungal Infection Symptoms ---")
    symptoms_1 = ['itching', 'skin_rash', 'dischromic patches']
    result_1 = predict_disease(symptoms_1)
    print_prediction_report(result_1)
    
    # Example 2: Symptoms with some unknown ones
    print("\n--- Example 2: With Unknown Symptoms ---")
    symptoms_2 = ['itching', 'fever', 'cough', 'skin_rash', 'mystery_symptom']
    try:
        result_2 = predict_disease_detailed(symptoms_2)
        print_prediction_report(result_2)
    except ValueError as e:
        print(f"Error: {e}")
    
    # Example 3: Single symptom
    print("\n--- Example 3: Single Symptom ---")
    symptoms_3 = ['fever']
    result_3 = predict_disease(symptoms_3)
    print_prediction_report(result_3)
    
    # Example 4: Direct function call
    print("\n--- Example 4: Direct predict_disease() Usage ---")
    symptoms_4 = ['headache', 'high_fever']
    result_4 = predict_disease(symptoms_4)
    print(result_4)
