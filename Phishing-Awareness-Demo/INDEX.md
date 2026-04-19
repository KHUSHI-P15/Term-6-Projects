# 📚 Phishing Awareness Demo - Documentation Index

## 🎯 Start Here Based on Your Need

### 👤 **If you're new to this project:**
1. Read: [README.md](README.md) - Project overview (2 min read)
2. Read: [SETUP_GUIDE.md](SETUP_GUIDE.md) - Step-by-step setup (5 min read)
3. Run: `start.bat` (Windows) or `./start.sh` (Mac/Linux)
4. Test: Open http://localhost:3000

### ⚡ **If you just want to run it quickly:**
1. Open terminal in project folder
2. Windows: `start.bat`
3. Mac/Linux: `chmod +x start.sh && ./start.sh`
4. Open http://localhost:3000

### 🔍 **If you need detailed technical info:**
1. See: [FILES_OVERVIEW.md](FILES_OVERVIEW.md) - Complete file structure
2. See: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Technical specifications
3. See: [README.md](README.md) - API documentation

### 🎓 **If you're using this in class:**
1. Read: [SETUP_GUIDE.md](SETUP_GUIDE.md) - Full instructions
2. Section: "How to Present in Class"
3. Section: "Security Tips Included"
4. Run and test first (important!)

### 🛠️ **If you want to customize it:**
1. See: [FILES_OVERVIEW.md](FILES_OVERVIEW.md) - File descriptions
2. See: [README.md](README.md) - Customization section
3. Edit files - All well-commented

### 🚩 **If something isn't working:**
1. See: [SETUP_GUIDE.md](SETUP_GUIDE.md) - Troubleshooting section
2. Check: Are both backend and frontend servers running?
3. Check: Browser console (F12) for errors
4. Check: Terminal output for error messages

---

## 📖 Documentation Files

| File | Purpose | Read Time | Best For |
|------|---------|-----------|----------|
| [README.md](README.md) | Complete project overview, features, API docs | 5-10 min | Understanding the project |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Step-by-step installation and testing | 10-15 min | Initial setup |
| [QUICK_START.md](QUICK_START.md) | Quick commands and reference | 2-3 min | Quick lookup |
| [FILES_OVERVIEW.md](FILES_OVERVIEW.md) | Detailed file structure and purposes | 5 min | Understanding code |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Complete summary and checklist | 5 min | Verification |
| **INDEX.md** (this file) | Navigation guide | 2 min | Finding what you need |

---

## 📁 Code Files

| Location | File | Purpose | Lines |
|----------|------|---------|-------|
| `backend/` | server.js | Express API server | ~80 |
| `backend/` | package.json | Dependencies | ~25 |
| `frontend/src/` | App.jsx | Main React component | ~50 |
| `frontend/src/components/` | LoginPage.jsx | Fake login page | ~150 |
| `frontend/src/components/` | LoginPage.css | Login styling | ~350 |
| `frontend/src/components/` | PhishingWarning.jsx | Warning page | ~80 |
| `frontend/src/components/` | PhishingWarning.css | Warning styling | ~250 |

---

## 🚀 Quick Commands

### First Time Setup
```bash
# Windows
start.bat

# Mac/Linux
chmod +x start.sh
./start.sh
```

### Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

### Stop Servers
```bash
# Press Ctrl+C in each terminal
```

### Clean Install
```bash
# Remove node_modules
rm -rf backend/node_modules frontend/node_modules

# Reinstall
cd backend && npm install
cd ../frontend && npm install
```

---

## ✅ Verification Checklist

Use this to verify everything works:

- [ ] Node.js installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Backend starts without errors
- [ ] Frontend starts on http://localhost:3000
- [ ] Login page displays properly
- [ ] Form fields are visible and functional
- [ ] Form submission works
- [ ] Warning page appears after submission
- [ ] Security tips are displayed
- [ ] "Start Over" button works
- [ ] Styling looks good

---

## 🎯 Feature Checklist

