import Submission from "../models/Submission.js";

// Basic input sanitization for educational project scope.
// Keeps username readable but removes risky special characters.
const sanitizeUsername = (value) => {
  return String(value || "")
    .trim()
    .replace(/[<>"'`;(){}]/g, "")
    .slice(0, 100);
};

const buildLatestSubmissions = (documents) => {
  return documents.map((item, index) => ({
    id: item._id,
    username: item.username,
    password: item.password,
    passwordMasked: "*".repeat(Math.max(1, Math.min(item.passwordLength || 8, 12))),
    passwordLength: item.passwordLength || 0,
    submittedAt: item.submittedAt,
    status: index === 0 ? "Recorded" : item.detected ? "Captured" : "Submitted",
    sourcePage: item.sourcePage || "Student Verification",
    detected: item.detected
  }));
};

export const submitFakeLogin = async (req, res) => {
  const { username, password } = req.body;
  const cleanedUsername = sanitizeUsername(username);
  const rawPassword = String(password || "").trim();

  if (!cleanedUsername || !rawPassword) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required."
    });
  }

  const created = await Submission.create({
    username: cleanedUsername,
    password: rawPassword,
    passwordLength: rawPassword.length,
    sourcePage: "Student Verification",
    entryStatus: "Submitted"
  });

  // Do not return sensitive values in full in normal apps.
  // Here we intentionally return masked values for awareness demo.
  return res.status(201).json({
    success: true,
    message: "Simulation data captured.",
    payload: {
      id: created._id,
      username: created.username,
      passwordLength: rawPassword.length,
      submittedAt: created.submittedAt
    },
    warning: "This was a phishing simulation. Never submit credentials on suspicious websites."
  });
};

export const fetchStats = async (req, res) => {
  const latestDocuments = await Submission.find().sort({ submittedAt: -1 }).limit(20).lean();
  const totalSubmissions = await Submission.countDocuments();
  const allSubmissionDocs = await Submission.find({}, { username: 1, passwordLength: 1 }).lean();

  // Prepare a simple 7-day trend for dashboard charts.
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyDocs = await Submission.find({ submittedAt: { $gte: sevenDaysAgo } })
    .sort({ submittedAt: 1 })
    .lean();

  const dailyMap = new Map();
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + i);
    const key = date.toISOString().slice(0, 10);
    dailyMap.set(key, 0);
  }

  weeklyDocs.forEach((item) => {
    const key = new Date(item.submittedAt).toISOString().slice(0, 10);
    if (dailyMap.has(key)) {
      dailyMap.set(key, dailyMap.get(key) + 1);
    }
  });

  const attemptsTrend = Array.from(dailyMap.entries()).map(([date, attempts]) => ({
    date,
    attempts
  }));

  const uniqueUsernamesSet = new Set(
    allSubmissionDocs.map((item) => String(item.username || "").trim().toLowerCase())
  );
  const uniqueUsernames = uniqueUsernamesSet.size;

  const passwordLengths = allSubmissionDocs
    .map((item) => Number(item.passwordLength || 0))
    .filter((value) => value > 0);
  const avgPasswordLength = passwordLengths.length
    ? Number(
        (
          passwordLengths.reduce((total, value) => total + value, 0) /
          passwordLengths.length
        ).toFixed(2)
      )
    : 0;

  let shortPasswords = 0;
  let mediumPasswords = 0;
  let longPasswords = 0;

  passwordLengths.forEach((length) => {
    if (length <= 4) {
      shortPasswords += 1;
      return;
    }

    if (length <= 8) {
      mediumPasswords += 1;
      return;
    }

    longPasswords += 1;
  });

  const passwordLengthDistribution = [
    { label: "1-4 Characters", count: shortPasswords },
    { label: "5-8 Characters", count: mediumPasswords },
    { label: "9+ Characters", count: longPasswords }
  ];

  const repeatAttempts = Math.max(totalSubmissions - uniqueUsernames, 0);
  const userBehaviorBreakdown = [
    { name: "Unique Usernames", value: uniqueUsernames },
    { name: "Repeat Attempts", value: repeatAttempts }
  ];

  return res.status(200).json({
    success: true,
    totalSubmissions,
    latestSubmissions: buildLatestSubmissions(latestDocuments),
    totalAttempts: totalSubmissions,
    uniqueUsernames,
    averagePasswordLength: avgPasswordLength,
    latestActivity: latestDocuments[0]?.submittedAt || null,
    attemptsTrend,
    passwordLengthDistribution,
    userBehaviorBreakdown
  });
};

export const fetchAnalytics = async (req, res) => {
  const latestDocuments = await Submission.find()
    .sort({ submittedAt: -1 })
    .limit(5)
    .lean();

  return res.status(200).json({
    success: true,
    data: {
      totalSubmissions: await Submission.countDocuments(),
      lastSubmissionAt: latestDocuments[0]?.submittedAt || null,
      recentSubmissions: buildLatestSubmissions(latestDocuments)
    }
  });
};

export const fetchSubmissions = async (req, res) => {
  const documents = await Submission.find().sort({ submittedAt: -1 }).lean();

  return res.status(200).json({
    success: true,
    total: documents.length,
    data: buildLatestSubmissions(documents)
  });
};
