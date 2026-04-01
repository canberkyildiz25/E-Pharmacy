const router = require('express').Router();
const Shop = require('../../models/Shop');

router.get('/', async (req, res) => {
  try {
    res.json(await Shop.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

router.get('/nearest', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const stores = await Shop.find().lean();
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const withDist = stores
        .map(s => ({ ...s, _dist: (s.lat && s.lng) ? haversine(userLat, userLng, s.lat, s.lng) : 99999 }))
        .sort((a, b) => a._dist - b._dist)
        .slice(0, 6);
      return res.json(withDist);
    }
    const count = stores.length;
    const shuffled = stores.sort(() => Math.random() - 0.5).slice(0, Math.min(6, count));
    res.json(shuffled);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Mağaza bulunamadı' });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
