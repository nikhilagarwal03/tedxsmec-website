// // routes/admin/media.js
// const express = require('express');
// const router = express.Router();

// const mediaCtrl = require('../../controllers/mediaController');
// const publicMediaCtrl = require('../../controllers/publicMediaController');
// const { uploadImage } = require('../../middleware/upload');

// /* ----------------------------------------------------
//    PUBLIC MEDIA ROUTES  (no auth)
//    These are accessible at:
//    GET /api/admin/media/public     -> list all media
//    GET /api/admin/media/public/:id -> single media
//    GET /api/admin/media/event/:eventId -> media for event
// ---------------------------------------------------- */

// // List public media
// router.get('/public', publicMediaCtrl.listPublicMedia);

// // Get single public media
// router.get('/public/:id', publicMediaCtrl.getPublicMedia);

// // Get event media (put before admin routes to avoid conflicts)
// router.get('/event/:eventId', publicMediaCtrl.listMediaForEvent);


// /* ----------------------------------------------------
//    ADMIN-ONLY MEDIA ROUTES
// ---------------------------------------------------- */

// // placeholder admin auth middleware
// function auth(req, res, next) {
//   // Replace with real authentication logic
//   return next();
// }

// // Use auth for all admin routes below
// router.use(auth);

// // ADMIN: list media
// router.get('/', mediaCtrl.listMedia);

// // ADMIN: create image or video
// router.post('/', uploadImage.single('file'), async (req, res) => {
//   if (req.file) return mediaCtrl.createImage(req, res);
//   if (req.body?.type === 'video' && req.body?.url) return mediaCtrl.createVideo(req, res);

//   return res.status(400).json({
//     success: false,
//     message:
//       'Invalid create request. Use multipart/form-data for images (field "file") OR JSON { type: "video", url }'
//   });
// });

// // ADMIN: get media metadata
// router.get('/:id', mediaCtrl.getMedia);

// // ADMIN: update metadata
// router.put('/:id', mediaCtrl.updateMedia);

// // ADMIN: delete media
// router.delete('/:id', mediaCtrl.deleteMedia);

// module.exports = router;



// routes/admin/media.js
const express = require('express');
const router = express.Router();

const mediaCtrl = require('../../controllers/mediaController');
const publicMediaCtrl = require('../../controllers/publicMediaController');

// 🔁 CHANGED: use memory upload + cloudinary
const upload = require('../../utils/upload');
const uploadToCloudinary = require('../../utils/uploadToCloudinary');

/* ----------------------------------------------------
   PUBLIC MEDIA ROUTES (no auth)
---------------------------------------------------- */

// GET /api/admin/media/public
router.get('/public', publicMediaCtrl.listPublicMedia);

// GET /api/admin/media/public/:id
router.get('/public/:id', publicMediaCtrl.getPublicMedia);

// GET /api/admin/media/event/:eventId
router.get('/event/:eventId', publicMediaCtrl.listMediaForEvent);

/* ----------------------------------------------------
   ADMIN-ONLY MEDIA ROUTES
---------------------------------------------------- */

// placeholder admin auth middleware
function auth(req, res, next) {
  // replace with real auth later
  return next();
}

router.use(auth);

// ADMIN: list media
router.get('/', mediaCtrl.listMedia);

// ADMIN: create image (Cloudinary) or video (YouTube URL)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    // IMAGE upload (Cloudinary)
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        'tedxsmec/media'
      );

      // Attach Cloudinary data so controller stays unchanged
      req.body = {
        ...req.body,
        type: 'image',
        path: result.secure_url,
        publicId: result.public_id, // useful for delete later
      };

      return mediaCtrl.createImage(req, res);
    }

    // VIDEO (YouTube)
    if (req.body?.type === 'video' && req.body?.url) {
      return mediaCtrl.createVideo(req, res);
    }

    return res.status(400).json({
      success: false,
      message:
        'Invalid create request. Use multipart/form-data for images (field "file") OR JSON { type: "video", url }',
    });
  } catch (err) {
    console.error('POST /admin/media upload error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADMIN: get media metadata
router.get('/:id', mediaCtrl.getMedia);

// ADMIN: update metadata
router.put('/:id', mediaCtrl.updateMedia);

// ADMIN: delete media
router.delete('/:id', mediaCtrl.deleteMedia);

module.exports = router;
