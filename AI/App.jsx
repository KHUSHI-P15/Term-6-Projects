import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  // State management
  const [symptoms, setSymptoms] = useState([]);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [symptomInput, setSymptomInput] = useState('');

  // Initialize: Fetch available symptoms on component mount
  useEffect(() => {
    fetchAvailableSymptoms();
  }, []);

  // Fetch available symptoms from backend
  const fetchAvailableSymptoms = async () => {
    try {
      const response = await axios.get(`${API_URL}/symptoms`);
      if (response.data.success) {
        setAvailableSymptoms(response.data.symptoms);
      }
    } catch (err) {
      console.error('Error fetching symptoms:', err);
      setError('Failed to load symptoms list');
    }
  };

  // Handle symptom selection
  const handleSymptomChange = (e) => {
    const value = e.target.value;
    if (value && !symptoms.includes(value)) {
      setSymptoms([...symptoms, value]);
      setSymptomInput('');
    }
  };

  // Remove selected symptom
  const removeSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter(s => s !== symptomToRemove));
  };

  // Voice input using Web Speech API
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in your browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setSymptomInput(transcript.toLowerCase());
    };

    recognition.onerror = (event) => {
      setError(`Voice input error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();

    // Stop after 5 seconds
    setTimeout(() => {
      recognition.stop();
    }, 5000);
  };

  // Make prediction API call
  const handlePredict = async () => {
    if (symptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post(`${API_URL}/predict`, {
        symptoms: symptoms
      });

      if (response.data.success) {
        setPrediction(response.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to get prediction. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Clear all selections
  const handleClear = () => {
    setSymptoms([]);
    setPrediction(null);
    setError(null);
    setSymptomInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🏥 Medical Diagnosis System
          </h1>
          <p className="text-gray-600 text-lg">
            AI-powered disease prediction based on your symptoms
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-8">
          {/* Symptom Selection Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Select Your Symptoms
            </h2>

            {/* Symptom Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Search and Select Symptoms
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search symptoms..."
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                {symptomInput && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-0 max-h-48 overflow-y-auto z-10">
                    {availableSymptoms
                      .filter(s => 
                        s.toLowerCase().includes(symptomInput.toLowerCase()) &&
                        !symptoms.includes(s)
                      )
                      .map((symptom) => (
                        <button
                          key={symptom}
                          onClick={() => {
                            setSymptoms([...symptoms, symptom]);
                            setSymptomInput('');
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-blue-100 transition-colors"
                        >
                          {symptom}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Fallback: Simple Select Dropdown */}
              <select
                onChange={handleSymptomChange}
                value=""
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Or select from dropdown...</option>
                {availableSymptoms
                  .filter(s => !symptoms.includes(s))
                  .map((symptom) => (
                    <option key={symptom} value={symptom}>
                      {symptom}
                    </option>
                  ))}
              </select>
            </div>

            {/* Selected Symptoms Display */}
            {symptoms.length > 0 && (
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  Selected Symptoms ({symptoms.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <div
                      key={symptom}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-fadeIn"
                    >
                      <span>{symptom}</span>
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="font-bold hover:bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePredict}
              disabled={symptoms.length === 0 || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span> Predicting...
                </>
              ) : (
                <>
                  🔍 Predict Disease
                </>
              )}
            </button>

            <button
              onClick={startVoiceInput}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isListening ? (
                <>
                  <span className="animate-pulse">🎤</span> Listening...
                </>
              ) : (
                <>
                  🎤 Voice Input
                </>
              )}
            </button>

            <button
              onClick={handleClear}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Section */}
        {prediction && (
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 animate-fadeIn">
            {/* Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800 font-semibold">
                ⚠️ {prediction.disclaimer}
              </p>
            </div>

            {/* Main Prediction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Disease Result */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
                <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">
                  Predicted Disease
                </h3>
                <p className="text-3xl font-bold text-blue-600 mb-4">
                  {prediction.prediction.disease}
                </p>
                <div className="bg-white rounded p-3">
                  <p className="text-gray-600 text-sm mb-1">Confidence Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${prediction.prediction.confidence_percentage}%`
                        }}
                      ></div>
                    </div>
                    <span className="font-bold text-blue-600 text-lg">
                      {prediction.prediction.confidence_percentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Symptoms Analysis */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                <h3 className="text-gray-600 text-sm font-semibold uppercase mb-4">
                  Symptom Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white rounded p-3">
                    <span className="text-gray-700">Recognized</span>
                    <span className="font-bold text-green-600 text-lg">
                      {prediction.symptoms_analysis.recognized}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded p-3">
                    <span className="text-gray-700">Total Provided</span>
                    <span className="font-bold text-blue-600 text-lg">
                      {prediction.symptoms_analysis.total}
                    </span>
                  </div>
                  {prediction.symptoms_analysis.unrecognized.length > 0 && (
                    <div className="flex justify-between items-center bg-white rounded p-3">
                      <span className="text-gray-700">Unrecognized</span>
                      <span className="font-bold text-orange-600 text-lg">
                        {prediction.symptoms_analysis.unrecognized.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Precautions and Medicines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Precautions */}
              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  ✓ Precautions
                </h3>
                <ul className="space-y-2">
                  {prediction.recommendations.precautions.map((precaution, idx) => (
                    <li
                      key={idx}
                      className="text-green-700 flex gap-3 animate-slideInLeft"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <span className="font-bold text-green-600 flex-shrink-0">•</span>
                      <span>{precaution}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Medicines */}
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                  💊 OTC Medicines
                </h3>
                <ul className="space-y-2">
                  {prediction.recommendations.medicines.map((medicine, idx) => (
                    <li
                      key={idx}
                      className="text-blue-700 flex gap-3 animate-slideInLeft"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <span className="font-bold text-blue-600 flex-shrink-0">•</span>
                      <span>{medicine}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Unrecognized Symptoms (if any) */}
            {prediction.symptoms_analysis.unrecognized.length > 0 && (
              <div className="mt-6 bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                <h4 className="text-orange-800 font-semibold mb-2">
                  ⚠️ Unrecognized Symptoms:
                </h4>
                <p className="text-orange-700">
                  {prediction.symptoms_analysis.unrecognized.join(', ')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* No Results State */}
        {!prediction && !loading && (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <p className="text-gray-500 text-lg">
              🏥 Select your symptoms and click "Predict Disease" to get started
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-600">
        <p className="text-sm">
          Made with ❤️ for better health awareness
        </p>
      </div>
    </div>
  );
}

export default App;
