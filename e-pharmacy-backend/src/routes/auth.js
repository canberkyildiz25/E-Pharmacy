const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/user/register  (role: franchise | client)
router.post('/register', [
  body('name').notEmpty().withMessage('Ad zorunludur'),
  body('email').isEmail().withMessage('Geçerli bir e-posta girin'),
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır'),
  body('role').isIn(['franchise', 'client']).withMessage('Geçersiz rol'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const { name, email, password, phone, role } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Bu e-posta zaten kullanımda' });

    const user = await User.create({ name, email, password, phone, role });
    res.status(201).json({ token: sign(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/user/login  (tüm roller)
router.post('/login', [
  body('email').isEmail().withMessage('Geçerli bir e-posta girin'),
  body('password').notEmpty().withMessage('Şifre zorunludur'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'E-posta veya şifre hatalı' });
    }
    res.json({ token: sign(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/user/logout
router.get('/logout', auth, (req, res) => res.json({ message: 'Çıkış başarılı' }));

// GET /api/user/user-info
router.get('/user-info', auth, async (req, res) => {
  const Shop = require('../models/Shop');
  const shop = req.user.role === 'franchise' ? await Shop.findOne({ owner: req.user._id }) : null;
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
    shopId: shop?._id || null,
  });
});

module.exports = router;
