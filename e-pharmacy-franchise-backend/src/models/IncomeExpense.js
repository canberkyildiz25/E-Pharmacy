const mongoose = require('mongoose');

const incomeExpenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  type: { type: String, enum: ['Income', 'Expense', 'Error'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('FranchiseIncomeExpense', incomeExpenseSchema);
