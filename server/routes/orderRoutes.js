const express = require('express');
const router = express.Router();
const { checkout, verifyPayment, getMyOrders } = require('../controllers/orderController');
const { auth, requireRole } = require('../middleware/auth');

router.post('/checkout', auth, requireRole('client'), checkout);
router.post('/verify', auth, requireRole('client'), verifyPayment);
router.get('/mine', auth, requireRole('client'), getMyOrders);

module.exports = router;
