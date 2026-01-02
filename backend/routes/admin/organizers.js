// const express = require('express');
// const router = express.Router();
// const Organizer = require('../../models/Organizer');
// const auth = require('../../middleware/auth');
// const upload = require('../../utils/upload');

// /*
//   PUBLIC ROUTES (no auth)
//   - GET  /api/admin/organizers/public/list
//   - GET  /api/admin/organizers/public/:id
// */
// router.get('/public/list', async (req, res) => {
//   try {
//     const q = (req.query.q || '').trim();
//     const limit = Math.min(parseInt(req.query.limit || '0', 10) || 0, 200);
//     const filter = q ? {
//       $or: [
//         { name: { $regex: q, $options: 'i' } },
//         { role: { $regex: q, $options: 'i' } },
//         { bio: { $regex: q, $options: 'i' } },
//       ],
//     } : {};

//     let query = Organizer.find(filter).sort({ name: 1 });
//     if (limit > 0) query = query.limit(limit);
//     const items = await query.lean();
//     return res.json({ success: true, data: items });
//   } catch (err) {
//     console.error('Public organizers list error:', err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// router.get('/public/:id', async (req, res) => {
//   try {
//     const item = await Organizer.findById(req.params.id).lean();
//     if (!item) return res.status(404).json({ success: false, message: 'Organizer not found' });
//     return res.json({ success: true, data: item });
//   } catch (err) {
//     console.error('Public organizer read error:', err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// /* -------------------- PROTECTED ADMIN ROUTES -------------------- */
// router.use(auth);

// // list
// router.get('/', async (req, res) => {
//   try {
//     const items = await Organizer.find().sort({ name: 1 }).lean();
//     res.json({ success: true, data: items });
//   } catch (err) {
//     console.error('GET /admin/organizers', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // get one
// router.get('/:id', async (req, res) => {
//   try {
//     const item = await Organizer.findById(req.params.id).lean();
//     if (!item) return res.status(404).json({ success: false });
//     res.json({ success: true, data: item });
//   } catch (err) {
//     console.error('GET /admin/organizers/:id', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // create
// router.post('/', upload.single('photo'), async (req, res) => {
//   try {
//     const { name, role, linkedin, twitter, bio } = req.body;
//     const photo = req.file ? `uploads/${req.file.filename}` : undefined;
//     const doc = new Organizer({ name, role, linkedin, twitter, bio, photo });
//     await doc.save();
//     res.json({ success: true, data: doc });
//   } catch (err) {
//     console.error('POST /admin/organizers', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // update
// router.put('/:id', upload.single('photo'), async (req, res) => {
//   try {
//     const update = { ...req.body };
//     if (req.file) update.photo = `uploads/${req.file.filename}`;
//     const doc = await Organizer.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
//     if (!doc) return res.status(404).json({ success: false });
//     res.json({ success: true, data: doc });
//   } catch (err) {
//     console.error('PUT /admin/organizers/:id', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // delete
// router.delete('/:id', async (req, res) => {
//   try {
//     const doc = await Organizer.findByIdAndDelete(req.params.id).lean();
//     if (!doc) return res.status(404).json({ success: false });
//     res.json({ success: true, data: doc });
//   } catch (err) {
//     console.error('DELETE /admin/organizers/:id', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();

const Organizer = require('../../models/Organizer');
const auth = require('../../middleware/auth');

// multer (memory storage)
const upload = require('../../utils/upload');
const uploadToCloudinary = require('../../utils/uploadToCloudinary');

/*
  PUBLIC ROUTES (no auth)
  - GET  /api/admin/organizers/public/list
  - GET  /api/admin/organizers/public/:id
*/
router.get('/public/list', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const limit = Math.min(parseInt(req.query.limit || '0', 10) || 0, 200);

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { role: { $regex: q, $options: 'i' } },
            { bio: { $regex: q, $options: 'i' } },
          ],
        }
      : {};

    let query = Organizer.find(filter).sort({ name: 1 });
    if (limit > 0) query = query.limit(limit);

    const items = await query.lean();
    return res.json({ success: true, data: items });
  } catch (err) {
    console.error('Public organizers list error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/public/:id', async (req, res) => {
  try {
    const item = await Organizer.findById(req.params.id).lean();
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Organizer not found' });
    }
    return res.json({ success: true, data: item });
  } catch (err) {
    console.error('Public organizer read error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* -------------------- PROTECTED ADMIN ROUTES -------------------- */
router.use(auth);

// list
router.get('/', async (req, res) => {
  try {
    const items = await Organizer.find().sort({ name: 1 }).lean();
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('GET /admin/organizers', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// get one
router.get('/:id', async (req, res) => {
  try {
    const item = await Organizer.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ success: false });
    res.json({ success: true, data: item });
  } catch (err) {
    console.error('GET /admin/organizers/:id', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// create (Cloudinary upload)
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, role, linkedin, twitter, bio } = req.body;

    let photo;
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        'tedxsmec/organizers'
      );
      photo = result.secure_url;
    }

    const doc = new Organizer({
      name,
      role,
      linkedin,
      twitter,
      bio,
      photo,
    });

    await doc.save();
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error('POST /admin/organizers', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// update (Cloudinary upload)
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const update = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        'tedxsmec/organizers'
      );
      update.photo = result.secure_url;
    }

    const doc = await Organizer.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).lean();

    if (!doc) return res.status(404).json({ success: false });
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error('PUT /admin/organizers/:id', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Organizer.findByIdAndDelete(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false });
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error('DELETE /admin/organizers/:id', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
