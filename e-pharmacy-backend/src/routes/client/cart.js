const router = require('express').Router();
const Cart = require('../../models/Cart');
const Medicine = require('../../models/Medicine');
const ShopOrder = require('../../models/ShopOrder');

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

    const { address, phone, note } = req.body;

    // Her item için hangi shop'a ait olduğunu bul, shop bazında grupla
    const shopMap = {};
    for (const item of cart.items) {
      const med = await Medicine.findById(item.productId).select('shop').lean();
      const shopId = med?.shop?.toString() || 'unknown';
      if (!shopMap[shopId]) shopMap[shopId] = [];
      shopMap[shopId].push(item);
    }

    // Her shop için ayrı sipariş oluştur
    for (const [shopId, items] of Object.entries(shopMap)) {
      if (shopId === 'unknown') continue;
      const total = items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);
      await ShopOrder.create({
        customer: req.user._id,
        customerName: req.user.name || req.user.email,
        customerPhone: phone || '',
        shop: shopId,
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          photo: i.photo,
          quantity: i.quantity,
        })),
        address: address || '',
        note: note || '',
        total,
      });
    }

    cart.items = [];
    await cart.save();
    res.json({ message: 'Sipariş başarıyla oluşturuldu' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
