// controllers/eventMediaController.js
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Media = require('../models/Media');

function normalizeYouTubeUrl(u) {
  if (!u) return null;
  // match common youtube patterns and return watch url
  const re = /(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const m = String(u).match(re);
  return m ? `https://www.youtube.com/watch?v=${m[1]}` : null;
}

exports.addMediaToEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid eventId' });
    }

    const { mediaId, type, title, url } = req.body;

    // find event early
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    let mediaItem = null;

    if (mediaId) {
      if (!mongoose.isValidObjectId(mediaId)) {
        return res.status(400).json({ success: false, message: 'Invalid mediaId' });
      }
      mediaItem = await Media.findById(mediaId);
      if (!mediaItem) return res.status(404).json({ success: false, message: 'Media not found' });
    } else if (type === 'video' && url) {
      // create new video entry (normalize YouTube)
      const normalized = normalizeYouTubeUrl(url);
      if (!normalized) {
        return res.status(400).json({ success: false, message: 'Invalid YouTube URL' });
      }
      mediaItem = await Media.create({
        type: 'video',
        title: title || '',
        url: normalized,
        createdBy: req.user?.id
      });
    } else {
      return res.status(400).json({ success: false, message: 'mediaId or (type=video + url) required' });
    }

    // atomic add (avoid duplicates)
    await Event.findByIdAndUpdate(eventId, { $addToSet: { media: mediaItem._id } }).exec();

    const populated = await Event.findById(eventId).populate('media').lean().exec();
    return res.json({ success: true, message: 'Mapped', data: populated });
  } catch (err) {
    console.error('addMediaToEvent', err);
    return res.status(500).json({ success: false, message: 'Failed to map media' });
  }
};

exports.removeMediaFromEvent = async (req, res) => {
  const { eventId } = req.params;
  const { mediaId } = req.body;

  if (!mediaId) return res.status(400).json({ success: false, message: 'mediaId required' });
  try {
    if (!mongoose.isValidObjectId(eventId) || !mongoose.isValidObjectId(mediaId)) {
      return res.status(400).json({ success: false, message: 'Invalid id(s)' });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // atomic pull
    const updated = await Event.findByIdAndUpdate(eventId, { $pull: { media: mediaId } }, { new: true }).populate('media').exec();

    // if unchanged, the media wasn't mapped
    if (!updated) return res.status(500).json({ success: false, message: 'Failed to unmap media' });

    // check if still contained
    const stillHas = (updated.media || []).some(m => String(m._id || m) === String(mediaId));
    if (stillHas) {
      return res.status(500).json({ success: false, message: 'Failed to unmap media' });
    }

    return res.json({ success: true, message: 'Unmapped', data: updated });
  } catch (err) {
    console.error('removeMediaFromEvent', err);
    return res.status(500).json({ success: false, message: 'Failed to unmap media' });
  }
};
