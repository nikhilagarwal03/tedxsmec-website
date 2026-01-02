// const cloudinary = require('./cloudinary');

// const uploadToCloudinary = (buffer, folder) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload_stream(
//       {
//         folder,
//         resource_type: 'image',
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     ).end(buffer);
//   });
// };

// module.exports = uploadToCloudinary;


// utils/uploadToCloudinary.js
const cloudinary = require('cloudinary').v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new Error("No file buffer provided to Cloudinary"));
    }

    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer);
  });
};
