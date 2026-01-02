// // // backend/routes/admin/events.js
// // const express = require('express');
// // const router = express.Router();

// // const Event = require('../../models/Event');
// // const Speaker = require('../../models/Speaker');
// // const Sponsor = require('../../models/Sponsor');
// // const Organizer = require('../../models/Organizer');
// // const FacultyCoordinator = require('../../models/FacultyCoordinator');
// // const Media = require('../../models/Media'); // media model — used for validation & populate

// // // const auth = require('../../middleware/auth'); // optionally enable
// // const upload = require('../../utils/upload');

// // console.log('loaded routes/admin/events.js');

// // // simple auth passthrough for now (replace with your real middleware)
// // function auth(req, res, next) { return next(); }
// // router.use(auth);

// // /* -----------------------
// //    Helpers
// //    ----------------------- */
// // const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

// // function normalizeUrl(base, url) {
// //   if (!url) return url;
// //   if (/^https?:\/\//i.test(url)) return url;
// //   return `${base}/${url.replace(/^\/+/, '')}`;
// // }

// // function normalizeEventMedia(base, ev) {
// //   if (!ev) return ev;
// //   if (ev.bannerUrl) ev.bannerUrl = normalizeUrl(base, ev.bannerUrl);

// //   const safeMap = (arr, fn) => Array.isArray(arr) ? arr.map(fn) : arr;

// //   ev.speakers = safeMap(ev.speakers, s => {
// //     if (s && (s.photo || s.avatar)) s.photo = normalizeUrl(base, s.photo || s.avatar);
// //     return s;
// //   });

// //   ev.sponsors = safeMap(ev.sponsors, sp => {
// //     if (sp && (sp.logo || sp.logoUrl)) sp.logo = normalizeUrl(base, sp.logo || sp.logoUrl);
// //     return sp;
// //   });

// //   ev.organizers = safeMap(ev.organizers, o => {
// //     if (o && o.photo) o.photo = normalizeUrl(base, o.photo);
// //     return o;
// //   });

// //   ev.coordinators = safeMap(ev.coordinators, c => {
// //     if (c && c.photo) c.photo = normalizeUrl(base, c.photo);
// //     return c;
// //   });

// //   ev.media = safeMap(ev.media, m => {
// //     // media may have url (youtube) or file path
// //     if (m && m.url) m.url = m.url;
// //     if (m && m.path) m.path = normalizeUrl(base, m.path);
// //     return m;
// //   });

// //   return ev;
// // }

// // function parseBoolish(val) {
// //   if (typeof val === 'boolean') return val;
// //   if (typeof val === 'number') return val === 1;
// //   if (val === null || val === undefined) return false;
// //   const s = String(val).trim().toLowerCase();
// //   return s === '1' || s === 'true' || s === 'yes' || s === 'on';
// // }

// // async function fetchPopulatedEvent(id, req) {
// //   // populate all related refs including media
// //   const ev = await Event.findById(id)
// //     .populate('speakers')
// //     .populate('sponsors')
// //     .populate('organizers')
// //     .populate('coordinators')
// //     .populate('media')
// //     .lean();
// //   if (!ev) return null;
// //   const base = getBaseUrl(req);
// //   return normalizeEventMedia(base, ev);
// // }

// // /* -----------------------
// //    CRUD
// //    ----------------------- */

// // // Create event (multipart banner)
// // router.post('/', upload.single('banner'), async (req, res) => {
// //   try {
// //     const { name, slug, description, date, location, isUpcoming, price, currency } = req.body;
// //     if (!name || !slug) return res.status(400).json({ success: false, message: 'name and slug required' });

// //     const bannerUrl = req.file ? `uploads/${req.file.filename}` : undefined;

// //     const ev = new Event({
// //       name,
// //       slug,
// //       description,
// //       date: date ? new Date(date) : undefined,
// //       location,
// //       isUpcoming: parseBoolish(isUpcoming),
// //       bannerUrl,
// //       price: price !== undefined ? Number(price) : 0,
// //       currency: currency || 'INR'
// //     });

