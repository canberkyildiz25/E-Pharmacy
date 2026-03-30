const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  photo: { type: String, default: '' },
  name: { type: String, required: true },
  address: { type: String, required: true },
  products: { type: String, required: true },
  price: { type: String, required: true },
  status: {
    type: String,
    enum: ['Completed', 'Confirmed', 'Pending', 'Cancelled', 'Processing', 'Shipped', 'Delivered'],
    required: true
  },
  order_date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
