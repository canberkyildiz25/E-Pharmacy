const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

// GET /api/products
router.get('/', auth, async (req, res) => {
  try {
    const { name, category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = category;

    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const products = await Product.find(filter).sort(sortObj);
    const categories = ['Medicine', 'Head', 'Hand', 'Dental Care', 'Skin Care', 'Eye Care', 'Vitamins & Supplements', 'Orthopedic Products', 'Baby Care'];
    res.json({ products, categories });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/products
router.post('/', auth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:productId
router.put('/:productId', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:productId
router.delete('/:productId', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