// //     await ev.save();
// //     const populated = await fetchPopulatedEvent(ev._id, req);
// //     return res.json({ success: true, data: populated || ev });
// //   } catch (err) {
// //     console.error('POST /admin/events error', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // Read all (admin)
// // router.get('/', async (req, res) => {
// //   try {
// //     const events = await Event.find().sort({ createdAt: -1 }).lean();
// //     const base = getBaseUrl(req);
// //     const normalized = events.map(ev => normalizeEventMedia(base, ev));
// //     return res.json({ success: true, data: normalized });
// //   } catch (err) {
// //     console.error('GET /admin/events', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // Get event by slug
// // router.get('/slug/:slug', async (req, res) => {
// //   try {
// //     const slug = req.params.slug;
// //     const ev = await Event.findOne({ slug }).populate('speakers sponsors organizers coordinators media').lean();
// //     if (!ev) return res.status(404).json({ success: false, message: 'Not found' });
// //     const base = getBaseUrl(req);
// //     return res.json({ success: true, data: normalizeEventMedia(base, ev) });
// //   } catch (err) {
// //     console.error('GET /admin/events/slug/:slug', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // Read single (populated)
// // router.get('/:id', async (req, res) => {
// //   try {
// //     const ev = await fetchPopulatedEvent(req.params.id, req);
// //     if (!ev) return res.status(404).json({ success: false, message: 'Not found' });
// //     return res.json({ success: true, data: ev });
// //   } catch (err) {
// //     console.error('GET /admin/events/:id', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // Update (multipart)
// // router.put('/:id', upload.single('banner'), async (req, res) => {
// //   try {
// //     const update = { ...req.body };
// //     if (req.file) update.bannerUrl = `uploads/${req.file.filename}`;
// //     if (update.date) update.date = new Date(update.date);
// //     if (update.isUpcoming !== undefined) update.isUpcoming = parseBoolish(update.isUpcoming);
// //     if (update.price !== undefined) update.price = Number(update.price || 0);
// //     if (update.currency !== undefined) update.currency = update.currency || 'INR';

// //     const evRaw = await Event.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
// //     if (!evRaw) return res.status(404).json({ success: false, message: 'Not found' });

// //     const ev = await fetchPopulatedEvent(evRaw._id, req);
// //     return res.json({ success: true, data: ev });
// //   } catch (err) {
// //     console.error('PUT /admin/events/:id', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // Delete
// // router.delete('/:id', async (req, res) => {
// //   try {
// //     const ev = await Event.findByIdAndDelete(req.params.id).lean();
// //     if (!ev) return res.status(404).json({ success: false, message: 'Not found' });
// //     // optionally unlink files here
// //     return res.json({ success: true, data: ev });
// //   } catch (err) {
// //     console.error('DELETE /admin/events/:id', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // /* -----------------------
// //    Additional helpers
// //    ----------------------- */

// // // quick counts for dashboard
// // router.get('/counts', async (req, res) => {
// //   try {
// //     const counts = {
// //       events: await Event.countDocuments(),
// //       speakers: await Speaker.countDocuments(),
// //       sponsors: await Sponsor.countDocuments()
// //     };
// //     return res.json({ success: true, data: counts });
// //   } catch (err) {
// //     console.error('GET /admin/events/counts', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // /* -----------------------
// //    Mapping endpoints
// //    ----------------------- */

// // // add/remove speaker (explicit)
// // router.post('/:id/add-speaker', async (req, res) => {
// //   try {
// //     const { speakerId } = req.body;
// //     if (!speakerId) return res.status(400).json({ success: false, message: 'speakerId required' });
// //     const sp = await Speaker.findById(speakerId).lean();
// //     if (!sp) return res.status(404).json({ success: false, message: 'Speaker not found' });

