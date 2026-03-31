const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/user/login
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/user/unified-login
router.post('/unified-login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    // Check admin first
    const adminUser = await User.findOne({ email });
    if (adminUser) {
      const isMatch = await adminUser.comparePassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
      const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
      return res.json({ role: 'admin', token, user: { id: adminUser._id, name: adminUser.name, email: adminUser.email } });
    }

    // Check franchise user
    try {
      const franchiseRes = await axios.post('http://localhost:5001/api/user/login', { email, password });
      return res.json({ role: 'franchise', token: franchiseRes.data.token, user: franchiseRes.data.user });
    } catch {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/user/logout
router.get('/logout', auth, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// GET /api/user/user-info
router.get('/user-info', auth, async (req, res) => {
  res.json({ name: req.user.name, email: req.user.email });
});

module.exports = router;
