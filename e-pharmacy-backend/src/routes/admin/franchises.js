const router = require('express').Router();
const Shop = require('../../models/Shop');

// Admin tüm franchise mağazalarını görür
router.get('/', async (req, res) => {
  try {
    const shops = await Shop.find().populate('owner', 'name email phone').sort({ createdAt: -1 });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