// //     await Event.findByIdAndUpdate(req.params.id, { $addToSet: { speakers: speakerId } });
// //     const ev = await fetchPopulatedEvent(req.params.id, req);
// //     return res.json({ success: true, data: ev });
// //   } catch (err) {
// //     console.error('add-speaker', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // router.post('/:id/remove-speaker', async (req, res) => {
// //   try {
// //     const { speakerId } = req.body;
// //     if (!speakerId) return res.status(400).json({ success: false, message: 'speakerId required' });
// //     await Event.findByIdAndUpdate(req.params.id, { $pull: { speakers: speakerId } });
// //     const ev = await fetchPopulatedEvent(req.params.id, req);
// //     return res.json({ success: true, data: ev });
// //   } catch (err) {
// //     console.error('remove-speaker', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // Generic maker for sponsors/organizers/coordinators (plural + singular endpoints)
// // const modelMap = {
// //   sponsors: Sponsor,
// //   organizers: Organizer,
// //   coordinators: FacultyCoordinator
// // };

// // const makeAddRemove = (fieldName, singularIdKey, singularName) => {
// //   const Model = modelMap[fieldName];

// //   // Add (plural e.g. add-sponsors)
// //   router.post(`/:id/add-${fieldName}`, async (req, res) => {
// //     try {
// //       const id = req.body[singularIdKey];
// //       if (!id) return res.status(400).json({ success: false, message: `${singularIdKey} required` });
// //       if (Model) {
// //         const doc = await Model.findById(id).lean();
// //         if (!doc) return res.status(404).json({ success: false, message: `${singularName} not found` });
// //       }
// //       const update = { $addToSet: {} }; update.$addToSet[fieldName] = id;
// //       await Event.findByIdAndUpdate(req.params.id, update);
// //       const ev = await fetchPopulatedEvent(req.params.id, req);
// //       return res.json({ success: true, data: ev });
// //     } catch (err) {
// //       console.error(`add-${fieldName}`, err);
// //       return res.status(500).json({ success: false, message: 'Server error' });
// //     }
// //   });

// //   // Remove (plural)
// //   router.post(`/:id/remove-${fieldName}`, async (req, res) => {
// //     try {
// //       const id = req.body[singularIdKey];
// //       if (!id) return res.status(400).json({ success: false, message: `${singularIdKey} required` });
// //       const update = { $pull: {} }; update.$pull[fieldName] = id;
// //       await Event.findByIdAndUpdate(req.params.id, update);
// //       const ev = await fetchPopulatedEvent(req.params.id, req);
// //       return res.json({ success: true, data: ev });
// //     } catch (err) {
// //       console.error(`remove-${fieldName}`, err);
// //       return res.status(500).json({ success: false, message: 'Server error' });
// //     }
// //   });

// //   // singular add/remove (add-sponsor / remove-sponsor)
// //   router.post(`/:id/add-${singularName}`, async (req, res) => {
// //     try {
// //       const id = req.body[singularIdKey];
// //       if (!id) return res.status(400).json({ success: false, message: `${singularIdKey} required` });
// //       if (Model) {
// //         const doc = await Model.findById(id).lean();
// //         if (!doc) return res.status(404).json({ success: false, message: `${singularName} not found` });
// //       }
// //       const update = { $addToSet: {} }; update.$addToSet[fieldName] = id;
// //       await Event.findByIdAndUpdate(req.params.id, update);
// //       const ev = await fetchPopulatedEvent(req.params.id, req);
// //       return res.json({ success: true, data: ev });
// //     } catch (err) {
// //       console.error(`add-${singularName}`, err);
// //       return res.status(500).json({ success: false, message: 'Server error' });
// //     }
// //   });

// //   router.post(`/:id/remove-${singularName}`, async (req, res) => {
// //     try {
// //       const id = req.body[singularIdKey];
// //       if (!id) return res.status(400).json({ success: false, message: `${singularIdKey} required` });
// //       const update = { $pull: {} }; update.$pull[fieldName] = id;
// //       await Event.findByIdAndUpdate(req.params.id, update);
// //       const ev = await fetchPopulatedEvent(req.params.id, req);
// //       return res.json({ success: true, data: ev });
// //     } catch (err) {
// //       console.error(`remove-${singularName}`, err);
// //       return res.status(500).json({ success: false, message: 'Server error' });
// //     }
// //   });
// // };

