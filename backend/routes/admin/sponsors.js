// const express = require('express');
// const router = express.Router();
// const Sponsor = require('../../models/Sponsor');
// const auth = require('../../middleware/auth');
// const upload = require('../../utils/upload');

// /*
//   PUBLIC ROUTES (no auth)
//   - GET  /api/admin/sponsors/public/list
//   - GET  /api/admin/sponsors/public/:id
// */
// router.get('/public/list', async (req, res) => {
//   try {
//     const q = (req.query.q || '').trim();
//     const limit = Math.min(parseInt(req.query.limit || '0', 10) || 0, 200);
//     const filter = q ? {
//       $or: [
//         { name: { $regex: q, $options: 'i' } },
//         { description: { $regex: q, $options: 'i' } },
//       ],
//     } : {};

//     let query = Sponsor.find(filter).sort({ createdAt: -1 });
//     if (limit > 0) query = query.limit(limit);
//     const items = await query.lean();
//     return res.json({ success: true, data: items });
//   } catch (err) {
//     console.error('Public sponsor list error:', err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// router.get('/public/:id', async (req, res) => {
//   try {
//     const item = await Sponsor.findById(req.params.id).lean();
//     if (!item) return res.status(404).json({ success: false, message: 'Sponsor not found' });
//     return res.json({ success: true, data: item });
//   } catch (err) {
//     console.error('Public sponsor read error:', err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// /* -------------------- PROTECTED ADMIN ROUTES -------------------- */
// router.use(auth);

// // list (admin)
// router.get('/', async (req, res) => {
//   try {
//     const items = await Sponsor.find().sort({ createdAt: -1 }).lean();
//     res.json({ success: true, data: items });
//   } catch (err) {
//     console.error('GET /admin/sponsors', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // get one (admin)
// router.get('/:id', async (req, res) => {
//   try {
//     const item = await Sponsor.findById(req.params.id).lean();
//     if (!item) return res.status(404).json({ success: false, message: 'Not found' });
//     res.json({ success: true, data: item });
//   } catch (err) {
//     console.error('GET /admin/sponsors/:id', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // create (multipart - logo)
// router.post('/', upload.single('logo'), async (req, res) => {
//   try {
//     const { name, website, description, logoUrl } = req.body;
//     const logo = req.file ? `uploads/${req.file.filename}` : undefined;
//     const sponsor = new Sponsor({ name, website, description, logo: logo || undefined, logoUrl });
//     await sponsor.save();
//     res.json({ success: true, data: sponsor });
//   } catch (err) {
//     console.error('POST /admin/sponsors', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // update
// router.put('/:id', upload.single('logo'), async (req, res) => {
//   try {
//     const update = { ...req.body };
//     if (req.file) update.logo = `uploads/${req.file.filename}`;
//     const updated = await Sponsor.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
//     if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
//     res.json({ success: true, data: updated });
//   } catch (err) {
//     console.error('PUT /admin/sponsors/:id', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // delete
// router.delete('/:id', async (req, res) => {
//   try {
//     const del = await Sponsor.findByIdAndDelete(req.params.id).lean();
//     if (!del) return res.status(404).json({ success: false, message: 'Not found' });
//     res.json({ success: true, data: del });
//   } catch (err) {
//     console.error('DELETE /admin/sponsors/:id', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();

const Sponsor = require('../../models/Sponsor');
const auth = require('../../middleware/auth');

// multer (memory storage)
const upload = require('../../utils/upload');
const uploadToCloudinary = require('../../utils/uploadToCloudinary');

/*
  PUBLIC ROUTES (no auth)
  - GET  /api/admin/sponsors/public/list
  - GET  /api/admin/sponsors/public/:id
*/
router.get('/public/list', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const limit = Math.min(parseInt(req.query.limit || '0', 10) || 0, 200);

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
          ],
        }
      : {};

    let query = Sponsor.find(filter).sort({ createdAt: -1 });
    if (limit > 0) query = query.limit(limit);

    const items = await query.lean();
    return res.json({ success: true, data: items });
  } catch (err) {
    console.error('Public sponsor list error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/public/:id', async (req, res) => {
  try {
    const item = await Sponsor.findById(req.params.id).lean();
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Sponsor not found' });
    }
    return res.json({ success: true, data: item });
  } catch (err) {
    console.error('Public sponsor read error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* -------------------- PROTECTED ADMIN ROUTES -------------------- */
router.use(auth);

// list (admin)
router.get('/', async (req, res) => {
  try {
    const items = await Sponsor.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('GET /admin/sponsors', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// get one (admin)
router.get('/:id', async (req, res) => {
  try {
    const item = await Sponsor.findById(req.params.id).lean();
    if (!item) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    console.error('GET /admin/sponsors/:id', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// create (Cloudinary upload)
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { name, website, description, logoUrl } = req.body;

    let logo;
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        'tedxsmec/sponsors'
      );
      logo = result.secure_url;
    }

    const sponsor = new Sponsor({
      name,
      website,
      description,
      logo: logo || undefined,
      logoUrl,
    });

    await sponsor.save();
    res.json({ success: true, data: sponsor });
  } catch (err) {
    console.error('POST /admin/sponsors', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// update (Cloudinary upload)
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const update = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        'tedxsmec/sponsors'
      );
      update.logo = result.secure_url;
    }

    const updated = await Sponsor.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('PUT /admin/sponsors/:id', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const del = await Sponsor.findByIdAndDelete(req.params.id).lean();
    if (!del) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({ success: true, data: del });
  } catch (err) {
    console.error('DELETE /admin/sponsors/:id', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
