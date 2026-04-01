const router = require('express').Router();
const Shop = require('../../models/Shop');

router.get('/', async (req, res) => {
  try {
    res.json(await Shop.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/nearest', async (req, res) => {
  try {
    const count = await Shop.countDocuments();
    res.json(await Shop.aggregate([{ $sample: { size: Math.min(6, count) } }]));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Mağaza bulunamadı' });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