// // makeAddRemove('sponsors', 'sponsorId', 'sponsor');
// // makeAddRemove('organizers', 'organizerId', 'organizer');
// // makeAddRemove('coordinators', 'coordinatorId', 'coordinator');

// // /* -----------------------
// //    Media mapping endpoints
// //    ----------------------- */

// // // Add existing media to event
// // router.post('/:id/add-media', async (req, res) => {
// //   try {
// //     const { mediaId } = req.body;
// //     if (!mediaId) return res.status(400).json({ success: false, message: 'mediaId required' });

// //     const m = await Media.findById(mediaId).lean();
// //     if (!m) return res.status(404).json({ success: false, message: 'Media not found' });

// //     await Event.findByIdAndUpdate(req.params.id, { $addToSet: { media: mediaId } });
// //     const ev = await fetchPopulatedEvent(req.params.id, req);
// //     return res.json({ success: true, data: ev });
// //   } catch (err) {
// //     console.error('add-media', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // Remove media from event
// // router.post('/:id/remove-media', async (req, res) => {
// //   try {
// //     const { mediaId } = req.body;
// //     if (!mediaId) return res.status(400).json({ success: false, message: 'mediaId required' });

// //     await Event.findByIdAndUpdate(req.params.id, { $pull: { media: mediaId } });
// //     const ev = await fetchPopulatedEvent(req.params.id, req);
// //     return res.json({ success: true, data: ev });
// //   } catch (err) {
// //     console.error('remove-media', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // // alternative unmap route (DELETE)
// // router.delete('/:id/media/:mediaId', async (req, res) => {
// //   try {
// //     const { id, mediaId } = req.params;
// //     await Event.findByIdAndUpdate(id, { $pull: { media: mediaId } });
// //     const ev = await fetchPopulatedEvent(id, req);
// //     return res.json({ success: true, data: ev });
// //   } catch (err) {
// //     console.error('DELETE /:id/media/:mediaId', err);
// //     return res.status(500).json({ success: false, message: 'Server error' });
// //   }
// // });

// // module.exports = router;



// const express = require('express');
// const router = express.Router();

// const Event = require('../../models/Event');
// const Speaker = require('../../models/Speaker');
// const Sponsor = require('../../models/Sponsor');
// const Organizer = require('../../models/Organizer');
// const FacultyCoordinator = require('../../models/FacultyCoordinator');
// const Media = require('../../models/Media');

// // auth (kept same behavior)
// function auth(req, res, next) { return next(); }
// router.use(auth);

// // uploads
// const upload = require('../../utils/upload'); // multer memoryStorage
// const uploadToCloudinary = require('../../utils/uploadToCloudinary');

// console.log('loaded routes/admin/events.js');

// /* -----------------------
//    Helpers
// ----------------------- */
// const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

// function normalizeUrl(base, url) {
//   if (!url) return url;
//   if (/^https?:\/\//i.test(url)) return url;
//   return `${base}/${url.replace(/^\/+/, '')}`;
// }

// function normalizeEventMedia(base, ev) {
//   if (!ev) return ev;

//   if (ev.bannerUrl) ev.bannerUrl = normalizeUrl(base, ev.bannerUrl);

//   const safeMap = (arr, fn) => Array.isArray(arr) ? arr.map(fn) : arr;

//   ev.speakers = safeMap(ev.speakers, s => {
//     if (s && s.photo) s.photo = normalizeUrl(base, s.photo);
//     return s;
//   });

//   ev.sponsors = safeMap(ev.sponsors, sp => {
//     if (sp && sp.logo) sp.logo = normalizeUrl(base, sp.logo);
//     return sp;
//   });

//   ev.organizers = safeMap(ev.organizers, o => {
//     if (o && o.photo) o.photo = normalizeUrl(base, o.photo);
//     return o;
//   });

//   ev.coordinators = safeMap(ev.coordinators, c => {
//     if (c && c.photo) c.photo = normalizeUrl(base, c.photo);
//     return c;
//   });

//   ev.media = safeMap(ev.media, m => {
//     if (m && m.path) m.path = normalizeUrl(base, m.path);
//     return m;
//   });

//   return ev;
// }

