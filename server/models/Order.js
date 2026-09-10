const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // price at time of purchase
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
