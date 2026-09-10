const Product = require('../models/Product');

// Public: list all products (with optional search/filter)
exports.getProducts = async (req, res) => {
  const { search, minPrice, maxPrice } = req.query;
  const filter = {};
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  const products = await Product.find(filter).populate('seller', 'name email').sort({ createdAt: -1 });
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('seller', 'name email');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// Seller: own products
exports.getMyProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
  res.json(products);
};

// Seller: create product
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, stock } = req.body;
    if (!title || price === undefined) {
      return res.status(400).json({ message: 'Title and price are required' });
    }
    const images = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const product = await Product.create({
      title,
      description,
      price,
      stock: stock || 0,
      images,
      seller: req.user.id,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

// Seller: update own product
exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.seller.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not your product' });
  }

  const { title, description, price, stock } = req.body;
  if (title !== undefined) product.title = title;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;

  if (req.files && req.files.length > 0) {
    product.images = req.files.map((f) => `/uploads/${f.filename}`);
  }

  await product.save();
  res.json(product);
};

// Seller: delete own product
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.seller.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not your product' });
  }
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
};