// function parseBoolish(val) {
//   if (typeof val === 'boolean') return val;
//   if (typeof val === 'number') return val === 1;
//   if (!val) return false;
//   const s = String(val).toLowerCase();
//   return s === '1' || s === 'true' || s === 'yes' || s === 'on';
// }

// async function fetchPopulatedEvent(id, req) {
//   const ev = await Event.findById(id)
//     .populate('speakers sponsors organizers coordinators media')
//     .lean();

//   if (!ev) return null;
//   return normalizeEventMedia(getBaseUrl(req), ev);
// }

// /* -----------------------
//    CRUD
// ----------------------- */

// // CREATE EVENT (banner → Cloudinary)
// router.post('/', upload.single('banner'), async (req, res) => {
//   try {
//     const { name, slug, description, date, location, isUpcoming, price, currency } = req.body;
//     if (!name || !slug)
//       return res.status(400).json({ success: false, message: 'name and slug required' });

//     let bannerUrl;
//     if (req.file) {
//       const result = await uploadToCloudinary(
//         req.file.buffer,
//         'tedxsmec/events'
//       );
//       bannerUrl = result.secure_url;
//     }

//     const ev = await Event.create({
//       name,
//       slug,
//       description,
//       date: date ? new Date(date) : undefined,
//       location,
//       isUpcoming: parseBoolish(isUpcoming),
//       bannerUrl,
//       price: price !== undefined ? Number(price) : 0,
//       currency: currency || 'INR',
//     });

//     const populated = await fetchPopulatedEvent(ev._id, req);
//     res.json({ success: true, data: populated || ev });
//   } catch (err) {
//     console.error('POST /admin/events error', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // READ ALL
// router.get('/', async (req, res) => {
//   try {
//     const events = await Event.find().sort({ createdAt: -1 }).lean();
//     const base = getBaseUrl(req);
//     res.json({
//       success: true,
//       data: events.map(ev => normalizeEventMedia(base, ev))
//     });
//   } catch (err) {
//     console.error('GET /admin/events', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // READ BY SLUG
// router.get('/slug/:slug', async (req, res) => {
//   try {
//     const ev = await Event.findOne({ slug: req.params.slug })
//       .populate('speakers sponsors organizers coordinators media')
//       .lean();

//     if (!ev) return res.status(404).json({ success: false, message: 'Not found' });

//     res.json({ success: true, data: normalizeEventMedia(getBaseUrl(req), ev) });
//   } catch (err) {
//     console.error('GET /admin/events/slug/:slug', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // READ ONE
// router.get('/:id', async (req, res) => {
//   try {
//     const ev = await fetchPopulatedEvent(req.params.id, req);
//     if (!ev) return res.status(404).json({ success: false, message: 'Not found' });
//     res.json({ success: true, data: ev });
//   } catch (err) {
//     console.error('GET /admin/events/:id', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // UPDATE EVENT (banner → Cloudinary)
// router.put('/:id', upload.single('banner'), async (req, res) => {
//   try {
//     const update = { ...req.body };

//     if (req.file) {
//       const result = await uploadToCloudinary(
//         req.file.buffer,
//         'tedxsmec/events'
//       );
//       update.bannerUrl = result.secure_url;
//     }

//     if (update.date) update.date = new Date(update.date);
//     if (update.isUpcoming !== undefined) update.isUpcoming = parseBoolish(update.isUpcoming);
//     if (update.price !== undefined) update.price = Number(update.price || 0);
//     if (update.currency !== undefined) update.currency = update.currency || 'INR';

//     const evRaw = await Event.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
//     if (!evRaw) return res.status(404).json({ success: false, message: 'Not found' });

