const mongoose = require('mongoose');

const shopOrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  items: [{
    productId: String,
    name: String,
    price: Number,
    photo: String,
    quantity: Number,
  }],
  address: { type: String, default: '' },
  note: { type: String, default: '' },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Beklemede', 'Onaylandı', 'Hazırlanıyor', 'Teslimatta', 'Teslim Edildi', 'İptal'],
    default: 'Beklemede',
  },
}, { timestamps: true });

module.exports = mongoose.model('ShopOrder', shopOrderSchema);
