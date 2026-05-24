const mongoose = require('mongoose');

const missingPersonSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  description: String,
  lastSeenDate: Date,
  lastSeenLocation: String,
  city: { type: String, trim: true }, // Added for city filtering
  region: { type: String }, // Ethiopian Region (Kilil)
  contactPhone: String,
  
  // Physical Characteristics (Expanded)
  height: String,
  weight: String,
  eyeColor: String,
  hairColor: String,
  race: String, // Ethnies or Skin Tone description
  complexion: String,
  distinguishingMarks: String, // Scars, tattoos, birthmarks

  // Case Classification
  classification: {
      type: String,
      enum: ['Missing', 'Endangered', 'Involuntary', 'Abducted', 'Disability', 'Juvenile', 'Catastrophe', 'Runaway', 'Lost', 'Unknown', 'Other'],
      default: 'Missing'
  },
  
  // New Fields for Detailed Case Submission
  officialVerificationRef: String,
  policeDistrict: String,
  policeCaseNumber: String,
  isPoliceReported: { type: Boolean, default: false },
  vehicleInformation: String, // Make, Model, Color, License Plate
  socialMediaAccounts: String, // URLs or Handles
  isAnonymous: { type: Boolean, default: false }, // For 'Found' reports
  isApproved: { type: Boolean, default: false }, // Moderation flag
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedByName: String,
  approvedByRole: String,
  approvedByEmail: String,
  approvalSource: {
    type: String,
    enum: ['explicit-approver', 'auto-approved-reporter', 'legacy-record']
  },
  status: {
    type: String,
    enum: ['Missing', 'Found', 'Deceased', 'Resolved', 'Cold Case'],
    default: 'Missing'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  images: [{
    url: String, // Path to stored image
    uploadedAt: { type: Date, default: Date.now }
  }],
  faceEmbeddings: {
    type: [Number], // Vector from AI service
    select: false // Don't return by default for performance
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MissingPerson', missingPersonSchema);
