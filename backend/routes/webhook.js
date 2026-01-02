// // backend/routes/webhook.js
// const express = require('express');
// const crypto = require('crypto');
// const Ticket = require('../models/Ticket');
// const { generateQrDataUrl, generateTicketImageBuffer, generatePdfBuffer, sendTicketEmail, sendWhatsAppMessage } = require('../utils/ticketUtils');

// const router = express.Router();

// // NOTE: server.js already mounts this with express.raw({ type: 'application/json' })
// router.post('/', async (req, res) => {
//   try {
//     const secret = process.env.RAZORPAY_KEY_SECRET;
//     const signature = req.headers['x-razorpay-signature'];
//     const body = req.body; // because express.raw was used in server.js the body here is raw buffer; make sure server.js saved raw body on req.rawBody if needed

//     // If server.js used: app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookRouter);
//     // then req.body is raw buffer; we must compute signature from the raw string
//     const raw = req.rawBody || req.body;
//     const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
//     if (signature !== expected) {
//       console.warn('Invalid webhook signature');
//       return res.status(400).send('invalid signature');
//     }

//     const payload = typeof raw === 'string' ? JSON.parse(raw) : payload = JSON.parse(raw.toString());
//     // handle only payment.captured events
//     if (payload.event !== 'payment.captured') {
//       return res.json({ ok: true });
//     }

//     const payment = payload.payload.payment.entity;
//     const razorpayOrderId = payment.order_id;
//     const razorpayPaymentId = payment.id;

//     const ticket = await Ticket.findOne({ razorpayOrderId });
//     if (!ticket) {
//       console.warn('Webhook: ticket not found for order:', razorpayOrderId);
//       return res.json({ ok: true });
//     }

//     // finalize ticket
//     ticket.status = 'paid';
//     ticket.razorpayPaymentId = razorpayPaymentId;

//     // generate assets
//     try {
//       ticket.qrDataUrl = await generateQrDataUrl(ticket.ticketCode);
//       const { filePath } = await generateTicketImageBuffer(ticket);
//       ticket.imagePath = `/uploads/tickets/${path.basename(filePath)}`;
//       const pdfBuf = await generatePdfBuffer(ticket);
//       ticket.pdfTicketBase64 = pdfBuf.toString('base64');
//       await ticket.save();

//       await sendTicketEmail(ticket);
//       await sendWhatsAppMessage(ticket);
//     } catch (err) {
//       console.error('Webhook asset/email error', err);
//     }

//     res.json({ ok: true });
//   } catch (err) {
//     console.error('Webhook handler error', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


const express = require('express');
const crypto = require('crypto');
const Ticket = require('../models/Ticket');

const {
  generateQrDataUrl,
  generateTicketImageBuffer,
  generatePdfBuffer,
  sendTicketEmail,
  sendWhatsAppMessage
} = require('../utils/ticketUtils');

const uploadToCloudinary = require('../utils/uploadToCloudinary');

const router = express.Router();

// NOTE: server.js must mount this route with:
// app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookRouter);

router.post('/', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    // raw body (important for Razorpay signature verification)
    const rawBody = req.rawBody || req.body;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.warn('Invalid webhook signature');
      return res.status(400).send('invalid signature');
    }

    // parse payload safely
    const payload =
      typeof rawBody === 'string'
        ? JSON.parse(rawBody)
        : JSON.parse(rawBody.toString());

    // we only care about successful payments
    if (payload.event !== 'payment.captured') {
      return res.json({ ok: true });
    }

    const payment = payload.payload.payment.entity;
    const razorpayOrderId = payment.order_id;
    const razorpayPaymentId = payment.id;

    const ticket = await Ticket.findOne({ razorpayOrderId });
    if (!ticket) {
      console.warn('Webhook: ticket not found for order:', razorpayOrderId);
      return res.json({ ok: true });
    }

    // finalize ticket
    ticket.status = 'paid';
    ticket.razorpayPaymentId = razorpayPaymentId;

    /**
     * ASSET GENERATION (Cloudinary)
     * — exact same logic, only storage changed
     */
    try {
      // QR
      ticket.qrDataUrl = await generateQrDataUrl(ticket.ticketCode);

      // Ticket Image
      const imageBuffer = await generateTicketImageBuffer(ticket);
      const imageUpload = await uploadToCloudinary(
        imageBuffer,
        'tedxsmec/tickets/images',
        'image'
      );
      ticket.imageUrl = imageUpload.secure_url;

      // PDF
      const pdfBuffer = await generatePdfBuffer(ticket);
      const pdfUpload = await uploadToCloudinary(
        pdfBuffer,
        'tedxsmec/tickets/pdfs',
        'raw'
      );
      ticket.pdfUrl = pdfUpload.secure_url;
      ticket.pdfTicketBase64 = pdfBuffer.toString('base64');

      await ticket.save();

      // notifications
      await sendTicketEmail(ticket);
      await sendWhatsAppMessage(ticket);
    } catch (err) {
      console.error('Webhook asset/email error', err);
      // never fail webhook acknowledgement
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Webhook handler error', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
