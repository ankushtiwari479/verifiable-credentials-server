const mongoose = require('mongoose');

// Define the course schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  }
});

// Create a Course model using the schema
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
