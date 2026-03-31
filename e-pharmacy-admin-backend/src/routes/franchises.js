const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// GET /api/franchises — admin tüm franchise dükkanlarını görsün
router.get('/', auth, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5001/api/shop/all');
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch franchises', error: err.message });
  }
});

module.exports = router;
