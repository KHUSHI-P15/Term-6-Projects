const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security tips for the warning page
const SECURITY_TIPS = [
  {
    title: "Check the URL",
    description: "Always verify the website URL in the address bar. Phishing sites often use similar-looking URLs with slight variations (gturesults.in vs gtuResults-online.com)"
  },
  {
    title: "Look for HTTPS and Lock Icon",
    description: "Legitimate websites use HTTPS encryption. Look for the green lock icon in the address bar before entering sensitive information."
  },
  {
    title: "Verify the Domain",
    description: "Check the domain name carefully. Attackers often register domains that look similar to legitimate ones. GTU's official domain is gturesults.in"
  },
  {
    title: "Never Click Suspicious Links",
    description: "If you receive unexpected links via email or messages claiming to be from GTU or your college, don't click them directly. Navigate to the official website instead."
  },
  {
    title: "Be Cautious of Urgency and Requests for Credentials",
    description: "Phishing emails often create urgency or request personal information. Legitimate institutions never ask for passwords via email or links."
  }
];

// POST endpoint for login (does not store anything)
app.post('/api/login', (req, res) => {
  const { enrollmentNo, password, exam, captcha } = req.body;

  // Log the attempt (optional, for educational purposes only)
  console.log(`Phishing simulation attempt - Enrollment: ${enrollmentNo}`);

  // Return phishing response
  // Important: No data is stored anywhere
  res.status(200).json({
    phished: true,
    message: "This is a phishing simulation",
    tips: SECURITY_TIPS,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Simple welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Phishing Awareness Demo Backend - Educational Project',
    endpoints: {
      login: 'POST /api/login',
      health: 'GET /api/health'
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Phishing Awareness Demo server running on http://localhost:${PORT}`);
  console.log('This is an EDUCATIONAL project for cybersecurity awareness.');
});
