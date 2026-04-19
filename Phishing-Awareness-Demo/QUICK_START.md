# Phishing Awareness Demo - Quick Reference

## 🚀 Quick Start (Windows)
```bash
# Open Command Prompt in the project folder and run:
start.bat
```

## 🚀 Quick Start (Mac/Linux)
```bash
# Open Terminal in the project folder and run:
chmod +x start.sh
./start.sh
```

## 🚀 Manual Start

### Terminal 1 - Backend
```bash
cd backend
npm install  # Only needed once
npm start
# You should see: "Phishing Awareness Demo server running on http://localhost:5000"
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install  # Only needed once
npm start
# This will automatically open http://localhost:3000 in your browser
```

---

## 📝 How to Use

1. **Login Page** displays a fake GTU Results portal
2. **Fill in the form**:
   - Enrollment No.: Any number (e.g., `1234567890`)
   - Password: Any password (e.g., `test123`)
   - Exam: Any semester
   - CAPTCHA: Type `5K9J4` (shown in the box)
3. **Click "Search Results"**
4. **Warning Page** shows phishing alert with 5 security tips
5. **Click "Start Over"** to go back to login page

---

## 🛑 Stopping the Servers

- **Backend**: Press `Ctrl+C` in the backend terminal
- **Frontend**: Press `Ctrl+C` in the frontend terminal

---

## 🔗 URLs

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | http://localhost:3000 | React app with UI |
| Backend | http://localhost:5000 | Express API server |
| API Login | http://localhost:5000/api/login | POST endpoint |
| Health Check | http://localhost:5000/api/health | Server status |

---

## 💾 Project Size

After dependencies:
- **Backend**: ~200MB (mostly node_modules)
- **Frontend**: ~500MB (mostly node_modules)
- **Source Code**: ~500KB (actual project files)

---

## ✅ Everything Working?

You should see:
- ✅ Login page with GTU branding
- ✅ Form submission does NOT crash
- ✅ Redirect to warning page with red banner
- ✅ 5 security tips displayed
- ✅ "Start Over" button works

---

**For detailed setup instructions, see SETUP_GUIDE.md**
