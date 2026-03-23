# Medical Diagnosis System - React Frontend

A modern, responsive React frontend for the AI-powered medical diagnosis system with Tailwind CSS styling.

## Features

✨ **Modern UI/UX**
- Clean card-based layout with gradient backgrounds
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Loading spinners and visual feedback

🎤 **Voice Input**
- Real-time voice input using Web Speech API
- Automatic speech recognition
- Voice feedback indicators

📝 **Symptom Selection**
- Multi-select symptom dropdown
- Search/filter functionality
- Visual symptom tags with remove buttons

🔍 **Prediction Results**
- Disease name with confidence score
- Progress bar for confidence visualization
- Precautions and medications lists
- Symptom analysis
- Medical disclaimer

## Tech Stack

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Web Speech API** - Voice input

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend Flask server running on `http://localhost:5000`

## Installation

1. **Navigate to project directory:**
   ```bash
   cd "d:\TEXT BOOKS\SEM_6\ai\project"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Ensure Flask backend is running:**
   ```bash
   python app.py
   ```

4. **Start React development server:**
   ```bash
   npm start
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Project Structure

```
project/
├── App.jsx                  # Main React component
├── App.css                  # Component styles with animations
├── index.js                 # React entry point
├── index.css                # Global styles with Tailwind imports
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── public/
│   └── index.html          # HTML entry point
└── Backend Files (Python)
    ├── app.py              # Flask backend
    ├── train_model.py      # Model training
    ├── predict.py          # Prediction module
    └── disease_info.json   # Disease data
```

## API Integration

The frontend connects to Flask backend endpoints:

### Endpoints Used

1. **GET /symptoms**
   - Fetches available symptoms
   - Populates dropdown list

2. **GET /diseases**
   - Fetches list of diseases
   - Used for reference

3. **POST /predict**
   - Sends selected symptoms
   - Returns prediction with confidence, precautions, and medicines

## Features Breakdown

### 1. Symptom Selection
- Search-enabled dropdown with autocomplete
- Visual symptom tags with remove buttons
- Prevents duplicate selection
- Responsive layout

### 2. Voice Input
```javascript
// Automatic speech recognition
// Shows listening indicator
// Parses voice input to text
// Auto-stops after 5 seconds
```

### 3. Prediction Display
- **Confidence Score:** Visual progress bar
- **Precautions:** Animated list with staggered timing
- **Medicines:** OTC recommendations
- **Symptom Analysis:** Recognized vs unrecognized count

### 4. Animations
- Fade-in on component mount
- Slide-in for list items
- Pulse for listening indicator
- Smooth transitions on all interactive elements

## Responsive Breakpoints

- **Mobile:** < 640px (single column)
- **Tablet:** 640px - 1024px (flexible layout)
- **Desktop:** > 1024px (full grid layout)

## Error Handling

- Connection errors to backend
- Missing fields validation
- Voice recognition fallback
- User-friendly error messages

## Browser Compatibility

✅ **Supported Browsers:**
- Chrome/Chromium (full support)
- Firefox (full support)
- Safari (full support with webkit prefix)
- Edge (full support)

⚠️ **Note:** Voice input requires HTTPS in production browsers

## Customization

### Change Backend URL
Edit in `App.jsx`:
```javascript
const API_URL = 'http://localhost:5000';
```

### Modify Colors
Edit `tailwind.config.js` theme section

### Adjust Animations
Edit `App.css` animation keyframes

## Performance Tips

- Optimized re-renders with React.memo
- CSS animations use GPU acceleration
- Lazy loading for symptom list
- Debounced search input

## Troubleshooting

**Issue:** Backend connection error
- Ensure Flask app is running: `python app.py`
- Check CORS is enabled in Flask
- Verify correct API_URL in code

**Issue:** Voice input not working
- Check browser permissions for microphone
- Ensure HTTPS in production
- Chrome/Firefox have best support

**Issue:** Styles not loading
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Restart dev server: `npm start`

## Building for Production

```bash
npm run build
```

Creates optimized production build in `build/` directory.

## License

This project is part of a medical education system and should be used responsibly.

## Disclaimer

⚠️ **This system is for educational purposes only.**
Always consult qualified healthcare professionals for actual medical diagnosis and treatment.
