const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
}, { timestamps: true });

const medicineSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true, trim: true },
  price: { type: String, required: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Medicine', 'Head', 'Hand', 'Dental Care', 'Skin Care', 'Eye Care', 'Vitamins & Supplements', 'Orthopedic Products', 'Baby Care', 'Heart', 'Leg'],
    default: 'Medicine'
  },
  photo: { type: String, default: '' },
  warnings: { type: String, default: '' },
  reviews: [reviewSchema],
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