//     const ev = await fetchPopulatedEvent(evRaw._id, req);
//     res.json({ success: true, data: ev });
//   } catch (err) {
//     console.error('PUT /admin/events/:id', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // DELETE
// router.delete('/:id', async (req, res) => {
//   try {
//     const ev = await Event.findByIdAndDelete(req.params.id).lean();
//     if (!ev) return res.status(404).json({ success: false, message: 'Not found' });
//     res.json({ success: true, data: ev });
//   } catch (err) {
//     console.error('DELETE /admin/events/:id', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// /* -----------------------
//    Dashboard counts
// ----------------------- */
// router.get('/counts', async (req, res) => {
//   try {
//     res.json({
//       success: true,
//       data: {
//         events: await Event.countDocuments(),
//         speakers: await Speaker.countDocuments(),
//         sponsors: await Sponsor.countDocuments(),
//       },
//     });
//   } catch (err) {
//     console.error('GET /admin/events/counts', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// /* -----------------------
//    Mapping & media routes
//    (UNCHANGED)
// ----------------------- */

// const modelMap = {
//   sponsors: Sponsor,
//   organizers: Organizer,
//   coordinators: FacultyCoordinator,
// };

// const makeAddRemove = (fieldName, idKey, singular) => {
//   const Model = modelMap[fieldName];

//   router.post(`/:id/add-${fieldName}`, async (req, res) => {
//     try {
//       const id = req.body[idKey];
//       if (!id) return res.status(400).json({ success: false, message: `${idKey} required` });

//       if (Model && !(await Model.findById(id))) {
//         return res.status(404).json({ success: false, message: `${singular} not found` });
//       }

//       await Event.findByIdAndUpdate(req.params.id, { $addToSet: { [fieldName]: id } });
//       res.json({ success: true, data: await fetchPopulatedEvent(req.params.id, req) });
//     } catch (err) {
//       console.error(`add-${fieldName}`, err);
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
//   });

//   router.post(`/:id/remove-${fieldName}`, async (req, res) => {
//     try {
//       const id = req.body[idKey];
//       if (!id) return res.status(400).json({ success: false, message: `${idKey} required` });

//       await Event.findByIdAndUpdate(req.params.id, { $pull: { [fieldName]: id } });
//       res.json({ success: true, data: await fetchPopulatedEvent(req.params.id, req) });
//     } catch (err) {
//       console.error(`remove-${fieldName}`, err);
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
//   });
// };

// makeAddRemove('sponsors', 'sponsorId', 'sponsor');
// makeAddRemove('organizers', 'organizerId', 'organizer');
// makeAddRemove('coordinators', 'coordinatorId', 'coordinator');

// module.exports = router;



const express = require('express');
const router = express.Router();

const Event = require('../../models/Event');
const Speaker = require('../../models/Speaker');
const Sponsor = require('../../models/Sponsor');
const Organizer = require('../../models/Organizer');
const FacultyCoordinator = require('../../models/FacultyCoordinator');
const Media = require('../../models/Media');

const upload = require('../../utils/upload');
const uploadToCloudinary = require('../../utils/uploadToCloudinary');

console.log('loaded routes/admin/events.js');

// dummy auth (keep same)
function auth(req, res, next) { return next(); }
router.use(auth);

/* -----------------------
   Helpers
----------------------- */
const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

