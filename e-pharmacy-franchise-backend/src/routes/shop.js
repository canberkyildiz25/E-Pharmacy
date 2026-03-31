const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Shop = require('../models/Shop');
const Medicine = require('../models/Medicine');

// GET /api/shop/all — admin paneli için tüm dükkanlar (internal)
router.get('/all', async (req, res) => {
  try {
    const shops = await Shop.find().populate('owner', 'name email phone').sort({ createdAt: -1 });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/shop/create
router.post('/create', auth, upload.single('logo'), async (req, res) => {
  try {
    const existing = await Shop.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You already have a shop' });
    }
    const { shopName, ownerName, email, phone, streetAddress, city, zipCode, hasOwnDelivery } = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : '';
    const shop = new Shop({
      owner: req.user._id,
      shopName, ownerName, email, phone,
      streetAddress, city, zipCode,
      hasOwnDelivery: hasOwnDelivery === 'true' || hasOwnDelivery === true,
      logo
    });
    await shop.save();
    res.status(201).json(shop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/shop/:shopId
router.get('/:shopId', auth, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId).populate('owner', 'name email');
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/shop/:shopId/update
router.put('/:shopId/update', auth, upload.single('logo'), async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    if (shop.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updates = { ...req.body };
    if (updates.hasOwnDelivery !== undefined) {
      updates.hasOwnDelivery = updates.hasOwnDelivery === 'true' || updates.hasOwnDelivery === true;
    }
    if (req.file) updates.logo = `/uploads/${req.file.filename}`;
    const updatedShop = await Shop.findByIdAndUpdate(req.params.shopId, updates, { new: true });
    res.json(updatedShop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/shop/:shopId/product - all medicines (public + shop's own)
router.get('/:shopId/product', auth, async (req, res) => {
  try {
    const { name, category, page = 1, limit = 10 } = req.query;
    const filter = { isPublic: true };
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = category;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [medicines, total] = await Promise.all([
      Medicine.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Medicine.countDocuments(filter)
    ]);
    const categories = ['Medicine', 'Head', 'Hand', 'Dental Care', 'Skin Care', 'Eye Care', 'Vitamins & Supplements', 'Orthopedic Products', 'Baby Care'];
    res.json({
      medicines, categories,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/shop/:shopId/product/add
router.post('/:shopId/product/add', auth, upload.single('photo'), async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    if (shop.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { name, price, description, category, warnings } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : '';
    const medicine = new Medicine({
      shop: shop._id, name, price, description, category, warnings, photo, isPublic: true
    });
    await medicine.save();
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/shop/:shopId/product/:productId
router.get('/:shopId/product/:productId', auth, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.productId).populate('shop', 'shopName');
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/shop/:shopId/product/:productId/edit
router.put('/:shopId/product/:productId/edit', auth, upload.single('photo'), async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    if (shop.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updates = { ...req.body };
    if (req.file) updates.photo = `/uploads/${req.file.filename}`;
    const medicine = await Medicine.findByIdAndUpdate(req.params.productId, updates, { new: true, runValidators: true });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json(medicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/shop/:shopId/product/:productId/delete
router.delete('/:shopId/product/:productId/delete', auth, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    if (shop.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Medicine.findByIdAndDelete(req.params.productId);
    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
