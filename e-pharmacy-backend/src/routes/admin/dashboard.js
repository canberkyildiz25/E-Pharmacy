const router = require('express').Router();
const Product = require('../../models/Product');
const Supplier = require('../../models/Supplier');
const Customer = require('../../models/Customer');
const IncomeExpense = require('../../models/IncomeExpense');

router.get('/', async (req, res) => {
  try {
    const [totalProducts, totalSuppliers, totalCustomers, recentCustomers, incomeExpenses] = await Promise.all([
      Product.countDocuments(),
      Supplier.countDocuments(),
      Customer.countDocuments(),
      Customer.find().sort({ createdAt: -1 }).limit(5),
      IncomeExpense.find().sort({ createdAt: -1 }).limit(10),
    ]);
    res.json({ statistics: { totalProducts, totalSuppliers, totalCustomers }, recentCustomers, incomeExpenses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
