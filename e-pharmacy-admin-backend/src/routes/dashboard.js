const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const Customer = require('../models/Customer');
const IncomeExpense = require('../models/IncomeExpense');

// GET /api/dashboard
router.get('/', auth, async (req, res) => {
  try {
    const [totalProducts, totalSuppliers, totalCustomers, recentCustomers, incomeExpenses] = await Promise.all([
      Product.countDocuments(),
      Supplier.countDocuments(),
      Customer.countDocuments(),
      Customer.find().sort({ createdAt: -1 }).limit(5),
      IncomeExpense.find().sort({ createdAt: -1 }).limit(10)
    ]);

    res.json({
      statistics: { totalProducts, totalSuppliers, totalCustomers },
      recentCustomers,
      incomeExpenses
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
