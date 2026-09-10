const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Client: create a Razorpay order from cart items
// body: { items: [{ productId, quantity }] }
exports.checkout = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({ product: product._id, quantity: item.quantity, price: product.price });
    }

    const razorOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    const order = await Order.create({
      client: req.user.id,
      items: orderItems,
      totalAmount,
      razorpayOrderId: razorOrder.id,
      status: 'pending',
    });

    res.status(201).json({
      orderId: order._id,
      razorpayOrder: razorOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: 'Checkout failed', error: err.message });
  }
};

// Client: verify payment signature after Razorpay checkout completes
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      order.status = 'failed';
      await order.save();
      return res.status(400).json({ success: false, message: 'Signature verification failed' });
    }

    // Reduce stock for each item
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    order.status = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
};

// Client: view own orders
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ client: req.user.id })
    .populate('items.product', 'title images')
    .sort({ createdAt: -1 });
  res.json(orders);
};
