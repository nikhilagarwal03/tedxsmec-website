// const express = require('express');
// const router = express.Router();
// const Speaker = require('../../models/Speaker');
// const auth = require('../../middleware/auth');
// const upload = require('../../utils/upload');
// const path = require('path');

// /**
//  * Helper to build an absolute URL for stored uploads.
//  * If value is already an absolute URL, return as-is.
//  * Otherwise prefix with PUBLIC_API_BASE (env) or derive from request host.
//  */
// function qualifyImageUrl(req, p) {
//   if (!p) return p;
//   if (/^https?:\/\//i.test(p)) return p;
//   const base = (process.env.PUBLIC_API_BASE || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
//   return `${base}/${p.replace(/^\/+/, '')}`;
// }

// /*
//   PUBLIC ROUTES (no auth)
//   - GET  /api/admin/speakers/public/list
//   - GET  /api/admin/speakers/public/:id
//   These are defined BEFORE router.use(auth) so they remain public.
// */

// router.get('/public/list', async (req, res) => {
//   try {
//     const q = (req.query.q || '').trim();
//     const limit = Math.min(Math.max(parseInt(req.query.limit || '0', 10) || 0, 0), 200);

//     const filter = q ? {
//       $or: [
//         { name: { $regex: q, $options: 'i' } },
//         { designation: { $regex: q, $options: 'i' } },
//         { bio: { $regex: q, $options: 'i' } },
//         { topic: { $regex: q, $options: 'i' } },
//       ],
//     } : {};

//     let query = Speaker.find(filter).sort({ name: 1 });
//     if (limit > 0) query = query.limit(limit);
//     const docs = await query.lean();

//     // qualify image urls for public consumption
//     const docsWithUrls = docs.map(d => {
//       return {
//         ...d,
//         photo: qualifyImageUrl(req, d.photo),
//         imageUrl: qualifyImageUrl(req, d.imageUrl)
//       };
//     });

//     return res.json({ success: true, data: docsWithUrls });
//   } catch (err) {
//     console.error('Public speaker list error:', err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// router.get('/public/:id', async (req, res) => {
//   try {
//     const doc = await Speaker.findById(req.params.id).lean();
//     if (!doc) return res.status(404).json({ success: false, message: 'Speaker not found' });

//     const docWithUrls = {
//       ...doc,
//       photo: qualifyImageUrl(req, doc.photo),
//       imageUrl: qualifyImageUrl(req, doc.imageUrl)
//     };

//     return res.json({ success: true, data: docWithUrls });
//   } catch (err) {
//     console.error('Public speaker read error:', err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// /* -------------------- ADMIN ROUTES (PROTECTED) -------------------- */
// // Protect admin routes from here on
// router.use(auth);

// // list (admin) - returns raw docs (admins probably run client that can handle relative paths)
// router.get('/', async (req, res) => {
//   try {
//     const docs = await Speaker.find().sort({ name: 1 }).lean();
//     return res.json({ success: true, data: docs });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // create (with photo)
// router.post('/', upload.single('photo'), async (req, res) => {
//   try {
//     const {
//       name,
//       designation,
//       topic,
//       bio,
//       linkedin,
//       twitter,
//       instagram,
//       youtube,
//       website
//     } = req.body;

//     const photoPath = req.file ? `uploads/${req.file.filename}` : undefined;

//     const doc = new Speaker({
//       name,
//       designation,
//       topic,
//       bio,
//       photo: photoPath,
//       imageUrl: photoPath,
//       socialLinks: {
//         linkedin: linkedin || undefined,
//         twitter: twitter || undefined,
//         instagram: instagram || undefined,
//         youtube: youtube || undefined,
//         website: website || undefined
//       }
//     });

//     await doc.save();
//     return res.json({ success: true, data: doc });
//   } catch (err) {
//     console.error('Create speaker error:', err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // read (admin)
// router.get('/:id', async (req, res) => {
//   try {
//     const doc = await Speaker.findById(req.params.id).lean();
//     if (!doc) return res.status(404).json({ success: false, message: 'Speaker not found' });
//     return res.json({ success: true, data: doc });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // update (admin)
// router.put('/:id', upload.single('photo'), async (req, res) => {
//   try {
//     const {
//       name,
//       designation,
//       topic,
//       bio,
//       linkedin,
//       twitter,
//       instagram,
//       youtube,
//       website
//     } = req.body;

//     // build update object only for provided fields to avoid overwriting with undefined
//     const update = {};
//     if (name !== undefined) update.name = name;
//     if (designation !== undefined) update.designation = designation;
//     if (topic !== undefined) update.topic = topic;
//     if (bio !== undefined) update.bio = bio;

//     // socialLinks object (only include keys provided)
//     const social = {};
//     if (linkedin !== undefined) social.linkedin = linkedin || undefined;
//     if (twitter !== undefined) social.twitter = twitter || undefined;
//     if (instagram !== undefined) social.instagram = instagram || undefined;
//     if (youtube !== undefined) social.youtube = youtube || undefined;
//     if (website !== undefined) social.website = website || undefined;
//     if (Object.keys(social).length > 0) update.socialLinks = social;

