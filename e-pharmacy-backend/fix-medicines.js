/**
 * 1. Mükerrer ürünleri sil (aynı isimden sadece birini bırak)
 * 2. Her ürüne kategorisine uygun benzersiz resim ata
 * Çalıştır: node fix-medicines.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Medicine = require('./src/models/Medicine');

// İsim bazlı özel fotoğraflar — ilaç/tıbbi ürün fotoğrafları
const PRODUCT_PHOTOS = {
  // Ağrı kesiciler — tablet/blister
  'Parol 500mg':          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
  'Parol 500mg Tablet':   'https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80',
  'Aspirin 100mg':        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80',
  'Aspirin 500mg':        'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80',
  'Nurofen Plus':         'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
  'Nurofen 400mg':        'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80',
  'Migren Plus':          'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80',
  'Arveles 25mg':         'https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80',
  // Antibiyotik/ilaç
  'Augmentin 1000mg':     'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80',
  'Sinüzit Sprey':        'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&q=80',
  // Vitaminler — vitamin/takviye şişeleri
  'Vitamin D3 1000IU':    'https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80',
  'D3 Vitamini 1000 IU':  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80',
  'Omega-3 1000mg':       'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80',
  'Omega-3 Balık Yağı':   'https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80',
  'Magnezyum 375mg':      'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80',
  'C Vitamini 1000mg':    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
  'B12 Vitamini 1000mcg': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80',
  // Cilt bakımı — tüp/krem
  'Nivea Nemlendirici':       'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80',
  'Nivea Nemlendirici 150ml': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
  'Acne Free Jel':            'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80',
  'Acne Free Jel 30ml':       'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
  'Bepanthen Krem 30g':       'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80',
  // Diş bakımı
  'Sensodyne Pro Diş Macunu': 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&q=80',
  'Gargara Listerine':        'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&q=80',
  'Gargara Listerine 250ml':  'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&q=80',
  'Oral-B Diş Macunu 75ml':   'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&q=80',
  // Göz bakımı — damlalık/küçük şişe
  'Göz Damlaları Systane':    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&q=80',
  'Refresh Göz Damlası':      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&q=80',
  // Bebek
  'Bepanthen Bebek Kremi':        'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80',
  'Gripe Water Bebek Gaz Damlası':'https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80',
  'Gripe Water Bebek 150ml':      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
  'Calpol Bebek Şurubu 60ml':     'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80',
  // Jel/krem (ortopedik)
  'Voltaren Jel':         'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80',
  'Voltaren Jel 50g':     'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80',
  'Voltaren Emulgel 100g':'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
  'Donjoy Diz Bandajı':   'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
};

// Kategori fallback — hepsi ilaç/eczane görseli
const PHOTOS = {
  'Pain Relief':            ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80','https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80','https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80'],
  'Vitamins & Supplements': ['https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80','https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80','https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80'],
  'Skin Care':              ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80','https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80'],
  'Dental Care':            ['https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&q=80','https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&q=80'],
  'Eye Care':               ['https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&q=80'],
  'Baby Care':              ['https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80','https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80'],
  'Antibiotics':            ['https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80','https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80'],
  'Orthopedic Products':    ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80','https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80'],
  default:                  ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80','https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80','https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80'],
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB bağlandı');

  const all = await Medicine.find().sort({ createdAt: 1 }).lean();
  console.log('Toplam ürün:', all.length);

  // 1. Mükerrerler: isim bazlı grupla, ilk kaydı tut, diğerlerini sil
  const seen = {};
  const toDelete = [];
  const toKeep = [];

  for (const med of all) {
    if (seen[med.name]) {
      toDelete.push(med._id);
    } else {
      seen[med.name] = true;
      toKeep.push(med);
    }
  }

  if (toDelete.length > 0) {
    await Medicine.deleteMany({ _id: { $in: toDelete } });
    console.log(`${toDelete.length} mükerrer silindi`);
  }

  // 2. Kalan her ürüne benzersiz resim ata (kategori bazlı, index döngüsü)
  const catIndexes = {};
  for (const med of toKeep) {
    const pool = PHOTOS[med.category] || PHOTOS.default;
    const idx = catIndexes[med.category] || 0;
    const photo = pool[idx % pool.length];
    catIndexes[med.category] = idx + 1;
    await Medicine.findByIdAndUpdate(med._id, { photo });
    console.log(`✓ ${med.name} (${med.category}) → resim atandı`);
  }

  console.log(`\nTamamlandı. ${toKeep.length} ürün kaldı.`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
