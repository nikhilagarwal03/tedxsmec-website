const express = require('express')
const cors = require('cors');

const app = express()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://tedxsmec-website.vercel.app',
  'https://tedxsmec-admin.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('CORS blocked'));
  },
  credentials: true
}));
