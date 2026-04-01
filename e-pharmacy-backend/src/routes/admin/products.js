const router = require('express').Router();
const Product = require('../../models/Product');

const CATEGORIES = ['Medicine','Head','Hand','Dental Care','Skin Care','Eye Care','Vitamins & Supplements','Orthopedic Products','Baby Care'];

router.get('/', async (req, res) => {
  try {
    const { name, category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = category;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    res.json({ products: await Product.find(filter).sort(sort), categories: CATEGORIES });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    res.status(201).json(await Product.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    res.json({ message: 'Ürün silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
