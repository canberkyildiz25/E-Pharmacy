const router = require('express').Router();
const Medicine = require('../../models/Medicine');
const Shop = require('../../models/Shop');
const ShopOrder = require('../../models/ShopOrder');
const IncomeExpense = require('../../models/IncomeExpense');

router.get('/', async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    const shopId = shop?._id;

    const [totalMedicines, totalOrders, deliveredOrders, recentOrders, incomeExpenses] = await Promise.all([
      Medicine.countDocuments(shopId ? { shop: shopId } : {}),
      ShopOrder.countDocuments(shopId ? { shop: shopId } : {}),
      ShopOrder.countDocuments(shopId ? { shop: shopId, status: 'Teslim Edildi' } : { status: 'Teslim Edildi' }),
      ShopOrder.find(shopId ? { shop: shopId } : {}).sort({ createdAt: -1 }).limit(5),
      IncomeExpense.find().sort({ createdAt: -1 }).limit(10),
    ]);

    const recentCustomers = recentOrders.map(o => ({
      _id: o._id,
      name: o.customerName,
      phone: o.customerPhone,
      createdAt: o.createdAt,
      total: o.total,
      status: o.status,
    }));

    res.json({
      statistics: { totalMedicines, totalShops: totalOrders, totalCustomers: deliveredOrders },
      recentCustomers,
      incomeExpenses,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:clientId/goods', async (req, res) => {
  try {
    const order = await ShopOrder.findById(req.params.clientId);
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
