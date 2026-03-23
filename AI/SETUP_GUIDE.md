# 🏥 Medical Diagnosis System - Complete Setup Guide

Complete guide to set up and run the entire Medical Diagnosis System (Backend + Frontend).

## Project Structure

```
d:\TEXT BOOKS\SEM_6\ai\project\
│
├── Python Backend Files
│   ├── train_model.py              # Train ML models
│   ├── predict.py                  # Disease prediction module
│   ├── app.py                      # Flask REST API backend
│   └── disease_info.json           # Disease data (precautions, medicines)
│
├── Dataset Files
│   ├── dataset.csv                 # Main symptoms-disease dataset
│   ├── symptom_Description.csv
│   ├── symptom_precaution.csv
│   └── Symptom-severity.csv
│
├── React Frontend Files
│   ├── App.jsx                     # Main React component
│   ├── App.css                     # Component styles
│   ├── index.js                    # React entry point
│   ├── index.css                   # Global styles
│   ├── package.json                # npm dependencies
│   ├── tailwind.config.js          # Tailwind CSS config
│   ├── postcss.config.js           # PostCSS config
│   ├── public/index.html           # HTML template
│   └── FRONTEND_README.md          # Frontend documentation
│
├── Configuration Files
│   └── .gitignore                  # Git ignore rules
│
└── Documentation
    └── SETUP_GUIDE.md              # This file
```

## Prerequisites

### System Requirements
- Windows 10/11 (or any OS with Command Prompt/Terminal)
- 4GB RAM minimum
- 500MB free disk space

### Software Installation

#### 1. Python Installation
1. Download from [python.org](https://www.python.org/downloads/) (Python 3.8 or higher)
2. Install with "Add Python to PATH" checked
3. Verify: `python --version`

#### 2. Node.js Installation
1. Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)
2. Install with npm option selected
3. Verify: `node --version` and `npm --version`

## Setup Steps

### Step 1: Backend Setup

1. **Open PowerShell in project directory:**
   ```bash
   cd "d:\TEXT BOOKS\SEM_6\ai\project"
   ```

2. **Install Python dependencies:**
   ```bash
   pip install pandas numpy scikit-learn flask flask-cors pickle
   ```

   Or install from requirements.txt (if created):
   ```bash
   pip install -r requirements.txt
   ```

3. **Train the ML model:**
   ```bash
   python train_model.py
   ```
   
   Output: Creates `model.pkl` with trained models and accuracy metrics

   Expected Output:
   ```
   DISEASE PREDICTION SYSTEM - MODEL TRAINING
   ==================================================
   [1] Loading dataset...
   [2] Preprocessing data...
   [3] Encoding symptoms as binary features...
   [4] Splitting dataset into train/test (80/20)...
   [5] Training classification models...
   [6] Evaluating models...
   Decision Tree Classifier:
     Training Accuracy: 0.9234 (92.34%)
     Test Accuracy:     0.8956 (89.56%)
   ...
   ✓ Model saved as 'model.pkl'
   ```

4. **Start Flask backend (keep this terminal open):**
   ```bash
   python app.py
   ```
   
   Expected Output:
   ```
   Model loaded successfully from 'model.pkl'
   ✓ Model loaded successfully
   
   DISEASE PREDICTION FLASK BACKEND
   ==================================================
   STARTING FLASK SERVER
   
   Available endpoints:
     GET  http://localhost:5000/              - API info
     GET  http://localhost:5000/health        - Health check
     POST http://localhost:5000/predict       - Disease prediction
     GET  http://localhost:5000/symptoms      - Available symptoms
     GET  http://localhost:5000/diseases      - Available diseases
   
   Running on http://0.0.0.0:5000/
   ```

   ✅ Backend is now running!

### Step 2: Frontend Setup

1. **Open new PowerShell/terminal in project directory:**
   ```bash
   cd "d:\TEXT BOOKS\SEM_6\ai\project"
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```
   
   This will install:
   - React & React DOM
   - Tailwind CSS
   - Axios (HTTP client)
   - PostCSS & Autoprefixer

3. **Start React development server:**
   ```bash
   npm start
   ```
   
   Expected Output:
   ```
   Compiled successfully!
   
   You can now view medical-diagnosis-frontend in the browser.
   
     Local:            http://localhost:3000
     On Your Network:  http://192.168.x.x:3000
   
   Note that the development build is not optimized.
   To create a production build, use npm run build.
   ```

4. **Browser window opens automatically** at `http://localhost:3000`

## Testing the System

### Test Backend
1. **Health Check:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Get Symptoms:**
   ```bash
   curl http://localhost:5000/symptoms
   ```

3. **Get Diseases:**
   ```bash
   curl http://localhost:5000/diseases
   ```

