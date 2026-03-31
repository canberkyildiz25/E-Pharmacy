const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Customer = require('../models/Customer');

// GET /api/customers
router.get('/', auth, async (req, res) => {
  try {
    const { name, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [customers, total] = await Promise.all([
      Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Customer.countDocuments(filter)
    ]);

    res.json({
      customers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/customers/:customerId
router.get('/:customerId', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
