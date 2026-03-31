const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userName: { type: String },
  text: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 5 },
}, { timestamps: true });

const medicineSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Medicine' },
  photo: { type: String, default: '' },
  warnings: { type: String, default: '' },
  reviews: [reviewSchema],
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });

// Franchise backend'teki 'medicines' collection'ını kullan
module.exports = mongoose.model('ClientMedicine', medicineSchema, 'medicines');
