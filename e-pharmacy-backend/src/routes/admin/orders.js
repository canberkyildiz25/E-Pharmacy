const router = require('express').Router();
const Order = require('../../models/Order');

router.get('/', async (req, res) => {
  try {
    const { name, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (status) filter.status = status;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    res.json(await Order.find(filter).sort(sort));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    res.status(201).json(await Order.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    res.json({ message: 'Sipariş silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
