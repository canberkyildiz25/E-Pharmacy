const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// GET /api/orders
router.get('/', auth, async (req, res) => {
  try {
    const { name, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (status) filter.status = status;

    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const orders = await Order.find(filter).sort(sortObj);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
