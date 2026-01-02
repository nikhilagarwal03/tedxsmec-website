// backend/models/FacultyCoordinator.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const FacultyCoordinatorSchema = new Schema({
  name: { type: String, required: true },
  department: String,
  contact: String,
  photo: String,
  bio: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FacultyCoordinator', FacultyCoordinatorSchema);
