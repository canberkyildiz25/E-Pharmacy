/**
 * Mevcut eczanelerin adreslerinden lat/lng koordinatlarını doldurur.
 * Çalıştır: node geocode-existing.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const https = require('https');
const Shop = require('./src/models/Shop');

function geocode(streetAddress, city, zipCode) {
  const q = encodeURIComponent(`${streetAddress}, ${zipCode} ${city}, Turkey`);
  const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'EPharmacyApp/1.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const r = JSON.parse(data);
          if (r.length > 0) resolve({ lat: parseFloat(r[0].lat), lng: parseFloat(r[0].lon) });
          else resolve({ lat: null, lng: null });
        } catch { resolve({ lat: null, lng: null }); }
      });
    }).on('error', () => resolve({ lat: null, lng: null }));
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB bağlandı');

  const shops = await Shop.find({ $or: [{ lat: null }, { lat: { $exists: false } }] });
  console.log(`${shops.length} eczane güncellenecek`);

  for (const shop of shops) {
    const { lat, lng } = await geocode(shop.streetAddress, shop.city, shop.zipCode);
    await Shop.findByIdAndUpdate(shop._id, { lat, lng });
    console.log(`✓ ${shop.shopName} → lat:${lat} lng:${lng}`);
    await sleep(1100); // Nominatim rate limit: max 1 istek/sn
  }

  console.log('Tamamlandı');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
