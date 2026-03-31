const mongoose = require('mongoose');

// Franchise Shop modeliyle aynı collection'ı paylaşır (discriminator değil, aynı model adı)
const storeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'FranchiseUser' },
  shopName: { type: String, required: true },
  ownerName: { type: String },
  email: { type: String },
  phone: { type: String },
  streetAddress: { type: String },
  city: { type: String },
  zipCode: { type: String },
  hasOwnDelivery: { type: Boolean, default: false },
  logo: { type: String, default: '' },
  rating: { type: Number, default: 4, min: 1, max: 5 },
  isOpen: { type: Boolean, default: true },
}, { timestamps: true });

// Franchise backend'teki 'shops' collection'ını kullan
module.exports = mongoose.model('Shop', storeSchema, 'shops');
