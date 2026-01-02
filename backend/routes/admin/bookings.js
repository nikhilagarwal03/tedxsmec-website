// // backend/routes/admin/bookings.js
// const express = require('express');
// const router = express.Router();
// const Ticket = require('../../models/Ticket');
// // optional: use your admin auth middleware if you have one
// const adminAuth = require('../../middleware/auth'); // adjust path if different

// // GET /api/admin/bookings
// router.get('/', adminAuth, async (req, res) => {
//   try {
//     const bookings = await Ticket.find()
//       .select('studentName ticketCode email phone status createdAt eventId')
//       .sort({ createdAt: -1 });
//     res.json(bookings);
//   } catch (err) {
//     console.error('admin bookings list error', err);
//     res.status(500).json({ error: 'server error' });
//   }
// });

// module.exports = router;


// backend/routes/admin/bookings.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const Ticket = require('../../models/Ticket');
const Event = require('../../models/Event');
const { sendTicketEmail, sendWhatsAppMessage } = require('../../utils/ticketUtils');

const router = express.Router();

// OPTIONAL: enable admin auth middleware if you have one
// const adminAuth = require('../../middleware/adminAuth');
// router.use(adminAuth);

/**
 * GET /api/admin/bookings
 * Returns a list of bookings with lightweight fields for admin table
 */
router.get('/', async (req, res) => {
  try {
    const bookings = await Ticket.find()
      .sort({ createdAt: -1 })
      .select('studentName ticketCode email phone status createdAt eventId rollNumber year department section')
      .populate('eventId', 'name'); // populate event name
    res.json(bookings);
  } catch (err) {
    console.error('admin bookings list error', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

/**
 * GET /api/admin/bookings/:id
 * Return full booking details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const ticket = await Ticket.findById(id).populate('eventId');
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // If ticket has imagePath that is saved as relative path, build full URL if BASE_URL available
    const baseUrl = (process.env.BASE_URL || '').replace(/\/$/, '');
    const ticketObj = ticket.toObject();
    if (ticketObj.imagePath && !ticketObj.imagePath.startsWith('http')) {
      ticketObj.imageUrl = baseUrl ? `${baseUrl}${ticketObj.imagePath.startsWith('/') ? '' : '/'}${ticketObj.imagePath}` : ticketObj.imagePath;
    } else {
      ticketObj.imageUrl = ticketObj.imagePath;
    }

    res.json(ticketObj);
  } catch (err) {
    console.error('admin booking detail error', err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

/**
 * POST /api/admin/bookings/:id/resend
 * Re-send ticket email (and optionally whatsapp)
 */
router.post('/:id/resend', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const ticket = await Ticket.findById(id).populate('eventId');
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    // Ensure assets exist; sendTicketEmail should generate assets if missing in many implementations
    try {
      await sendTicketEmail(ticket);
      await sendWhatsAppMessage(ticket).catch(e => console.warn('WhatsApp send failed', e));
    } catch (e) {
      console.error('resend email error', e);
      return res.status(500).json({ error: 'Failed to resend ticket' });
    }

    res.json({ ok: true, message: 'Ticket resent' });
  } catch (err) {
    console.error('admin resend error', err);
    res.status(500).json({ error: 'Failed to resend ticket' });
  }
});

/**
 * POST /api/admin/bookings/:id/cancel
 * Mark ticket cancelled
 */
router.post('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    ticket.status = 'cancelled';
    await ticket.save();

    res.json({ ok: true, message: 'Ticket cancelled' });
  } catch (err) {
    console.error('admin cancel error', err);
    res.status(500).json({ error: 'Failed to cancel ticket' });
  }
});

module.exports = router;
