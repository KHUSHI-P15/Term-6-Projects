// MongoDB integration placeholder.
// This keeps backend structure MERN-ready while using in-memory storage for now.
import mongoose from "mongoose";

// Connects the backend to MongoDB using the URI from .env.
// If the URI is missing, the app still starts so the project stays easy to run.
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MONGO_URI is not set. MongoDB connection skipped.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};
