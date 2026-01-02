// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const TicketSchema = new Schema({
//   eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
//   studentName: { type: String, required: true },
//   rollNumber: String,
//   year: String,
//   department: String,
//   section:String,
//   email: { type: String, required: true },
//   phone: { type: String, required: true },
//   ticketCode: { type: String, unique: true, sparse: true },
//   status: { type: String, default: 'pending' }
// }, { timestamps: true });

// module.exports = mongoose.model('Ticket', TicketSchema);


// backend/models/Ticket.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const TicketSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  eventName: { type: String }, // optional snapshot
  price: { type: Number, default: 0 },

  studentName: { type: String, required: true },
  rollNumber: String,
  year: String,
  department: String,
  section: String,

  email: { type: String, required: true },
  phone: { type: String, required: true },

  ticketCode: { type: String, unique: true, sparse: true },
  status: { type: String, enum: ['pending','paid','cancelled','sent'], default: 'pending' },

  razorpayOrderId: String,
  razorpayPaymentId: String,

  qrDataUrl: String,          // data:image/png;base64,...
  pdfTicketBase64: String,    // base64 pdf
  imagePath: String,          // relative path to generated PNG saved in /uploads/tickets
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
