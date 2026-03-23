"""
Disease Prediction System Flask Backend
Provides REST API endpoints for disease prediction and information retrieval.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from predict import load_model, predict_disease

# ============================================================================
# INITIALIZE FLASK APP
# ============================================================================

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ============================================================================
# GLOBAL VARIABLES
# ============================================================================

MODEL_DATA = None
DISEASE_INFO = None
ALL_SYMPTOMS = []

# ============================================================================
# INITIALIZATION FUNCTIONS
# ============================================================================

def load_all_data():
    """
    Load model and disease information on app startup.
    
    Returns:
        tuple: (success: bool, message: str)
    """
    global MODEL_DATA, DISEASE_INFO, ALL_SYMPTOMS
    
    try:
        # Load the trained model
        print("[INIT] Loading model...")
        MODEL_DATA = load_model('model.pkl')
        ALL_SYMPTOMS = MODEL_DATA['symptoms']
        print(f"✓ Model loaded successfully")
        
        # Load disease information
        print("[INIT] Loading disease information...")
        with open('disease_info.json', 'r') as f:
            DISEASE_INFO = json.load(f)
        print(f"✓ Disease information loaded ({len(DISEASE_INFO['diseases'])} diseases)")
        
        return True, "All data loaded successfully"
    
    except FileNotFoundError as e:
        error_msg = f"File not found: {str(e)}"
        print(f"✗ {error_msg}")
        return False, error_msg
    
    except Exception as e:
        error_msg = f"Error loading data: {str(e)}"
        print(f"✗ {error_msg}")
        return False, error_msg


def verify_data_loaded():
    """
    Verify that model and disease data are loaded.
    
    Returns:
        tuple: (is_loaded: bool, error_response: dict or None)
    """
    if MODEL_DATA is None or DISEASE_INFO is None:
        return False, {
            'error': 'System not initialized',
            'message': 'Model and disease data not loaded',
            'status': 503
        }
    return True, None


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_disease_info(disease_name):
    """
    Get precautions and medicines for a specific disease.
    
    Args:
        disease_name (str): Name of the disease
        
    Returns:
        dict: Disease information or empty dict if not found
    """
    if disease_name in DISEASE_INFO['diseases']:
        return DISEASE_INFO['diseases'][disease_name]
    return {
        'precautions': ['Consult a healthcare professional'],
        'medicines': ['Consult a healthcare professional']
    }


def format_prediction_response(prediction_result, disease_name):
    """
    Format prediction result with disease information.
    
    Args:
        prediction_result (dict): Result from predict_disease()
        disease_name (str): Predicted disease name
        
    Returns:
        dict: Formatted response
    """
    disease_info = get_disease_info(disease_name)
    
    return {
        'success': True,
        'prediction': {
            'disease': disease_name,
            'confidence': prediction_result['confidence'],
            'confidence_percentage': round(prediction_result['confidence'] * 100, 2)
        },
        'recommendations': {
            'precautions': disease_info.get('precautions', []),
            'medicines': disease_info.get('medicines', [])
        },
        'symptoms_analysis': {
            'recognized': prediction_result['known_symptoms'],
            'unrecognized': prediction_result['unknown_symptoms'],
            'total': prediction_result['total_symptoms_provided']
        },
        'disclaimer': DISEASE_INFO.get('disclaimer', 'This is not a medical diagnosis. Consult a doctor.')
    }


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/', methods=['GET'])
def home():
    """
    Home endpoint - API information.
    """
    return jsonify({
        'name': 'Disease Prediction System',
        'version': '1.0.0',
        'description': 'ML-based disease prediction API',
        'endpoints': {
            'POST /predict': 'Predict disease from symptoms',
            'GET /symptoms': 'Get all available symptoms',
            'GET /diseases': 'Get all diseases in system',
            'GET /health': 'Check API health'
        }
    }), 200


@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint.
    """
    is_loaded, error = verify_data_loaded()
    
    if is_loaded:
        return jsonify({
            'status': 'healthy',
            'model_loaded': True,
            'diseases_loaded': len(DISEASE_INFO['diseases']),
            'symptoms_available': len(ALL_SYMPTOMS)
        }), 200
    else:
        return jsonify({'status': 'unhealthy', 'error': error['message']}), 503


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict disease based on symptoms.
    
    Request JSON:
    {
        "symptoms": ["fever", "cough", "headache"]
    }
    
    Response JSON:
    {
        "success": true,
        "prediction": {
            "disease": "Common Cold",
            "confidence": 0.85,
            "confidence_percentage": 85.0
        },
        "recommendations": {
            "precautions": [...],
            "medicines": [...]
        },
        "symptoms_analysis": {
            "recognized": 2,
            "unrecognized": 1,
            "total": 3
        },
        "disclaimer": "..."
    }
    """
    
    # Verify system is initialized
    is_loaded, error = verify_data_loaded()
    if not is_loaded:
        return jsonify(error), error.get('status', 503)
    
    try:
        # Validate request
        if not request.json:
            return jsonify({
                'success': False,
                'error': 'Invalid request',
                'message': 'Request body must be JSON'
            }), 400
        
        symptoms = request.json.get('symptoms')
        
        # Validate symptoms
        if symptoms is None:
            return jsonify({
                'success': False,
                'error': 'Missing symptoms',
                'message': 'Request must include "symptoms" field'
            }), 400
        
        if not isinstance(symptoms, list):
            return jsonify({
                'success': False,
                'error': 'Invalid symptoms format',
                'message': 'Symptoms must be a list of strings'
            }), 400
        
        if len(symptoms) == 0:
            return jsonify({
                'success': False,
                'error': 'Empty symptoms list',
                'message': 'Please provide at least one symptom'
            }), 400
        
        # Make prediction
        prediction_result = predict_disease(symptoms)
        disease_name = prediction_result['disease']
        
        # Format and return response
        response = format_prediction_response(prediction_result, disease_name)
        return jsonify(response), 200
    
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'message': str(e)
        }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Prediction error',
            'message': str(e)
        }), 500


@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    """
    Get list of all available symptoms.
    
    Response JSON:
    {
        "success": true,
        "total": 54,
        "symptoms": ["fever", "cough", ...]
    }
    """
    
    # Verify system is initialized
    is_loaded, error = verify_data_loaded()
    if not is_loaded:
        return jsonify(error), error.get('status', 503)
    
    try:
        return jsonify({
            'success': True,
            'total': len(ALL_SYMPTOMS),
            'symptoms': sorted(ALL_SYMPTOMS)
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Error retrieving symptoms',
            'message': str(e)
        }), 500


@app.route('/diseases', methods=['GET'])
def get_diseases():
    """
    Get list of all diseases in the system.
    
    Response JSON:
    {
        "success": true,
        "total": 11,
        "diseases": [
            {
                "name": "Fungal infection",
                "precautions_count": 7,
                "medicines_count": 6
            },
            ...
        ]
    }
    """
    
    # Verify system is initialized
    is_loaded, error = verify_data_loaded()
    if not is_loaded:
        return jsonify(error), error.get('status', 503)
    
    try:
        diseases = []
        for disease_name, disease_data in DISEASE_INFO['diseases'].items():
            diseases.append({
                'name': disease_name,
                'precautions_count': len(disease_data.get('precautions', [])),
                'medicines_count': len(disease_data.get('medicines', []))
            })
        
        return jsonify({
            'success': True,
            'total': len(diseases),
            'diseases': sorted(diseases, key=lambda x: x['name'])
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Error retrieving diseases',
            'message': str(e)
        }), 500


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    """
    Handle 404 Not Found errors.
    """
    return jsonify({
        'success': False,
        'error': 'Not found',
        'message': 'The requested endpoint does not exist'
    }), 404


@app.errorhandler(405)
def method_not_allowed(error):
    """
    Handle 405 Method Not Allowed errors.
    """
    return jsonify({
        'success': False,
        'error': 'Method not allowed',
        'message': 'The HTTP method is not allowed for this endpoint'
    }), 405


@app.errorhandler(500)
def internal_error(error):
    """
    Handle 500 Internal Server errors.
    """
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500


# ============================================================================
# APPLICATION STARTUP
# ============================================================================

if __name__ == '__main__':
    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print("=" * 60)
    print("DISEASE PREDICTION FLASK BACKEND")
    print("=" * 60)
    
    # Load all data
    success, message = load_all_data()
    
    if not success:
        print("\n✗ Failed to load required data. Exiting...")
        exit(1)
    
    print("\n" + "=" * 60)
    print("STARTING FLASK SERVER")
    print("=" * 60)
    print("\nAvailable endpoints:")
    print("  GET  http://localhost:5000/              - API info")
    print("  GET  http://localhost:5000/health        - Health check")
    print("  POST http://localhost:5000/predict       - Disease prediction")
    print("  GET  http://localhost:5000/symptoms      - Available symptoms")
    print("  GET  http://localhost:5000/diseases      - Available diseases")
    print("\n")
    
    # Run Flask app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=True
    )
