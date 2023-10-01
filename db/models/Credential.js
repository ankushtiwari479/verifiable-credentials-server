const mongoose = require('mongoose');

// Define the schema for verifiable credentials
const credentialSchema = new mongoose.Schema({
  issuerName: {
    type: String,
    required: true,
  },
  studentDetails: {
    type: mongoose.Schema.Types.ObjectId, // Change to ObjectId type
    ref: 'Student', // Reference the 'Student' model
    required: true,
  },
  courseDetails: {
    type: mongoose.Schema.Types.ObjectId, // Change to ObjectId type
    ref: 'Course', // Reference the 'Course' model
    required: true,
  },
  enrollmentDetails:{
    type: mongoose.Schema.Types.ObjectId, // Change to ObjectId type
    ref: 'Enrollment', // Reference the 'Course' model
    required: true,
  },
  issuanceDate: {
    type: Date,
    default: Date.now, // Set issuance date to the current date and time
  },
  // Add other fields as needed
});

credentialSchema.pre('findOne', function (next) {
  this.populate('courseDetails');
  this.populate('studentDetails');
  this.populate('enrollmentDetails');
  next();
});


// Create and export the "Credential" model based on the schema
module.exports = mongoose.model('Credential', credentialSchema);
