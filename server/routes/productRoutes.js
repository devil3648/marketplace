const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { auth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Seller only
router.get('/seller/mine', auth, requireRole('seller'), getMyProducts);
router.post('/', auth, requireRole('seller'), upload.array('images', 5), createProduct);
router.put('/:id', auth, requireRole('seller'), upload.array('images', 5), updateProduct);
router.delete('/:id', auth, requireRole('seller'), deleteProduct);

module.exports = router;
