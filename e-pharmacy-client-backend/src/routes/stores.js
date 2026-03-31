const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

// GET /api/stores — tüm mağazalar
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find().sort({ createdAt: -1 });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/stores/nearest — rastgele 6 mağaza (ana sayfa için)
router.get('/nearest', async (req, res) => {
  try {
    const count = await Store.countDocuments();
    const stores = await Store.aggregate([{ $sample: { size: Math.min(6, count) } }]);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/stores/:id
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
