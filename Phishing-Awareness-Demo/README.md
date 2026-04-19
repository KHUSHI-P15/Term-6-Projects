# Phishing Awareness Demo - MERN Stack

A full-stack educational project demonstrating how phishing attacks work and how to protect against them. Built with React, Node.js, Express for a university cybersecurity course assignment.

## 📋 Project Overview

This project simulates a phishing attack on a fake GTU Results login portal. The purpose is purely **educational** to:
- Show how phishing websites work
- Help students recognize phishing attempts
- Provide security tips for identifying fraudulent websites
- Demonstrate why protecting credentials is critical

**Important**: This project does NOT store, log, or transmit any user data. All credentials entered are immediately discarded.

## 🏗️ Project Structure

```
Phishing-Awareness-Demo/
├── backend/
│   ├── server.js          # Express server with /api/login endpoint
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment configuration
├── frontend/
│   ├── public/
│   │   └── index.html    # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginPage.jsx      # Phishing login page
│   │   │   ├── LoginPage.css      # GTU-style styling
│   │   │   ├── PhishingWarning.jsx # Warning/alert page
│   │   │   └── PhishingWarning.css # Warning page styling
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # App styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
└── README.md             # This file
```

## 🎯 Features

### Frontend
- **Fake GTU Results Login Page**: Mimics gturesults.in with:
  - Enrollment Number field
  - Password field
  - Exam dropdown selector
  - CAPTCHA code verification
  - Professional GTU branding and colors
  - Responsive design for all devices

- **Phishing Warning Page**: Displays after form submission with:
  - Red alert banner with warning icon
  - Message: "This was a phishing simulation — your credentials were NOT stored"
  - 5 security tips for identifying phishing websites
  - Learning points about cybersecurity
  - Option to start over

### Backend
- **POST /api/login endpoint**: Accepts form data and returns:
  - `phished: true` flag
  - List of 5 security tips
  - Timestamp of the simulation
  - NO data storage or retention

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone/Navigate to the project**:
   ```bash
   cd Phishing-Awareness-Demo
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

**Terminal 1 - Start Backend Server**:
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend Development Server**:
```bash
cd frontend
npm start
# Frontend runs on http://localhost:3000
```

The application will automatically open in your browser. You should see the GTU Results login page.

## 💻 Usage

1. **On the Login Page**:
   - Enter any Enrollment Number (e.g., `1234567890`)
   - Enter any Password
   - Select an Exam from the dropdown
   - Enter the CAPTCHA code shown (e.g., `5K9J4`)
   - Click "Search Results"

2. **On the Warning Page**:
   - View the security tips
   - Read learning points about phishing
   - Click "Start Over" to return to the login page

## 🔒 Security Features

- **No Data Storage**: All form inputs are immediately discarded
- **No Logging**: Credentials are NOT logged to files, databases, or external services
- **Client-Side Validation**: Form validation ensures all fields are filled
- **HTTPS Ready**: Can be deployed with SSL/TLS certificates
- **CORS Enabled**: Configured for safe cross-origin requests

## 📚 Security Tips Included

The application teaches users to:
1. **Check the URL** - Verify the complete website address
2. **Look for HTTPS and Lock Icon** - Ensure encrypted connection
3. **Verify the Domain** - Confirm the official domain
4. **Never Click Suspicious Links** - Navigate directly instead
5. **Be Cautious of Urgency** - Real institutions don't rush credential requests

## 🛠️ Development

### Available Scripts

**Backend**:
```bash
npm start      # Run server with node
npm run dev    # Run server with nodemon (auto-restart)
```

**Frontend**:
```bash
npm start      # Start development server
npm build      # Create production build
npm test       # Run tests
```

### Technologies Used

**Frontend**:
- React 18.2.0
- CSS3 (Flexbox, Grid, Gradients)
- Fetch API for HTTP requests

**Backend**:
- Node.js
- Express.js 4.18.2
- CORS middleware
- dotenv for environment variables

## 📝 API Documentation

### POST /api/login

**Request**:
```json
{
  "enrollmentNo": "1234567890",
  "password": "any_password",
  "exam": "semester-6",
  "captcha": "5K9J4"
}
```

**Response**:
```json
{
  "phished": true,
  "message": "This is a phishing simulation",
  "tips": [
    {
      "title": "Check the URL",
      "description": "Always verify the website URL in the address bar..."
    },
    ...
  ],
  "timestamp": "2024-04-18T10:30:00.000Z"
}
```

### GET /api/health

Health check endpoint to verify server status.

## 🎓 Educational Context

This project is designed for:
- Computer Networks & Security (CNS) college courses
- Cybersecurity awareness programs
- Information Security training
- IT student education on phishing attacks

**Disclaimer**: This is purely an educational simulation. It does not perform actual phishing, and no data is collected or harmed.

## ⚠️ Important Notes

1. **Educational Purposes Only**: This project is designed exclusively for educational and awareness purposes
2. **No Data Collection**: Zero user information is stored, logged, or transmitted
3. **Ethical Use**: Use only in authorized educational settings
4. **User Consent**: Ensure students/users understand this is a simulation before participation
5. **Clear Labeling**: The simulation is clearly marked as a demo, not a real GTU portal

## 📖 How to Present in Class

1. Show students the fake login page and ask them if they notice anything suspicious
2. Have them attempt to log in
3. Reveal the warning page after form submission
4. Discuss each security tip
5. Relate to real-world phishing examples
6. Answer questions about cybersecurity best practices

## 🔧 Customization

### Modify Styling
- Edit `frontend/src/components/LoginPage.css` to change colors/layout
- Edit `frontend/src/components/PhishingWarning.css` for warning page styling

### Add More Security Tips
Edit `backend/server.js` and add more objects to the `SECURITY_TIPS` array:

```javascript
{
  title: "Your Tip Title",
  description: "Your detailed description..."
}
```

### Change the Target Website
Modify `frontend/src/components/LoginPage.jsx` to mimic a different website while maintaining the educational value.

## 📧 Support

For questions or issues:
1. Check the project structure and ensure all files are present
2. Verify Node.js and npm are installed correctly
3. Ensure both backend and frontend servers are running
4. Check browser console for errors (F12)
5. Check terminal output for server errors

## 📄 License

This project is provided as-is for educational purposes. No warranty is provided.

---

**Remember**: The goal of this project is to **educate and protect**, not to harm or deceive. Use it responsibly in authorized educational settings only.
