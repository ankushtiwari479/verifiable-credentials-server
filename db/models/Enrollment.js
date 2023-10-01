const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

enrollmentSchema.pre('findOne', function (next) {
  this.populate('course');
  next();
});


const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
