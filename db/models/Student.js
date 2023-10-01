// Student.js

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  rollNumber: { type: String, required: true },
  courseName: { type: String, required: true },
});

module.exports = mongoose.model('Student', studentSchema);
