// backend/models/Sponsor.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const SponsorSchema = new Schema({
  name: { type: String, required: true },
  website: String,
  description: String,
  logo: String,     // stored path like 'uploads/xyz.jpg'
  logoUrl: String,  // optional absolute URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sponsor', SponsorSchema);
