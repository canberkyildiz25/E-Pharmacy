const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const storesRoutes = require('./routes/stores');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const reviewsRoutes = require('./routes/reviews');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: ['http://localhost:5175', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', authRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/customer-reviews', reviewsRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Client server running on port ${PORT}`));
  })
  .catch(err => { console.error('MongoDB error:', err); process.exit(1); });

module.exports = app;
