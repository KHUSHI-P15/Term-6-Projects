import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaMicrophone, FaTrash, FaCheckCircle, FaCapsules, FaShieldAlt } from 'react-icons/fa';
import { MdLocalHospital, MdTrendingUp, MdOutlineWarning } from 'react-icons/md';
import { BiLoaderCircle } from 'react-icons/bi';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [symptomInput, setSymptomInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      setError('Failed to load symptoms list. Is backend running on port 5000?');
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
        'Failed to get prediction. Is backend running on port 5000?'
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

  const filteredSuggestions = availableSymptoms
    .filter(s => 
      s.toLowerCase().includes(symptomInput.toLowerCase()) &&
      !symptoms.includes(s)
    )
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-50 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <MdLocalHospital className="text-blue-500 text-3xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Medical Diagnosis System
            </h1>
          </div>
          <p className="text-slate-400 text-sm md:text-base">
            AI-powered disease prediction based on your symptoms
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* Input Section */}
        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-8 mb-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FaSearch className="text-blue-400 text-lg" />
              <h2 className="text-2xl font-bold text-white">
                Select Your Symptoms
              </h2>
            </div>

            {/* Symptom Input */}
            <div className="mb-6">
              <label className="block text-slate-300 font-semibold mb-3 text-sm">
                Search symptoms (start typing or paste)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., fever, headache, cough..."
                  value={symptomInput}
                  onChange={(e) => {
                    setSymptomInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && symptomInput && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-slate-700 border border-slate-600 rounded-lg mt-2 shadow-xl z-20 max-h-48 overflow-y-auto">
                    {filteredSuggestions.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => {
                          setSymptoms([...symptoms, symptom]);
                          setSymptomInput('');
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 text-slate-200 hover:bg-slate-600 transition-colors border-b border-slate-600 last:border-b-0"
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fallback Dropdown */}
            <div className="mb-6">
              <select
                onChange={handleSymptomChange}
                value=""
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="" className="bg-slate-700">Or select from dropdown list...</option>
                {availableSymptoms
                  .filter(s => !symptoms.includes(s))
                  .slice(0, 15)
                  .map((symptom) => (
                    <option key={symptom} value={symptom} className="bg-slate-700">
                      {symptom}
                    </option>
                  ))}
              </select>
            </div>

            {/* Selected Symptoms */}
            {symptoms.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FaCheckCircle className="text-green-400 text-lg" />
                  <label className="text-slate-300 font-semibold">
                    Selected Symptoms ({symptoms.length})
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <div
                      key={symptom}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <span className="text-sm font-medium">{symptom}</span>
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="hover:bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4 flex gap-3">
                <MdOutlineWarning className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePredict}
              disabled={symptoms.length === 0 || loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <BiLoaderCircle className="animate-spin text-xl" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <MdTrendingUp className="text-lg" />
                  <span>Predict Disease</span>
                </>
              )}
            </button>

            <button
              onClick={startVoiceInput}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <FaMicrophone className={isListening ? 'animate-pulse text-xl' : 'text-lg'} />
              <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
            </button>

            <button
              onClick={handleClear}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FaTrash className="text-lg" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Results Section */}
        {prediction && (
          <div className="space-y-6 animate-fadeIn">
            {/* Disclaimer */}
            <div className="bg-amber-900 border-l-4 border-amber-500 rounded-lg p-4 flex gap-3">
              <MdOutlineWarning className="text-amber-400 text-2xl flex-shrink-0" />
              <p className="text-amber-100 font-medium">{prediction.disclaimer}</p>
            </div>

            {/* Main Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Disease Card */}
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl shadow-2xl border border-blue-600 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <MdLocalHospital className="text-blue-300 text-2xl" />
                  <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">
                    Predicted Disease
                  </h3>
                </div>
                <p className="text-4xl font-bold text-white mb-6">
                  {prediction.prediction.disease}
                </p>
                
                {/* Confidence Score */}
                <div className="bg-slate-900 bg-opacity-50 rounded-lg p-4">
                  <p className="text-slate-300 text-sm mb-2 font-medium">Confidence Score</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-700"
                        style={{width: `${prediction.prediction.confidence_percentage}%`}}
                      ></div>
                    </div>
                    <span className="font-bold text-white text-lg whitespace-nowrap">
                      {prediction.prediction.confidence_percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Symptom Analysis Card */}
              <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-xl shadow-2xl border border-purple-600 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <FaCheckCircle className="text-purple-300 text-2xl" />
                  <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">
                    Symptom Analysis
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-slate-900 bg-opacity-50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Recognized</p>
                    <p className="text-3xl font-bold text-green-400">
                      {prediction.symptoms_analysis.recognized}
                    </p>
                  </div>
                  <div className="bg-slate-900 bg-opacity-50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Total Provided</p>
                    <p className="text-3xl font-bold text-blue-400">
                      {prediction.symptoms_analysis.total}
                    </p>
                  </div>
                  {prediction.symptoms_analysis.unrecognized.length > 0 && (
                    <div className="bg-slate-900 bg-opacity-50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">Unrecognized</p>
                      <p className="text-3xl font-bold text-orange-400">
                        {prediction.symptoms_analysis.unrecognized.length}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Precautions */}
              <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-xl shadow-2xl border border-green-600 p-8">
                <div className="flex items-center gap-2 mb-6">
                  <FaShieldAlt className="text-green-300 text-2xl" />
                  <h3 className="text-white font-bold text-lg">Precautions</h3>
                </div>
                <ul className="space-y-3">
                  {prediction.recommendations.precautions.map((precaution, idx) => (
                    <li
                      key={idx}
                      className="text-green-100 flex gap-3 animate-slideInLeft"
                      style={{ animationDelay: `${idx * 0.08}s` }}
                    >
                      <span className="text-green-400 font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-sm">{precaution}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Medicines */}
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl shadow-2xl border border-blue-600 p-8">
                <div className="flex items-center gap-2 mb-6">
                  <FaCapsules className="text-blue-300 text-2xl" />
                  <h3 className="text-white font-bold text-lg">OTC Medicines</h3>
                </div>
                <ul className="space-y-3">
                  {prediction.recommendations.medicines.map((medicine, idx) => (
                    <li
                      key={idx}
                      className="text-blue-100 flex gap-3 animate-slideInLeft"
                      style={{ animationDelay: `${idx * 0.08}s` }}
                    >
                      <span className="text-blue-400 font-bold flex-shrink-0 mt-0.5">•</span>
                      <span className="text-sm">{medicine}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Unrecognized Symptoms */}
            {prediction.symptoms_analysis.unrecognized.length > 0 && (
              <div className="bg-orange-900 border border-orange-700 rounded-lg p-4 flex gap-3">
                <MdOutlineWarning className="text-orange-400 text-xl flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-orange-200 font-semibold text-sm mb-1">Unrecognized Symptoms:</p>
                  <p className="text-orange-100 text-sm">{prediction.symptoms_analysis.unrecognized.join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!prediction && !loading && symptoms.length === 0 && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
            <MdLocalHospital className="text-slate-600 text-6xl mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              Select your symptoms and click "Predict Disease" to get started
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-700 mt-12">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 text-center text-slate-400 text-sm">
          <p>Built with React and AI for better health awareness</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
