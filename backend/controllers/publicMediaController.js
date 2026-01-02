// controllers/publicMediaController.js
const Media = require('../models/Media');
const Event = require('../models/Event');
const mongoose = require('mongoose');

const DEFAULT_LIMIT = 24;

function parseIntOr(v, d) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? d : n;
}

async function listPublicMedia(req, res) {
  try {
    const page = Math.max(1, parseIntOr(req.query.page, 1));
    const limit = Math.max(1, Math.min(200, parseIntOr(req.query.limit, DEFAULT_LIMIT)));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.type && ['image', 'video'].includes(String(req.query.type))) filter.type = String(req.query.type);
    if (req.query.q) {
      const q = String(req.query.q).trim();
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') }
      ];
    }

    const [items, total] = await Promise.all([
      Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      Media.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      data: items,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('publicMedia.listPublicMedia', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function getPublicMedia(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

    const item = await Media.findById(id).lean().exec();
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });

    return res.json({ success: true, data: item });
  } catch (err) {
    console.error('publicMedia.getPublicMedia', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * GET media mapped to a specific event
 * route: GET /api/media/event/:eventId
 */
async function listMediaForEvent(req, res) {
  try {
    const { eventId } = req.params;
    if (!mongoose.isValidObjectId(eventId)) return res.status(400).json({ success: false, message: 'Invalid eventId' });

    const ev = await Event.findById(eventId).populate('media').lean().exec();
    if (!ev) return res.status(404).json({ success: false, message: 'Event not found' });

    return res.json({ success: true, data: ev.media || [] });
  } catch (err) {
    console.error('publicMedia.listMediaForEvent', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = {
  listPublicMedia,
  getPublicMedia,
  listMediaForEvent
};
