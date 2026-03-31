const express = require('express');
const router = express.Router();
const CustomerReview = require('../models/CustomerReview');

// GET /api/customer-reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await CustomerReview.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
