
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    verifiableCredential: Object,
});

module.exports = mongoose.model('Certificate', certificateSchema);
