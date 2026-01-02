
// backend/models/Organizer.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrganizerSchema = new Schema({
  name: { type: String, required: true },
  role: String,
  linkedin: String,
  twitter: String,
  photo: String,
  bio: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Organizer', OrganizerSchema);
