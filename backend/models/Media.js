// models/Media.js
const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },

  // for images: store file path relative to server root (e.g. 'uploads/xxx.jpg')
  // for videos: store normalized video URL (youtube watch url)
  url: { type: String, default: '' },

  // original filename (optional)
  originalName: { type: String },

  // uploader / createdBy (optional)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },

  createdAt: { type: Date, default: Date.now },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// virtual for public URL (if you want)
MediaSchema.virtual('publicUrl').get(function () {
  if (!this.url) return null;
  // if url is absolute (http...), return as-is, otherwise prefix with API_BASE env
  if (/^https?:\/\//i.test(this.url)) return this.url;
  const base = process.env.API_BASE?.replace(/\/$/, '') || ('http://localhost:4000');
  return `${base}/${this.url.replace(/^\/+/,'')}`;
});

module.exports = mongoose.model('Media', MediaSchema);
