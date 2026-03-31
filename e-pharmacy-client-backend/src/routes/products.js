const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// GET /api/products — search + filter + pagination
router.get('/', async (req, res) => {
  try {
    const { name, category, page = 1, limit = 12 } = req.query;
    const filter = { isPublic: true };
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [medicines, total] = await Promise.all([
      Medicine.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Medicine.countDocuments(filter),
    ]);

    const categories = ['Medicine', 'Head', 'Hand', 'Dental Care', 'Skin Care', 'Eye Care', 'Vitamins & Supplements', 'Orthopedic Products', 'Baby Care'];

    res.json({
      medicines,
      categories,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate('shop', 'shopName city');
    if (!medicine) return res.status(404).json({ message: 'Product not found' });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