function normalizeUrl(base, url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${base}/${url.replace(/^\/+/, '')}`;
}

function normalizeEventMedia(base, ev) {
  if (!ev) return ev;
  if (ev.bannerUrl) ev.bannerUrl = normalizeUrl(base, ev.bannerUrl);

  const fix = (arr, key) =>
    Array.isArray(arr) ? arr.map(x => {
      if (x && x[key]) x[key] = normalizeUrl(base, x[key]);
      return x;
    }) : arr;

  ev.speakers = fix(ev.speakers, 'photo');
  ev.sponsors = fix(ev.sponsors, 'logo');
  ev.organizers = fix(ev.organizers, 'photo');
  ev.coordinators = fix(ev.coordinators, 'photo');
  ev.media = fix(ev.media, 'path');

  return ev;
}

function parseBoolish(val) {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val === 1;
  if (!val) return false;
  return ['1', 'true', 'yes', 'on'].includes(String(val).toLowerCase());
}

async function fetchPopulatedEvent(id, req) {
  const ev = await Event.findById(id)
    .populate('speakers sponsors organizers coordinators media')
    .lean();
  if (!ev) return null;
  return normalizeEventMedia(getBaseUrl(req), ev);
}

/* -----------------------
   CRUD
----------------------- */

// CREATE EVENT (Cloudinary banner)
router.post('/', upload.single('banner'), async (req, res) => {
  try {
    const { name, slug, description, date, location, isUpcoming, price, currency } = req.body;
    if (!name || !slug)
      return res.status(400).json({ success: false, message: 'name and slug required' });

    let bannerUrl;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'tedxsmec/events');
      bannerUrl = result.secure_url;
    }

    const ev = await Event.create({
      name,
      slug,
      description,
      date: date ? new Date(date) : undefined,
      location,
      isUpcoming: parseBoolish(isUpcoming),
      bannerUrl,
      price: Number(price || 0),
      currency: currency || 'INR',
    });

    res.json({ success: true, data: await fetchPopulatedEvent(ev._id, req) });
  } catch (err) {
    console.error('POST /admin/events', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).lean();
    const base = getBaseUrl(req);
    res.json({ success: true, data: events.map(e => normalizeEventMedia(base, e)) });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  const ev = await fetchPopulatedEvent(req.params.id, req);
  if (!ev) return res.status(404).json({ success: false });
  res.json({ success: true, data: ev });
});

// UPDATE EVENT (Cloudinary banner)
router.put('/:id', upload.single('banner'), async (req, res) => {
  try {
    const update = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'tedxsmec/events');
      update.bannerUrl = result.secure_url;
    }

    if (update.date) update.date = new Date(update.date);
    if (update.isUpcoming !== undefined) update.isUpcoming = parseBoolish(update.isUpcoming);
    if (update.price !== undefined) update.price = Number(update.price || 0);

    const ev = await Event.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
    if (!ev) return res.status(404).json({ success: false });

    res.json({ success: true, data: await fetchPopulatedEvent(ev._id, req) });
  } catch (err) {
    console.error('PUT /admin/events/:id', err);
    res.status(500).json({ success: false });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const ev = await Event.findByIdAndDelete(req.params.id).lean();
  if (!ev) return res.status(404).json({ success: false });
  res.json({ success: true, data: ev });
});

/* -----------------------
   MAPPING ROUTES (SINGULAR + PLURAL FIX)
----------------------- */

async function mapItem(req, res, field, id) {
  await Event.findByIdAndUpdate(req.params.id, { $addToSet: { [field]: id } });
  res.json({ success: true, data: await fetchPopulatedEvent(req.params.id, req) });
}

async function unmapItem(req, res, field, id) {
  await Event.findByIdAndUpdate(req.params.id, { $pull: { [field]: id } });
  res.json({ success: true, data: await fetchPopulatedEvent(req.params.id, req) });
}

// ----- SPEAKERS -----
router.post('/:id/add-speaker', (req, res) => mapItem(req, res, 'speakers', req.body.speakerId));
router.post('/:id/remove-speaker', (req, res) => unmapItem(req, res, 'speakers', req.body.speakerId));

// ----- SPONSORS -----
router.post('/:id/add-sponsor', (req, res) => mapItem(req, res, 'sponsors', req.body.sponsorId));
router.post('/:id/remove-sponsor', (req, res) => unmapItem(req, res, 'sponsors', req.body.sponsorId));

// ----- ORGANIZERS -----
router.post('/:id/add-organizer', (req, res) => mapItem(req, res, 'organizers', req.body.organizerId));
router.post('/:id/remove-organizer', (req, res) => unmapItem(req, res, 'organizers', req.body.organizerId));

// ----- COORDINATORS -----
router.post('/:id/add-coordinator', (req, res) => mapItem(req, res, 'coordinators', req.body.coordinatorId));
router.post('/:id/remove-coordinator', (req, res) => unmapItem(req, res, 'coordinators', req.body.coordinatorId));

// ----- MEDIA -----
router.post('/:id/add-media', (req, res) => mapItem(req, res, 'media', req.body.mediaId));
router.post('/:id/remove-media', (req, res) => unmapItem(req, res, 'media', req.body.mediaId));

router.delete('/:id/media/:mediaId', (req, res) =>
  unmapItem(req, res, 'media', req.params.mediaId)
);

module.exports = router;
