// backend/models/Speaker.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const SpeakerSchema = new Schema({
  name: { type: String, required: true },
  designation: String,
  topic: String,
  bio: String,
  // store uploaded filename/path here (e.g. uploads/xxxxx.jpg) or absolute URL
  photo: String,
  // legacy field if some clients expect imageUrl
  imageUrl: String,
  // social links stored as an object for flexibility
  socialLinks: {
    linkedin: String,
    twitter: String,
    instagram: String,
    youtube: String,
    website: String,
    // allow other keys if needed
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Speaker', SpeakerSchema);
