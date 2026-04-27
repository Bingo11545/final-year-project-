const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MissingPerson',
    required: true
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // tips can be anonymous or from logged in users
  },
  reporterName: String, // For anonymous or quick display
  contactInfo: String,
  message: {
    type: String,
    required: true
  },
  location: String,
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['New', 'Reviewed', 'Verified - Match', 'False Lead'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tip', tipSchema);