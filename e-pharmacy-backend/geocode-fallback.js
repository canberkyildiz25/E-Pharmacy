/**
 * Koordinatı null kalan eczanelere şehir merkezini atar.
 * Çalıştır: node geocode-fallback.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Shop = require('./src/models/Shop');

const CITY_COORDS = {
  'istanbul': { lat: 41.0082, lng: 28.9784 },
  'ankara':   { lat: 39.9334, lng: 32.8597 },
  'izmir':    { lat: 38.4237, lng: 27.1428 },
  'bursa':    { lat: 40.1828, lng: 29.0665 },
  'antalya':  { lat: 36.8969, lng: 30.7133 },
  'adana':    { lat: 37.0000, lng: 35.3213 },
  'konya':    { lat: 37.8714, lng: 32.4846 },
  'gaziantep':{ lat: 37.0594, lng: 37.3825 },
  'kayseri':  { lat: 38.7205, lng: 35.4826 },
  'mersin':   { lat: 36.7959, lng: 34.5534 },
};

function normalize(str) {
  return str.toLowerCase()
    .replace(/ı/g, 'i').replace(/İ/g, 'i')
    .replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o')
    .replace(/ç/g, 'c').trim();
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB bağlandı');

  const shops = await Shop.find({ $or: [{ lat: null }, { lat: { $exists: false } }] });
  console.log(`${shops.length} eczane güncellenecek`);

  for (const shop of shops) {
    const key = normalize(shop.city);
    const coords = CITY_COORDS[key];
    if (coords) {
      // Şehir merkezine küçük rastgele offset ekle (kartlar üst üste gelmesin)
      const lat = coords.lat + (Math.random() - 0.5) * 0.04;
      const lng = coords.lng + (Math.random() - 0.5) * 0.04;
      await Shop.findByIdAndUpdate(shop._id, { lat, lng });
      console.log(`✓ ${shop.shopName} (${shop.city}) → ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } else {
      console.log(`✗ ${shop.shopName} — şehir bulunamadı: ${shop.city}`);
    }
  }

  console.log('Tamamlandı');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
