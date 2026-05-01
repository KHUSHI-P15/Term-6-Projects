const mongoose = require('mongoose')

const DocumentSchema = new mongoose.Schema({
  title: String,
  filename: String,
  url: String,
  tags: [String],
  size: Number,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Document', DocumentSchema)
