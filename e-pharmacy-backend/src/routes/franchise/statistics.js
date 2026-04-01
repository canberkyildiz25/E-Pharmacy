const router = require('express').Router();
const Medicine = require('../../models/Medicine');
const Shop = require('../../models/Shop');
const Customer = require('../../models/Customer');
const IncomeExpense = require('../../models/IncomeExpense');

router.get('/', async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    const shopId = shop?._id;
    const [totalMedicines, totalShops, totalCustomers, recentCustomers, incomeExpenses] = await Promise.all([
      Medicine.countDocuments(shopId ? { shop: shopId } : {}),
      Shop.countDocuments(),
      Customer.countDocuments(),
      Customer.find().sort({ createdAt: -1 }).limit(5),
      IncomeExpense.find().sort({ createdAt: -1 }).limit(10),
    ]);
    res.json({ statistics: { totalMedicines, totalShops, totalCustomers }, recentCustomers, incomeExpenses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:clientId/goods', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.clientId).populate('purchases.medicine');
    if (!customer) return res.status(404).json({ message: 'Müşteri bulunamadı' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
