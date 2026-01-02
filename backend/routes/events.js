
// backend/routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

// helper to normalize one URL (if relative -> prefix base)
function normalizeUrl(base, url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  // remove leading slashes then prefix base
  return `${base}/${url.replace(/^\/+/, '')}`;
}

// normalize nested media fields of populated docs
function normalizeNestedMedia(base, doc) {
  if (!doc) return doc;
  // speakers -> photo or avatar
  if (Array.isArray(doc.speakers)) {
    doc.speakers = doc.speakers.map(s => {
      if (s && (s.photo || s.avatar)) {
        s.photo = normalizeUrl(base, s.photo || s.avatar);
      }
      return s;
    });
  }
  // sponsors -> logo or logoUrl
  if (Array.isArray(doc.sponsors)) {
    doc.sponsors = doc.sponsors.map(sp => {
      if (sp && (sp.logo || sp.logoUrl)) {
        sp.logo = normalizeUrl(base, sp.logo || sp.logoUrl);
      }
      return sp;
    });
  }
  // organizers, coordinators if they have photos
  if (Array.isArray(doc.organizers)) {
    doc.organizers = doc.organizers.map(o => {
      if (o && o.photo) o.photo = normalizeUrl(base, o.photo);
      return o;
    });
  }
  if (Array.isArray(doc.coordinators)) {
    doc.coordinators = doc.coordinators.map(c => {
      if (c && c.photo) c.photo = normalizeUrl(base, c.photo);
      return c;
    });
  }

  return doc;
}

// --- LIST ROUTE: GET /api/events?upcoming=true|false ---
router.get('/', async (req, res) => {
  try {
    const upcomingQuery = req.query.upcoming;
    let filter = {};
    if (upcomingQuery === 'true') filter.isUpcoming = true;
    else if (upcomingQuery === 'false') filter.isUpcoming = false;

    // populate minimal fields for nested docs for list view
    const events = await Event.find(filter)
      .sort({ date: -1 })
      .populate('speakers', 'name')         // small populate: only name
      .populate('sponsors', 'name logo')   // small populate
      .populate('organizers', 'name role photo')      // organizers small fields
      .populate('coordinators', 'name department photo') // coordinators small fields
      .lean();

    const base = getBaseUrl(req);
    const normalized = events.map(ev => {
      if (ev.bannerUrl) ev.bannerUrl = normalizeUrl(base, ev.bannerUrl);
      // normalize nested small media as well
      normalizeNestedMedia(base, ev);
      return ev;
    });

    return res.json({ success: true, data: normalized });
  } catch (err) {
    console.error('GET /api/events error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- DETAIL ROUTE: GET /api/events/:slug ---
router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    // populate the fields that belong to the event (full docs)
    const event = await Event.findOne({ slug })
      .populate('speakers')      // full speaker docs
      .populate('sponsors')      // full sponsor docs
      .populate('organizers')    // full organizer docs
      .populate('coordinators')  // full coordinator docs
      .lean();

    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const base = getBaseUrl(req);

    // normalize event banner
    if (event.bannerUrl) event.bannerUrl = normalizeUrl(base, event.bannerUrl);

    // normalize nested media (speakers logos/photos, sponsor logos etc)
    normalizeNestedMedia(base, event);

    return res.json({ success: true, data: event });
  } catch (err) {
    console.error('GET /api/events/:slug error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
