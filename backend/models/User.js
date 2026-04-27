const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'law_enforcement', 'authorized_org', 'public_user'],
    default: 'public_user'
  },
  organizationName: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false // For authorities requiring verification
  },
  verificationDocument: String, // Path to uploaded ID/Doc
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
