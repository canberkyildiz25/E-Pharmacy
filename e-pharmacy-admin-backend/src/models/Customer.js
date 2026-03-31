const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  photo: { type: String, default: '' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  spent: { type: String, default: '0' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  register_date: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