4. **Test Prediction:**
   ```bash
   curl -X POST http://localhost:5000/predict \
     -H "Content-Type: application/json" \
     -d '{"symptoms": ["fever", "cough"]}'
   ```

### Test Frontend
1. Navigate to `http://localhost:3000`
2. Select symptoms from dropdown
3. Click "Predict Disease" button
4. View results with confidence score, precautions, and medicines
5. Try "Voice Input" button (requires microphone permission)

## Common Issues & Solutions

### Issue: Backend won't start
```
Error: No module named 'sklearn'
```
**Solution:** Install scikit-learn
```bash
pip install scikit-learn
```

### Issue: CORS error in browser console
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Ensure Flask backend is running with CORS enabled in app.py (it is by default)

### Issue: React won't start
```
Error: npm ERR! code ENOENT (Cannot find node_modules)
```
**Solution:** Run npm install
```bash
npm install
```

### Issue: Backend on different machine
1. Edit API_URL in `App.jsx`:
   ```javascript
   const API_URL = 'http://192.168.x.x:5000'; // Your backend IP
   ```
2. In `app.py`, run Flask on specific IP:
   ```python
   app.run(host='0.0.0.0', port=5000)
   ```

### Issue: Port 5000 or 3000 already in use
**For Flask:**
```bash
python app.py --port 5001
```

**For React:**
```bash
PORT=3001 npm start
```
Then update API_URL accordingly.

## Workflow

### Training (One-time)
```
python train_model.py
```

### Running the Full System
**Terminal 1 - Backend:**
```bash
python app.py
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm start
# Runs on http://localhost:3000
```

### Making Predictions
1. Open http://localhost:3000
2. Select symptoms (e.g., "fever", "cough", "headache")
3. Click "Predict Disease" or use "Voice Input"
4. View results with recommendations

## Deployment

### Production Build Frontend
```bash
npm run build
```
Creates optimized build in `build/` folder.

### Deploy Backend to Production
1. Install gunicorn:
   ```bash
   pip install gunicorn
   ```

2. Run with gunicorn:
   ```bash
   gunicorn -w 4 app:app
   ```

3. Deploy using Docker, AWS, Heroku, etc.

## File Descriptions

### Model Training
- **train_model.py** - Trains DecisionTree & RandomForest models, saves best as model.pkl

### Prediction
- **predict.py** - Loads model, predicts disease from symptoms, returns confidence score

### Backend API
- **app.py** - Flask REST API server with CORS enabled

### Disease Info
- **disease_info.json** - Maps diseases to precautions and OTC medicines

### Frontend
- **App.jsx** - Main React component with symptom selector and results
- **App.css** - Component styles with Tailwind and custom animations
- **index.js** - React entry point
- **index.css** - Global styles with Tailwind imports

## Support

### Check Backend Health
```
GET http://localhost:5000/health
```

### View Backend Logs
Check PowerShell/terminal where Flask is running

### View Frontend Console
Open DevTools in browser (F12) → Console tab

### Test API with Postman
1. Install [Postman](https://www.postman.com/downloads/)
2. POST to `http://localhost:5000/predict`
3. Headers: `Content-Type: application/json`
4. Body: `{"symptoms": ["fever", "cough"]}`

## Next Steps

1. ✅ Install Python dependencies
2. ✅ Train the model (`python train_model.py`)
3. ✅ Start backend (`python app.py`)
4. ✅ Install Node dependencies (`npm install`)
5. ✅ Start frontend (`npm start`)
6. ✅ Test the system
7. 🎉 Enjoy!

## System Features Summary

### Backend
- ✅ ML model trained on symptom-disease dataset
- ✅ DecisionTree & RandomForest classifiers
- ✅ REST API with CORS
- ✅ Error handling and validation
- ✅ Disease info with precautions & medicines

### Frontend
- ✅ Multi-select symptom dropdown
- ✅ Voice input using Web Speech API
- ✅ Real-time prediction with confidence score
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Medical disclaimer
- ✅ Tailwind CSS styling

## Troubleshooting Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js LTS installed
- [ ] Python packages installed: pandas, numpy, scikit-learn, flask, flask-cors
- [ ] npm packages installed: `npm install`
- [ ] Model trained: `python train_model.py`
- [ ] Backend running: `python app.py` (port 5000)
- [ ] Frontend running: `npm start` (port 3000)
- [ ] Browser opens to http://localhost:3000
- [ ] Backend health check working
- [ ] Can select symptoms and make predictions

---

**Made with ❤️ for better health awareness**

For issues or questions, check the individual README files:
- Backend: See docstrings in Python files
- Frontend: See FRONTEND_README.md
