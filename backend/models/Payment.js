const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, default: 'created' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
