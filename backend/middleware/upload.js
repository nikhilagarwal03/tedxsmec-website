// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ensure uploads folder exists
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  // accept images only for image uploads
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'), false);
  }
  cb(null, true);
};

const uploadImage = multer({ storage, fileFilter });

module.exports = { uploadImage, UPLOAD_DIR };
