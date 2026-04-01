const router = require('express').Router();
const upload = require('../../middleware/upload');
const Shop = require('../../models/Shop');
const Medicine = require('../../models/Medicine');

const CATEGORIES = ['Medicine','Head','Hand','Dental Care','Skin Care','Eye Care','Vitamins & Supplements','Orthopedic Products','Baby Care'];

// Tüm mağazalar (admin erişimi için)
router.get('/all', async (req, res) => {
  try {
    res.json(await Shop.find().populate('owner', 'name email phone').sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mağaza oluştur
router.post('/create', upload.single('logo'), async (req, res) => {
  try {
    if (await Shop.findOne({ owner: req.user._id })) {
      return res.status(400).json({ message: 'Zaten bir mağazanız var' });
    }
    const { shopName, ownerName, email, phone, streetAddress, city, zipCode, hasOwnDelivery } = req.body;
    const shop = await Shop.create({
      owner: req.user._id, shopName, ownerName, email, phone, streetAddress, city, zipCode,
      hasOwnDelivery: hasOwnDelivery === 'true' || hasOwnDelivery === true,
      logo: req.file ? `/uploads/${req.file.filename}` : '',
    });
    res.status(201).json(shop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mağaza detayı
router.get('/:shopId', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId).populate('owner', 'name email');
    if (!shop) return res.status(404).json({ message: 'Mağaza bulunamadı' });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mağaza güncelle
router.put('/:shopId/update', upload.single('logo'), async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Mağaza bulunamadı' });
    if (shop.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Yetkisiz erişim' });
    const updates = { ...req.body };
    if (updates.hasOwnDelivery !== undefined) updates.hasOwnDelivery = updates.hasOwnDelivery === 'true';
    if (req.file) updates.logo = `/uploads/${req.file.filename}`;
    res.json(await Shop.findByIdAndUpdate(req.params.shopId, updates, { new: true }));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mağaza ürünleri listele
router.get('/:shopId/product', async (req, res) => {
  try {
    const { name, category, page = 1, limit = 10 } = req.query;
    const filter = { isPublic: true };
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = category;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [medicines, total] = await Promise.all([
      Medicine.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Medicine.countDocuments(filter),
    ]);
    res.json({ medicines, categories: CATEGORIES, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ürün ekle
router.post('/:shopId/product/add', upload.single('photo'), async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Mağaza bulunamadı' });
    if (shop.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Yetkisiz erişim' });
    const { name, price, description, category, warnings } = req.body;
    const medicine = await Medicine.create({
      shop: shop._id, name, price, description, category, warnings,
      photo: req.file ? `/uploads/${req.file.filename}` : '', isPublic: true,
    });
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Ürün güncelle
router.put('/:shopId/product/:productId/edit', upload.single('photo'), async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Mağaza bulunamadı' });
    if (shop.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Yetkisiz erişim' });
    const updates = { ...req.body };
    if (req.file) updates.photo = `/uploads/${req.file.filename}`;
    const medicine = await Medicine.findByIdAndUpdate(req.params.productId, updates, { new: true, runValidators: true });
    if (!medicine) return res.status(404).json({ message: 'İlaç bulunamadı' });
    res.json(medicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Ürün sil
router.delete('/:shopId/product/:productId/delete', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Mağaza bulunamadı' });
    if (shop.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Yetkisiz erişim' });
    await Medicine.findByIdAndDelete(req.params.productId);
    res.json({ message: 'İlaç silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
