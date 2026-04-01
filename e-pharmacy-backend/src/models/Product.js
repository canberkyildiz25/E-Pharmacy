const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  photo: { type: String, default: '' },
  name: { type: String, required: true },
  suppliers: { type: String, required: true },
  stock: { type: String, required: true },
  price: { type: String, required: true },
  category: {
    type: String,
    enum: ['Medicine', 'Head', 'Hand', 'Dental Care', 'Skin Care', 'Eye Care', 'Vitamins & Supplements', 'Orthopedic Products', 'Baby Care', 'Heart', 'Leg'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
