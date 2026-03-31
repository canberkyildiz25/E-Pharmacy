const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'FranchiseUser', required: true },
  shopName: { type: String, required: true, trim: true },
  ownerName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  hasOwnDelivery: { type: Boolean, default: false },
  logo: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
