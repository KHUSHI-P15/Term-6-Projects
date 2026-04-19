const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    session: {
      type: String,
      default: 'Winter 2025',
    },
    exam: {
      type: String,
      required: true,
    },
    enrollmentNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    captcha: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Submission', submissionSchema);
