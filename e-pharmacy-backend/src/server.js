const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const auth = require('./middleware/auth');
const requireRole = require('./middleware/role');

const authRoutes        = require('./routes/auth');
// Admin
const dashboardRoutes   = require('./routes/admin/dashboard');
const ordersRoutes      = require('./routes/admin/orders');
const adminProductsRoutes = require('./routes/admin/products');
const suppliersRoutes   = require('./routes/admin/suppliers');
const customersRoutes   = require('./routes/admin/customers');
const franchisesRoutes  = require('./routes/admin/franchises');
// Franchise
const shopRoutes        = require('./routes/franchise/shop');
const statisticsRoutes  = require('./routes/franchise/statistics');
const franchiseOrdersRoutes = require('./routes/franchise/orders');
// Client (public + auth)
const medicinesRoutes   = require('./routes/client/medicines');
const storesRoutes      = require('./routes/client/stores');
const cartRoutes        = require('./routes/client/cart');
const reviewsRoutes     = require('./routes/client/reviews');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean);
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(new Error('CORS: izin verilmeyen origin'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── AUTH (tüm roller) ──────────────────────────────
app.use('/api/user', authRoutes);

// ── ADMIN (sadece admin rolü) ──────────────────────
app.use('/api/dashboard',   auth, requireRole('admin'), dashboardRoutes);
app.use('/api/orders',      auth, requireRole('admin'), ordersRoutes);
app.use('/api/products',    auth, requireRole('admin'), adminProductsRoutes);
app.use('/api/suppliers',   auth, requireRole('admin'), suppliersRoutes);
app.use('/api/customers',   auth, requireRole('admin'), customersRoutes);
app.use('/api/franchises',  auth, requireRole('admin'), franchisesRoutes);

// ── FRANCHISE (sadece franchise rolü) ──────────────
app.use('/api/statistics',      auth, requireRole('franchise'), statisticsRoutes);
app.use('/api/shop',            auth, requireRole('franchise'), shopRoutes);
app.use('/api/franchise/orders', auth, requireRole('franchise'), franchiseOrdersRoutes);

// ── CLIENT (herkese açık veya client auth) ─────────
app.use('/api/medicines',        medicinesRoutes);   // public
app.use('/api/stores',           storesRoutes);      // public
app.use('/api/customer-reviews', reviewsRoutes);     // public
app.use('/api/cart',  auth, requireRole('client'), cartRoutes);

// ── 404 & ERROR ────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route bulunamadı' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Sunucu hatası' });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB bağlandı');
    app.listen(PORT, () => console.log(`Unified server çalışıyor → http://localhost:${PORT}`));
  })
  .catch(err => { console.error('MongoDB bağlantı hatası:', err); process.exit(1); });

module.exports = app;