### Frontend Features
- [ ] GTU Results login page visible
- [ ] Enrollment No. field works
- [ ] Password field works
- [ ] Exam dropdown populated
- [ ] CAPTCHA code display
- [ ] Form validation working
- [ ] Submit button responsive
- [ ] Warning page styled with red banner
- [ ] 5 security tips displayed
- [ ] Learning points shown
- [ ] "Start Over" returns to login

### Backend Features
- [ ] Server starts on port 5000
- [ ] `/api/login` endpoint responsive
- [ ] Form data accepted
- [ ] JSON response returns correctly
- [ ] Security tips included
- [ ] Health check endpoint works
- [ ] No data stored
- [ ] No errors in console

---

## 📊 Technology Stack

### Frontend Technologies
- React 18.2.0
- CSS3 (Flexbox, Grid, Gradients)
- Fetch API
- HTML5

### Backend Technologies
- Node.js
- Express 4.18.2
- CORS middleware
- JavaScript (ES6+)

### Development Tools
- npm (package manager)
- nodemon (auto-reload)
- react-scripts (build tools)

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | React login page |
| Backend | http://localhost:5000 | Express API |
| API Endpoint | http://localhost:5000/api/login | Form processor |
| Health Check | http://localhost:5000/api/health | Server status |

---

## 📞 Troubleshooting Quick Links

### Common Issues
- **"npm command not found"** → Install Node.js from nodejs.org
- **"Port 5000 already in use"** → Change port in backend/.env
- **"Blank white screen"** → Ctrl+Shift+R (hard refresh) or F12 console check
- **"Cannot GET /"** → Ensure both servers running
- **"Form won't submit"** → Check browser console (F12)

For full troubleshooting:
👉 See [SETUP_GUIDE.md](SETUP_GUIDE.md) - Troubleshooting section

---

## 🎓 For Classroom Use

### Before Class
1. Setup the project (follow SETUP_GUIDE.md)
2. Test it works (run and verify)
3. Have both servers ready
4. Inform students about simulation

### During Class
1. Show login page
2. Ask: "Recognize anything suspicious?"
3. Have volunteer fill form
4. Click submit → Show warning
5. Discuss each security tip
6. Connect to real-world examples

### After Class
1. Assign: Research real phishing examples
2. Assign: Identify security issues in websites
3. Assign: Create security poster
4. Optional: Modify project for assignment

---

## 💡 Customization Ideas

### Easy Changes (Edit .jsx or .css files)
- [ ] Change colors or fonts
- [ ] Add more security tips
- [ ] Modify form fields
- [ ] Update warning message
- [ ] Add your college branding

### Medium Changes (Edit backend)
- [ ] Change API endpoint name
- [ ] Add more endpoints
- [ ] Modify response format
- [ ] Add timestamp logging

### Advanced Changes (New features)
- [ ] Add database integration
- [ ] Create multiple scenarios
- [ ] Add time-based challenges
- [ ] Deploy to cloud
- [ ] Add user analytics

---

## 📚 Learning Resources

### Understanding the Code
1. **React**: See LoginPage.jsx - simple component structure
2. **Express**: See server.js - basic API endpoint
3. **CSS**: See LoginPage.css - responsive design
4. **Forms**: See App.jsx - form handling

### Security Concepts
- See SECURITY_TIPS in backend/server.js
- Read the warning page learning points
- Research real GTU phishing attempts
- Study OWASP security guidelines

---

## 🎉 Ready to Go!

**Next Steps:**
1. Choose your approach from the top of this file
2. Follow the relevant guide
3. Run the start script
4. Test the application
5. Use in your course!

---

## 📞 Quick Help

| Question | Answer |
|----------|--------|
| How do I start? | See "Quick Commands" section above |
| Does it work offline? | Yes, only needs localhost |
| Is data stored? | No, by design (educational) |
| Can I customize? | Yes, all files are editable |
| Can students use it? | Yes, great assignment |
| Is it safe? | Yes, completely safe and ethical |
| How long to setup? | 10-15 minutes |

---

**Happy Learning! 🚀**

*For more help, refer to specific documentation files linked above.*
