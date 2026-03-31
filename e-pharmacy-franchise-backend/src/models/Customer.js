const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  photo: { type: String, default: '' },
  spent: { type: String, default: '0' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  register_date: { type: String, default: '' },
  purchases: [{
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    medicineName: String,
    price: String,
    photo: String,
    description: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('FranchiseCustomer', customerSchema);
