# Phishing Awareness Demo - Setup Guide

## ✅ Pre-Installation Checklist

Before you begin, ensure you have:
- [ ] Node.js installed (v14 or higher) - Download from https://nodejs.org/
- [ ] npm installed (comes with Node.js)
- [ ] A code editor (VS Code recommended)
- [ ] Git installed (optional but recommended)

**Verify Installation**:
```bash
node --version    # Should show v14.0.0 or higher
npm --version     # Should show 6.0.0 or higher
```

---

## 📥 Step 1: Install Backend Dependencies

Open a terminal/command prompt and navigate to the backend folder:

```bash
cd Phishing-Awareness-Demo/backend
npm install
```

This will install:
- `express` - Web framework for Node.js
- `cors` - Cross-Origin Resource Sharing middleware
- `dotenv` - Environment variable management
- `nodemon` - Auto-restart server on file changes (dev dependency)

**Expected output**: You should see a message like "added XX packages..."

---

## 📥 Step 2: Install Frontend Dependencies

Open another terminal and navigate to the frontend folder:

```bash
cd Phishing-Awareness-Demo/frontend
npm install
```

This will install:
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-scripts` - Build scripts and dev server

**Expected output**: You should see a message like "added XX packages..."

---

## 🚀 Step 3: Start the Backend Server

In your first terminal (in the `backend` folder), run:

```bash
npm start
```

**You should see**:
```
Phishing Awareness Demo server running on http://localhost:5000
This is an EDUCATIONAL project for cybersecurity awareness.
```

✅ **Backend is running on**: `http://localhost:5000`

**Keep this terminal open.**

---

## 🚀 Step 4: Start the Frontend Development Server

In your second terminal (in the `frontend` folder), run:

```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`.

**You should see**: The GTU Results login page with:
- GTU logo in the top left
- "Check Your Results" heading
- Enrollment No., Password, Exam, and CAPTCHA fields
- Search Results button

✅ **Frontend is running on**: `http://localhost:3000`

---

## 🧪 Testing the Application

### Test the Phishing Simulation:

1. **On the Login Page**:
   - Enrollment No.: `1234567890` (or any number)
   - Password: `test123` (or any password)
   - Exam: Select "Semester 6" (or any option)
   - CAPTCHA Code: `5K9J4` (as shown in the box)
   - Click "Search Results"

2. **Expected Behavior**:
   - Page should redirect to a warning page
   - Large red banner saying "You Have Been Phished!"
   - Message: "This was a phishing simulation — your credentials were NOT stored"
   - 5 security tips displayed in cards
   - "Start Over" button to return to login

3. **Click "Start Over"**:
   - Should return to the login page
   - Form should be cleared

✅ **If you see this flow, everything is working correctly!**

---

## 🔧 Troubleshooting

### Issue: "npm command not found"
**Solution**: Node.js might not be installed. Download from https://nodejs.org/ and install it.

### Issue: Port 5000 is already in use
**Solution**: Either:
- Stop the application using port 5000, or
- Change the port in `backend/.env` to a different port (e.g., 5001)

### Issue: Port 3000 is already in use
**Solution**: The frontend will automatically try the next available port. Check the terminal output for the actual URL.

### Issue: "Cannot GET /"
**Solution**: Make sure both backend and frontend servers are running.

### Issue: Form doesn't submit
**Solution**: 
- Ensure all fields are filled in
- Check the browser console (F12 → Console tab) for errors
- Verify the backend server is running (should see output in backend terminal)

### Issue: Blank page or white screen
**Solution**:
- Clear browser cache (Ctrl+Shift+Delete on Windows)
- Hard refresh the page (Ctrl+Shift+R)
- Check browser console for JavaScript errors (F12 → Console)

### Issue: Styling looks off
**Solution**: 
- Hard refresh the page (Ctrl+Shift+R)
- Clear browser cache
- Check that all CSS files exist in the `src/components/` folder

---

## 📁 File Structure Verification

Before running, verify this folder structure exists:

```
Phishing-Awareness-Demo/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── node_modules/ (created after npm install)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── LoginPage.css
│   │   │   ├── PhishingWarning.jsx
│   │   │   └── PhishingWarning.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── node_modules/ (created after npm install)
├── README.md
├── SETUP_GUIDE.md (this file)
└── .gitignore
```

---

## 🎓 In-Class Demo Suggestions

### Setup Before Class:
1. Run both servers in separate terminals
2. Keep the login page open in your browser
3. Have security tips printed or ready to discuss

### During Class Presentation:
1. Ask students: "Do you think this is the real GTU website?"
2. Let them examine the login page carefully
3. Ask: "What details would you check before logging in?"
4. Have a student volunteer submit the form
5. Reveal the phishing warning page
6. Discuss each security tip
7. Connect to real-world phishing examples

### Discussion Points:
- How did the fake site appear legitimate?
- What should you have noticed?
- What do you do if you receive a suspicious link via email?
- How does phishing harm people/organizations?
- What's the difference between phishing and other attacks?

---

## 🔐 Security Notes for Instructors

**Important**: Before running this in a class environment:

1. **Inform Students**: Make it clear this is a SIMULATION and educational exercise
2. **Get Permission**: Ensure students understand and consent to participate
3. **No Real Harm**: Emphasize that NO real credentials are collected
4. **Educational Value**: Frame it as a learning opportunity
5. **Ethical Use**: Use only in authorized educational settings

The application:
- ✅ Does NOT store any data
- ✅ Does NOT log credentials to files
- ✅ Does NOT send data to external servers
- ✅ Does NOT use any database
- ✅ Immediately discards all form inputs

---

## 💡 Next Steps / Customization

### If You Want to Modify:

1. **Change Colors**: Edit CSS files in `frontend/src/components/`
2. **Add More Security Tips**: Edit the `SECURITY_TIPS` array in `backend/server.js`
3. **Modify Login Fields**: Edit `LoginPage.jsx` to add/remove form fields
4. **Change Warning Message**: Edit `PhishingWarning.jsx` to customize the warning

### If You Want to Deploy:

See the main README.md for deployment instructions.

---

## 📞 Getting Help

If you encounter issues:

1. **Check Terminal Output**: Both terminals should show active logging
2. **Browser Console**: Press F12 to see JavaScript errors
3. **Network Tab**: Check if API requests are being made to /api/login
4. **Re-read Troubleshooting**: This guide has solutions for common issues

---

## ✨ You're All Set!

You now have a fully functional Phishing Awareness Demo MERN stack project. 

**Next**: Open your browser to `http://localhost:3000` and test the application!

---

**Happy Learning! 🎓**
