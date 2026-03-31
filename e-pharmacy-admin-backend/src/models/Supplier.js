const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  photo: { type: String, default: '' },
  name: { type: String, required: true },
  address: { type: String, required: true },
  suppliers: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Deactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
