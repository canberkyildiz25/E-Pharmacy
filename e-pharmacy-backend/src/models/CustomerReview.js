const mongoose = require('mongoose');

const customerReviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  photo: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  text: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CustomerReview', customerReviewSchema);
