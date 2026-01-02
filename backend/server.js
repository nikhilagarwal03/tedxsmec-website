// // backend/server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const path = require('path');

// const eventsRouter = require('./routes/events');
// const bookingRouter = require('./routes/booking');
// const webhookRouter = require('./routes/webhook');

// const adminAuthRouter = require('./routes/admin/auth');
// const adminEventsRouter = require('./routes/admin/events');
// const adminSpeakersRouter = require('./routes/admin/speakers');
// const adminSponsorsRouter = require('./routes/admin/sponsors');
// const adminOrganizersRouter = require('./routes/admin/organizers');
// const adminCoordinatorsRouter = require('./routes/admin/coordinators');

// // Combined admin media router (contains public endpoints under /public and event/:eventId)
// const adminMediaRoutes = require('./routes/admin/media');


// const adminBookingsRouter = require('./routes/admin/bookings');


// const app = express();

// /* ---------- CORS ---------- */
// const allowed = [
//   process.env.CORS_ORIGIN,
//   'http://localhost:5173',
//   'http://localhost:5174',
//   'http://127.0.0.1:5174',
//   "http://localhost:5173",
//   "http://localhost:4173",
//   "https://tedx-smec-website.vercel.app"
// ].filter(Boolean);

// const corsOptions = {
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true); // allow curl/postman
//     if (allowed.indexOf(origin) !== -1) return callback(null, true);
//     return callback(new Error('CORS not allowed by server'), false);
//   },
//   credentials: true
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// /* serve uploads (public files) */
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// /* ---------- DB ---------- */
// const mongoUri = process.env.MONGODB_URI;
// if (!mongoUri) {
//   console.error('MONGODB_URI missing in .env');
//   process.exit(1);
// }

// mongoose.connect(mongoUri)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => { console.error(err); process.exit(1); });

// /* ---------- health + debug ---------- */
// app.get('/api/health', (_, res) => res.json({ ok: true }));
// app.get('/api/admin/_ping', (_, res) => res.json({ ok: true, time: new Date().toISOString() }));

// /* ---------- API mounts (public-facing) ---------- */
// app.use('/api/events', eventsRouter);
// app.use('/api/book', bookingRouter);
// app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookRouter);

// /* ---------- admin: auth + resources ---------- */
// app.use('/api/admin/auth', adminAuthRouter);

// /* admin resources -- your admin routers (adminMediaRoutes contains public subroutes under /public) */
// app.use('/api/admin/events', adminEventsRouter);
// app.use('/api/admin/speakers', adminSpeakersRouter);
// app.use('/api/admin/sponsors', adminSponsorsRouter);
// app.use('/api/admin/organizers', adminOrganizersRouter);
// app.use('/api/admin/coordinators', adminCoordinatorsRouter);

// // mount the combined admin/media router (this file exposes:
// //   GET  /api/admin/media/public
// //   GET  /api/admin/media/public/:id
// //   GET  /api/admin/media/event/:eventId
// // and admin protected endpoints at /api/admin/media and /api/admin/media/:id etc.)
// app.use('/api/admin/media', adminMediaRoutes);


// app.use('/api/admin/bookings', adminBookingsRouter);


// /* ---------- start ---------- */
// const port = process.env.PORT || 4000;
// app.listen(port, () => console.log(`Backend listening http://localhost:${port}`));


// // // backend/server.js
// // require('dotenv').config();

// // const express = require('express');
// // const cors = require('cors');
// // const mongoose = require('mongoose');
// // const path = require('path');

// // /* ---------- ROUTES ---------- */
// // const eventsRouter = require('./routes/events');
// // const bookingRouter = require('./routes/booking');
// // const webhookRouter = require('./routes/webhook');

// // const adminAuthRouter = require('./routes/admin/auth');
// // const adminEventsRouter = require('./routes/admin/events');
// // const adminSpeakersRouter = require('./routes/admin/speakers');
// // const adminSponsorsRouter = require('./routes/admin/sponsors');
// // const adminOrganizersRouter = require('./routes/admin/organizers');
// // const adminCoordinatorsRouter = require('./routes/admin/coordinators');
// // const adminMediaRoutes = require('./routes/admin/media');
// // const adminBookingsRouter = require('./routes/admin/bookings');

// // const app = express();

// // /* ---------- FAVICON (PREVENT 500) ---------- */
// // app.get('/favicon.ico', (req, res) => res.status(204).end());

// // /* ---------- CORS (SERVERLESS SAFE – NEVER THROW) ---------- */
// // const allowedOrigins = [
// //   process.env.CORS_ORIGIN,
// //   'http://localhost:5173',
// //   'http://localhost:4173',
// //   'http://127.0.0.1:5173',
// //   'http://127.0.0.1:4173',
// //   'https://tedx-smec-website.vercel.app',
// // ].filter(Boolean);

