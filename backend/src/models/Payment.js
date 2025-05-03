const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  status: {
    type: String,
    enum: ['CREATED', 'APPROVED', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'CREATED',
  },
  provider: {
    type: String,
    enum: ['paypal', 'stripe', 'credit_card'],
    default: 'paypal',
  },
  payerId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
  details: {
    type: Object,
  },
});

// Add indexes for faster lookups
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 