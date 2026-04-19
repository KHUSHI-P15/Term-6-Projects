# Phishing Awareness Demo - Project Files Overview

## 📁 Complete File Structure

```
Phishing-Awareness-Demo/
│
├── 📖 README.md                          # Main project documentation
├── 📖 SETUP_GUIDE.md                     # Detailed setup instructions
├── 📖 QUICK_START.md                     # Quick reference guide
├── ⚙️  start.bat                         # Windows quick-start script
├── ⚙️  start.sh                          # Mac/Linux quick-start script
├── 📝 .gitignore                         # Git ignore patterns
│
├── 📂 backend/                           # Node.js + Express server
│   ├── server.js                         # Main server file (🎯 START HERE)
│   ├── package.json                      # Backend dependencies
│   ├── .env                              # Environment variables
│   └── node_modules/                     # Dependencies (created after npm install)
│
└── 📂 frontend/                          # React application
    ├── package.json                      # Frontend dependencies
    ├── public/
    │   └── index.html                    # HTML template
    ├── src/
    │   ├── App.jsx                       # Main React component
    │   ├── App.css                       # App styles
    │   ├── index.js                      # React entry point
    │   ├── index.css                     # Global styles
    │   └── components/
    │       ├── LoginPage.jsx             # Fake GTU login page (🎯 START HERE)
    │       ├── LoginPage.css             # Login styling
    │       ├── PhishingWarning.jsx       # Warning page component (🎯 START HERE)
    │       └── PhishingWarning.css       # Warning page styling
    └── node_modules/                     # Dependencies (created after npm install)
```

## 🎯 Key Files by Purpose

### Understanding the Project

1. **Start Here**: [README.md](README.md)
   - Project overview
   - Features and structure
   - API documentation

2. **Setup Instructions**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
   - Step-by-step installation
   - Troubleshooting guide
   - Testing procedures

3. **Quick Reference**: [QUICK_START.md](QUICK_START.md)
   - Commands cheat sheet
   - URLs reference
   - Quick tips

### Frontend Components

| File | Purpose | Lines |
|------|---------|-------|
| `frontend/src/components/LoginPage.jsx` | Fake GTU login page UI | ~150 |
| `frontend/src/components/LoginPage.css` | Login page styling | ~350 |
| `frontend/src/components/PhishingWarning.jsx` | Warning page after phishing | ~80 |
| `frontend/src/components/PhishingWarning.css` | Warning page styling | ~250 |
| `frontend/src/App.jsx` | Main app router/logic | ~50 |

### Backend Files

| File | Purpose | Lines |
|------|---------|-------|
| `backend/server.js` | Express server + /api/login endpoint | ~80 |
| `backend/package.json` | Dependencies (express, cors, dotenv) | ~25 |
| `backend/.env` | Environment configuration | ~2 |

## 🔄 Data Flow

### User Submits Login Form:
```
1. User fills form on LoginPage.jsx
   ↓
2. Form data sent to App.jsx
   ↓
3. App.jsx makes POST request to http://localhost:5000/api/login
   ↓
4. Backend server.js receives request
   ↓
5. server.js returns: { phished: true, tips: [...] }
   ↓
6. App.jsx redirects to PhishingWarning.jsx with tips
   ↓
7. Warning page displays with educational content
```

## 📊 Technology Stack

### Frontend
- **React 18.2.0** - UI framework
- **CSS3** - Styling (Flexbox, Grid, Gradients)
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Styling Features
- **Responsive Design**: Works on mobile, tablet, desktop
- **Color Scheme**: GTU official colors (dark blue, orange)
- **Accessibility**: Semantic HTML, readable fonts
- **Animations**: Smooth transitions and hover effects

## 🧪 Testing Checklist

Before presenting to class, verify:

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Login page displays correctly
- [ ] Form validation works (all fields required)
- [ ] Form submission triggers API call
- [ ] Warning page appears after submission
- [ ] Security tips display properly
- [ ] "Start Over" button returns to login
- [ ] Styling looks professional on desktop
- [ ] Styling looks good on mobile (use F12 → responsive mode)

## 🎓 Educational Content

### Security Tips Covered
1. Check the URL
2. Look for HTTPS and Lock Icon
3. Verify the Domain
4. Never Click Suspicious Links
5. Be Cautious of Urgency and Credential Requests

### Learning Outcomes Students Should Achieve
- Understand how phishing attacks appear legitimate
- Know how to identify phishing websites
- Learn to verify URLs before entering credentials
- Understand HTTPS and security certificates
- Recognize social engineering tactics

## 🔐 Security Implementation

### No Data Collection
- ❌ No database
- ❌ No file logging
- ❌ No external API calls
- ❌ No credential storage
- ✅ Immediate data discard

### API Design
- Single POST endpoint: `/api/login`
- Accepts form data: enrollmentNo, password, exam, captcha
- Returns only: phished flag + security tips
- No user information retained

## 🚀 Deployment Ready Features

The project can be deployed to:
- **Heroku** - Free tier available
- **Replit** - Online IDE and hosting
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **AWS**, **Azure**, **Google Cloud** - Full deployment

See README.md for deployment instructions.

## 📞 Maintenance Notes

### For Instructors Using This Project

1. **Each Semester**:
   - Verify links still work
   - Test with students before class
   - Update GTU results URL if changed

2. **If You Modify**:
   - Keep backup of originals
   - Document changes
   - Re-test fully
   - Update this file

3. **Student Modifications**:
   - Encourage adding custom styles
   - Suggest adding more security tips
   - Ask them to research real phishing examples
   - Have them explain the code to class

## 📝 File Management Tips

### To Keep Clean:
```bash
# Remove node_modules if needed (run npm install to restore):
rm -rf backend/node_modules frontend/node_modules

# Create .zip for distribution:
# Right-click folder → Send to → Compressed folder (Windows)
# zip -r Phishing-Demo.zip Phishing-Awareness-Demo/ (Mac/Linux)
```

### File Sizes:
- Source files only: ~500 KB
- With node_modules: ~700 MB
- Distribution .zip: ~200 MB

## ✨ Project Quality

### Code Standards Met:
- ✅ Modular component structure
- ✅ Clear variable/function names
- ✅ Proper error handling
- ✅ CSS best practices
- ✅ Responsive design
- ✅ Cross-browser compatible
- ✅ Accessible (semantic HTML)

### Documentation Quality:
- ✅ Comprehensive README
- ✅ Detailed setup guide
- ✅ Quick start reference
- ✅ Inline code comments
- ✅ API documentation
- ✅ Troubleshooting guide

---

**Want to start? Run: `node start.bat` (Windows) or `./start.sh` (Mac/Linux)**

**Questions? See SETUP_GUIDE.md for troubleshooting**