//     // file handling
//     if (req.file) {
//       const photoPath = `uploads/${req.file.filename}`;
//       update.photo = photoPath;
//       update.imageUrl = photoPath;
//     }

//     const doc = await Speaker.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
//     if (!doc) return res.status(404).json({ success: false, message: 'Speaker not found' });
//     return res.json({ success: true, data: doc });
//   } catch (err) {
//     console.error('Update speaker error:', err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // delete (admin)
// router.delete('/:id', async (req, res) => {
//   try {
//     const doc = await Speaker.findByIdAndDelete(req.params.id);
//     if (!doc) return res.status(404).json({ success: false, message: 'Speaker not found' });
//     return res.json({ success: true, data: doc });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();

const Speaker = require('../../models/Speaker');
const auth = require('../../middleware/auth');

// multer (memory storage)
const upload = require('../../utils/upload');
const uploadToCloudinary = require('../../utils/uploadToCloudinary');

/**
 * Helper to build an absolute URL for stored uploads.
 * If value is already an absolute URL, return as-is.
 * Otherwise prefix with PUBLIC_API_BASE (env) or derive from request host.
 */
function qualifyImageUrl(req, p) {
  if (!p) return p;
  if (/^https?:\/\//i.test(p)) return p;
  const base = (process.env.PUBLIC_API_BASE || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
  return `${base}/${p.replace(/^\/+/, '')}`;
}

/*
  PUBLIC ROUTES (no auth)
  - GET  /api/admin/speakers/public/list
  - GET  /api/admin/speakers/public/:id
*/

router.get('/public/list', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const limit = Math.min(Math.max(parseInt(req.query.limit || '0', 10) || 0, 0), 200);

    const filter = q ? {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { designation: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } },
        { topic: { $regex: q, $options: 'i' } },
      ],
    } : {};

    let query = Speaker.find(filter).sort({ name: 1 });
    if (limit > 0) query = query.limit(limit);
    const docs = await query.lean();

    // qualify image urls for public consumption
    const docsWithUrls = docs.map(d => ({
      ...d,
      photo: qualifyImageUrl(req, d.photo),
      imageUrl: qualifyImageUrl(req, d.imageUrl),
    }));

    return res.json({ success: true, data: docsWithUrls });
  } catch (err) {
    console.error('Public speaker list error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/public/:id', async (req, res) => {
  try {
    const doc = await Speaker.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Speaker not found' });
    }

    const docWithUrls = {
      ...doc,
      photo: qualifyImageUrl(req, doc.photo),
      imageUrl: qualifyImageUrl(req, doc.imageUrl),
    };

    return res.json({ success: true, data: docWithUrls });
  } catch (err) {
    console.error('Public speaker read error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* -------------------- ADMIN ROUTES (PROTECTED) -------------------- */
router.use(auth);

// list (admin)
router.get('/', async (req, res) => {
  try {
    const docs = await Speaker.find().sort({ name: 1 }).lean();
    return res.json({ success: true, data: docs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// create (Cloudinary upload)
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const {
      name,
      designation,
      topic,
      bio,
      linkedin,
      twitter,
      instagram,
      youtube,
      website,
    } = req.body;

    let photoUrl;
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        'tedxsmec/speakers'
      );
      photoUrl = result.secure_url;
    }

    const doc = new Speaker({
      name,
      designation,
      topic,
      bio,
      photo: photoUrl,
      imageUrl: photoUrl,
      socialLinks: {
        linkedin: linkedin || undefined,
        twitter: twitter || undefined,
        instagram: instagram || undefined,
        youtube: youtube || undefined,
        website: website || undefined,
      },
    });

    await doc.save();
    return res.json({ success: true, data: doc });
  } catch (err) {
    console.error('Create speaker error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// read (admin)
router.get('/:id', async (req, res) => {
  try {
    const doc = await Speaker.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Speaker not found' });
    }
    return res.json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// update (Cloudinary upload)
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const {
      name,
      designation,
      topic,
      bio,
      linkedin,
      twitter,
      instagram,
      youtube,
      website,
    } = req.body;

    const update = {};
    if (name !== undefined) update.name = name;
    if (designation !== undefined) update.designation = designation;
    if (topic !== undefined) update.topic = topic;
    if (bio !== undefined) update.bio = bio;

    const social = {};
    if (linkedin !== undefined) social.linkedin = linkedin || undefined;
    if (twitter !== undefined) social.twitter = twitter || undefined;
    if (instagram !== undefined) social.instagram = instagram || undefined;
    if (youtube !== undefined) social.youtube = youtube || undefined;
    if (website !== undefined) social.website = website || undefined;
    if (Object.keys(social).length > 0) update.socialLinks = social;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        'tedxsmec/speakers'
      );
      update.photo = result.secure_url;
      update.imageUrl = result.secure_url;
    }

    const doc = await Speaker.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).lean();

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Speaker not found' });
    }

    return res.json({ success: true, data: doc });
  } catch (err) {
    console.error('Update speaker error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// delete (admin)
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Speaker.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Speaker not found' });
    }
    return res.json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
