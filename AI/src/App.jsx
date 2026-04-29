import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import {
  FaSearch,
  FaMicrophone,
  FaTrash,
  FaCheckCircle,
  FaCapsules,
  FaShieldAlt,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import { MdLocalHospital, MdTrendingUp, MdOutlineWarning } from 'react-icons/md';
import { BiLoaderCircle } from 'react-icons/bi';
import './App.css';

const API_URL = 'http://localhost:5000';

const normalizeForMatch = (value) => (
  value
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
);

const cleanTranscript = (value) => value.replace(/\s+/g, ' ').trim();

const splitSpokenSymptoms = (value) => (
  value
    .split(/,|;|\/|\band\b|\bplus\b|\bwith\b/gi)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
);

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const storedTheme = window.localStorage.getItem('theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [symptomInput, setSymptomInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const [theme, setTheme] = useState(getInitialTheme);
  const recognitionRef = useRef(null);
  const voiceTimeoutRef = useRef(null);
  const isDark = theme === 'dark';
  const themeClasses = {
    headerBg: isDark ? 'bg-slate-950' : 'bg-white/80',
    headerBorder: isDark ? 'border-slate-700' : 'border-slate-200',
    headerTitle: isDark ? 'text-white' : 'text-slate-900',
    headerSubtitle: isDark ? 'text-slate-400' : 'text-slate-600',
    cardBg: isDark ? 'bg-slate-800' : 'bg-white',
    cardBorder: isDark ? 'border-slate-700' : 'border-slate-200',
    cardShadow: isDark ? 'shadow-2xl' : 'shadow-xl',
    labelText: isDark ? 'text-slate-300' : 'text-slate-700',
    inputBg: isDark ? 'bg-slate-700' : 'bg-slate-50',
    inputBorder: isDark ? 'border-slate-600' : 'border-slate-200',
    inputText: isDark ? 'text-white' : 'text-slate-900',
    inputPlaceholder: isDark ? 'placeholder-slate-400' : 'placeholder-slate-500',
    dropdownBg: isDark ? 'bg-slate-700' : 'bg-white',
    dropdownBorder: isDark ? 'border-slate-600' : 'border-slate-200',
    dropdownItem: isDark
      ? 'text-slate-200 hover:bg-slate-600 border-slate-600'
      : 'text-slate-700 hover:bg-slate-100 border-slate-200',
    selectBg: isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900',
    selectBorder: isDark ? 'border-slate-600' : 'border-slate-200',
    chip: isDark
      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
      : 'bg-blue-50 text-blue-700 border border-blue-200',
    errorBg: isDark ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200',
    errorText: isDark ? 'text-red-200' : 'text-red-700',
    emptyBg: isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
    emptyText: isDark ? 'text-slate-400' : 'text-slate-600',
    footerBg: isDark ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-200',
    footerText: isDark ? 'text-slate-400' : 'text-slate-500',
    voiceNote: isDark ? 'text-slate-400' : 'text-slate-600',
    clearButton: isDark
      ? 'bg-slate-700 hover:bg-slate-600 text-white'
      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
  };

  // Initialize: Fetch available symptoms on component mount
  useEffect(() => {
    fetchAvailableSymptoms();
  }, []);

  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }
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

  const symptomMatchers = useMemo(
    () => availableSymptoms.map((symptom) => ({
      value: symptom,
      norm: normalizeForMatch(symptom)
    })),
    [availableSymptoms]
  );

  const matchSpokenSymptoms = (transcript) => {
    const chunks = splitSpokenSymptoms(transcript);
    if (chunks.length === 0 || symptomMatchers.length === 0) {
      return { matched: [], unmatched: chunks };
    }

    const matched = [];
    const unmatched = [];

    chunks.forEach((chunk) => {
      const normalizedChunk = normalizeForMatch(chunk);
      if (!normalizedChunk) {
        return;
      }

      let match = symptomMatchers.find((symptom) => symptom.norm === normalizedChunk);
      if (!match) {
        match = symptomMatchers.find((symptom) => (
          symptom.norm.includes(normalizedChunk) || normalizedChunk.includes(symptom.norm)
        ));
      }

      if (match) {
        matched.push(match.value);
      } else {
        unmatched.push(chunk);
      }
    });

    return {
      matched: Array.from(new Set(matched)),
      unmatched
    };
  };

  const stopVoiceInput = () => {
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Voice input using Web Speech API
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in your browser');
      return;
    }

    if (isListening) {
      stopVoiceInput();
      return;
    }

    setVoiceNote('');
    setError(null);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += chunk;
        } else {
          interimTranscript += chunk;
        }
      }

      if (interimTranscript) {
        setSymptomInput(cleanTranscript(interimTranscript));
        setShowSuggestions(true);
      }

      if (finalTranscript) {
        const cleanedFinal = cleanTranscript(finalTranscript);
        const { matched, unmatched } = matchSpokenSymptoms(cleanedFinal);

        if (matched.length > 0) {
          setSymptoms((prev) => {
            const merged = new Set(prev);
            matched.forEach((symptom) => merged.add(symptom));
            return Array.from(merged);
          });
          setSymptomInput('');
          setShowSuggestions(false);
        } else {
          setSymptomInput(cleanedFinal);
          setShowSuggestions(true);
        }

        const noteParts = [`Heard: "${cleanedFinal}"`];
        if (matched.length > 0) {
          noteParts.push(`Added: ${matched.join(', ')}`);
        }
        if (unmatched.length > 0) {
          noteParts.push(`Not matched: ${unmatched.join(', ')}`);
        }
        setVoiceNote(noteParts.join(' | '));
      }
    };

    recognition.onerror = (event) => {
      setError(`Voice input error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();

    // Stop after 8 seconds to keep the session short.
    voiceTimeoutRef.current = setTimeout(() => {
      recognition.stop();
    }, 8000);
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
    setVoiceNote('');
  };

  const normalizedInput = normalizeForMatch(symptomInput);
  const filteredSuggestions = availableSymptoms
    .filter((symptom) => (
      normalizedInput &&
      normalizeForMatch(symptom).includes(normalizedInput) &&
      !symptoms.includes(symptom)
    ))
    .slice(0, 8);

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200'
      }`}
    >
      {/* Header */}
      <header className={`${themeClasses.headerBg} border-b ${themeClasses.headerBorder} sticky top-0 z-50 backdrop-blur`}>
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MdLocalHospital className="text-blue-500 text-3xl" />
                <h1 className={`text-3xl md:text-4xl font-bold ${themeClasses.headerTitle}`}>
                  Medical Diagnosis System
                </h1>
              </div>
              <p className={`text-sm md:text-base ${themeClasses.headerSubtitle}`}>
                AI-powered disease prediction based on your symptoms
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`theme-toggle flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                isDark
                  ? 'bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
              }`}
              aria-pressed={isDark}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <FaSun className="text-amber-300" />
              ) : (
                <FaMoon className="text-slate-700" />
              )}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* Input Section */}
        <div className={`${themeClasses.cardBg} rounded-xl ${themeClasses.cardShadow} border ${themeClasses.cardBorder} p-8 mb-8`}>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FaSearch className="text-blue-400 text-lg" />
              <h2 className={`text-2xl font-bold ${themeClasses.headerTitle}`}>
                Select Your Symptoms
              </h2>
            </div>

            {/* Symptom Input */}
            <div className="mb-6">
              <label className={`block font-semibold mb-3 text-sm ${themeClasses.labelText}`}>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    themeClasses.inputBg
                  } ${themeClasses.inputBorder} ${themeClasses.inputText} ${themeClasses.inputPlaceholder}`}
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && symptomInput && filteredSuggestions.length > 0 && (
                  <div className={`absolute top-full left-0 right-0 ${themeClasses.dropdownBg} border ${themeClasses.dropdownBorder} rounded-lg mt-2 shadow-xl z-20 max-h-48 overflow-y-auto`}>
                    {filteredSuggestions.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => {
                          setSymptoms([...symptoms, symptom]);
                          setSymptomInput('');
                          setShowSuggestions(false);
                        }}
                        className={`w-full text-left px-4 py-3 transition-colors border-b last:border-b-0 ${themeClasses.dropdownItem}`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                )}

                {voiceNote && (
                  <div className={`mt-2 text-xs md:text-sm ${themeClasses.voiceNote}`}>
                    <span className="font-semibold">Voice:</span> {voiceNote}
                  </div>
                )}
              </div>
            </div>

            {/* Fallback Dropdown */}
            <div className="mb-6">
              <select
                onChange={handleSymptomChange}
                value=""
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer ${themeClasses.selectBg} ${themeClasses.selectBorder}`}
              >
                <option value="" className={isDark ? 'bg-slate-700' : 'bg-white'}>
                  Or select from dropdown list...
                </option>
                {availableSymptoms
                  .filter(s => !symptoms.includes(s))
                  .slice(0, 15)
                  .map((symptom) => (
                    <option key={symptom} value={symptom} className={isDark ? 'bg-slate-700' : 'bg-white'}>
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
                  <label className={`font-semibold ${themeClasses.labelText}`}>
                    Selected Symptoms ({symptoms.length})
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <div
                      key={symptom}
                      className={`${themeClasses.chip} px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      <span className="text-sm font-medium">{symptom}</span>
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className={`rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1 ${
                          isDark ? 'hover:bg-blue-500' : 'hover:bg-blue-100'
                        }`}
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
              <div className={`${themeClasses.errorBg} border rounded-lg p-4 mb-4 flex gap-3`}>
                <MdOutlineWarning className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
                <p className={`${themeClasses.errorText} text-sm`}>{error}</p>
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
              <span>{isListening ? 'Stop Listening' : 'Voice Input'}</span>
            </button>

            <button
              onClick={handleClear}
              className={`${themeClasses.clearButton} font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}
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
          <div className={`${themeClasses.emptyBg} rounded-xl border p-12 text-center`}>
            <MdLocalHospital className="text-slate-400 text-6xl mx-auto mb-4" />
            <p className={`${themeClasses.emptyText} text-lg`}>
              Select your symptoms and click "Predict Disease" to get started
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`${themeClasses.footerBg} border-t mt-12`}>
        <div className={`max-w-5xl mx-auto px-4 md:px-6 py-6 text-center ${themeClasses.footerText} text-sm`}>
          <p>Built with React and AI for better health awareness</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
