const mongoose = require('mongoose');

const storedFileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  data: {
    type: Buffer,
    required: true,
    select: false
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  purpose: {
    type: String,
    enum: ['person-image', 'verification-doc', 'other'],
    default: 'other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StoredFile', storedFileSchema);
