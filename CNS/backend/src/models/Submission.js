import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    passwordLength: {
      type: Number,
      required: true,
      min: 1
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    detected: {
      type: Boolean,
      default: false
    },
    sourcePage: {
      type: String,
      default: "Student Verification"
    },
    entryStatus: {
      type: String,
      enum: ["Captured", "Submitted", "Recorded"],
      default: "Submitted"
    }
  },
  {
    versionKey: false
  }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
