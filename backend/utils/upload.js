// // backend/utils/upload.js
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const uploadDir = path.join(__dirname, '..', 'uploads');
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
//     cb(null, name);
//   }
// });

// const upload = multer({ storage });

// module.exports = upload;


const multer = require('multer');

// Store file in memory (RAM)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;
