const router = require('express').Router();
const ShopOrder = require('../../models/ShopOrder');
const Shop = require('../../models/Shop');

// Bu franchise'ın shop'una gelen siparişler
router.get('/', async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) return res.json([]);
    const orders = await ShopOrder.find({ shop: shop._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sipariş durumunu güncelle
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const shop = await Shop.findOne({ owner: req.user._id });
    const order = await ShopOrder.findOneAndUpdate(
      { _id: req.params.orderId, shop: shop._id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
