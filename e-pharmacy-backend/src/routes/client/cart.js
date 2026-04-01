const router = require('express').Router();
const Cart = require('../../models/Cart');

router.get('/', async (req, res) => {
  try {
    res.json(await Cart.findOne({ user: req.user._id }) || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/update', async (req, res) => {
  try {
    const { productId, name, price, photo, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });
    const idx = cart.items.findIndex(i => i.productId.toString() === productId);
    if (idx > -1) {
      quantity <= 0 ? cart.items.splice(idx, 1) : (cart.items[idx].quantity = quantity);
    } else if (quantity > 0) {
      cart.items.push({ productId, name, price, photo, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/checkout', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Sepet boş' });
    cart.items = [];
    await cart.save();
    res.json({ message: 'Sipariş başarıyla oluşturuldu' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