// // app.use(
// //   cors({
// //     origin(origin, callback) {
// //       // Allow server-to-server, Postman, browser opening backend URL
// //       if (!origin) return callback(null, true);

// //       // Allow any Vercel domain
// //       if (origin.includes('vercel.app')) return callback(null, true);

// //       if (allowedOrigins.includes(origin)) {
// //         return callback(null, true);
// //       }

// //       // ❌ DO NOT throw in serverless
// //       return callback(null, false);
// //     },
// //     credentials: true,
// //   })
// // );

// // /* ---------- BODY PARSER ---------- */
// // app.use(express.json());

// // /* ---------- STATIC FILES ---------- */
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // /* ---------- DATABASE (SERVERLESS SAFE) ---------- */
// // const mongoUri = process.env.MONGODB_URI;

// // // ⚠️ Never throw during startup on Vercel
// // if (mongoUri && mongoose.connection.readyState === 0) {
// //   mongoose
// //     .connect(mongoUri)
// //     .then(() => console.log('✅ MongoDB connected'))
// //     .catch((err) => {
// //       console.error('❌ MongoDB connection error:', err.message);
// //       // DO NOT throw — allow app to run
// //     });
// // }

// // /* ---------- ROOT CHECK (OPENING URL WORKS) ---------- */
// // app.get('/', (req, res) => {
// //   res.status(200).json({
// //     success: true,
// //     message: '🚀 TEDxSMEC Backend is running successfully',
// //     time: new Date().toISOString(),
// //   });
// // });

// // /* ---------- PUBLIC API ROUTES ---------- */
// // app.use('/api/events', eventsRouter);
// // app.use('/api/book', bookingRouter);

// // /* ---------- RAZORPAY WEBHOOK ---------- */
// // app.post(
// //   '/api/payments/webhook',
// //   express.raw({ type: 'application/json' }),
// //   webhookRouter
// // );

// // /* ---------- ADMIN AUTH ---------- */
// // app.use('/api/admin/auth', adminAuthRouter);

// // /* ---------- ADMIN RESOURCES ---------- */
// // app.use('/api/admin/events', adminEventsRouter);
// // app.use('/api/admin/speakers', adminSpeakersRouter);
// // app.use('/api/admin/sponsors', adminSponsorsRouter);
// // app.use('/api/admin/organizers', adminOrganizersRouter);
// // app.use('/api/admin/coordinators', adminCoordinatorsRouter);
// // app.use('/api/admin/media', adminMediaRoutes);
// // app.use('/api/admin/bookings', adminBookingsRouter);

// // /* ---------- EXPORT FOR VERCEL ---------- */
// // module.exports = app;



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const eventsRouter = require('./routes/events');
const bookingRouter = require('./routes/booking');
const webhookRouter = require('./routes/webhook');

const adminAuthRouter = require('./routes/admin/auth');
const adminEventsRouter = require('./routes/admin/events');
const adminSpeakersRouter = require('./routes/admin/speakers');
const adminSponsorsRouter = require('./routes/admin/sponsors');
const adminOrganizersRouter = require('./routes/admin/organizers');
const adminCoordinatorsRouter = require('./routes/admin/coordinators');
const adminMediaRoutes = require('./routes/admin/media');
const adminBookingsRouter = require('./routes/admin/bookings');

const app = express();

/* ---------- CORS ---------- */
const allowed = [
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:4173',
  'https://tedx-smec-website.vercel.app'
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowed.includes(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed by server'), false);
  },
  credentials: true
};

app.use(cors(corsOptions));

/* ---------- RAW BODY CAPTURE (for Razorpay webhook) ---------- */
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      req.rawBody = data;
      next();
    });
  } else {
    next();
  }
});

/* ---------- BODY PARSERS ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- OPTIONAL: serve uploads (safe to keep) ---------- */
/* If you fully migrated to Cloudinary, this is unused but harmless */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ---------- DB ---------- */
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('❌ MONGODB_URI missing in .env');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

/* ---------- HEALTH ---------- */
app.get('/api/health', (_, res) => res.json({ ok: true }));
app.get('/api/admin/_ping', (_, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

/* ---------- PUBLIC API ---------- */
app.use('/api/events', eventsRouter);
app.use('/api/book', bookingRouter);

/* Razorpay Webhook (RAW BODY REQUIRED) */
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  webhookRouter
);

/* ---------- ADMIN ---------- */
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/events', adminEventsRouter);
app.use('/api/admin/speakers', adminSpeakersRouter);
app.use('/api/admin/sponsors', adminSponsorsRouter);
app.use('/api/admin/organizers', adminOrganizersRouter);
app.use('/api/admin/coordinators', adminCoordinatorsRouter);
app.use('/api/admin/media', adminMediaRoutes);
app.use('/api/admin/bookings', adminBookingsRouter);

/* ---------- START ---------- */
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Backend listening at http://localhost:${port}`);
});
