/**
 * franchise@epharmacy.com için test verisi oluşturur:
 * - Shop, ilaçlar, siparişler, gelir/gider kayıtları
 * Çalıştır: node seed-franchise-test.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Shop = require('./src/models/Shop');
const Medicine = require('./src/models/Medicine');
const ShopOrder = require('./src/models/ShopOrder');
const IncomeExpense = require('./src/models/IncomeExpense');

const MEDICINES = [
  { name: 'Parol 500mg Tablet', category: 'Medicine', price: 28.50, photo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80' },
  { name: 'Aspirin 500mg', category: 'Medicine', price: 19.90, photo: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80' },
  { name: 'Nurofen 400mg', category: 'Medicine', price: 45.00, photo: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80' },
  { name: 'Arveles 25mg', category: 'Medicine', price: 32.00, photo: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80' },
  { name: 'D3 Vitamini 1000 IU', category: 'Vitamins & Supplements', price: 42.00, photo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80' },
  { name: 'Omega-3 Balık Yağı', category: 'Vitamins & Supplements', price: 89.90, photo: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80' },
  { name: 'B12 Vitamini 1000mcg', category: 'Vitamins & Supplements', price: 38.50, photo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80' },
  { name: 'Magnezyum 375mg', category: 'Vitamins & Supplements', price: 55.00, photo: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80' },
  { name: 'Nivea Nemlendirici 150ml', category: 'Skin Care', price: 67.90, photo: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80' },
  { name: 'Acne Free Jel 30ml', category: 'Skin Care', price: 49.50, photo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80' },
  { name: 'Oral-B Diş Macunu 75ml', category: 'Dental Care', price: 34.90, photo: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&q=80' },
  { name: 'Refresh Göz Damlası', category: 'Eye Care', price: 67.00, photo: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&q=80' },
  { name: 'Voltaren Jel 50g', category: 'Orthopedic Products', price: 112.00, photo: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80' },
  { name: 'Augmentin 1000mg', category: 'Medicine', price: 145.00, photo: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80' },
  { name: 'Calpol Bebek Şurubu 60ml', category: 'Baby Care', price: 58.00, photo: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80' },
];

const CUSTOMERS = [
  { name: 'Ahmet Yılmaz',  phone: '0532 111 22 33', photo: 'https://i.pravatar.cc/150?img=11' },
  { name: 'Zeynep Kaya',   phone: '0542 222 33 44', photo: 'https://i.pravatar.cc/150?img=21' },
  { name: 'Murat Demir',   phone: '0553 333 44 55', photo: 'https://i.pravatar.cc/150?img=33' },
  { name: 'Elif Şahin',    phone: '0506 444 55 66', photo: 'https://i.pravatar.cc/150?img=47' },
  { name: 'Burak Çelik',   phone: '0534 555 66 77', photo: 'https://i.pravatar.cc/150?img=52' },
  { name: 'Selin Arslan',  phone: '0545 666 77 88', photo: 'https://i.pravatar.cc/150?img=44' },
  { name: 'Hasan Doğan',   phone: '0512 777 88 99', photo: 'https://i.pravatar.cc/150?img=67' },
];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB bağlandı');

  // Kullanıcı
  const user = await User.findOne({ email: 'franchise@epharmacy.com' });
  if (!user) { console.error('franchise@epharmacy.com bulunamadı'); process.exit(1); }
  console.log('Kullanıcı:', user.name);

  // Shop oluştur (varsa geç)
  let shop = await Shop.findOne({ owner: user._id });
  if (!shop) {
    shop = await Shop.create({
      owner: user._id,
      shopName: 'Demo Eczanesi',
      ownerName: 'Test Franchise',
      email: 'franchise@epharmacy.com',
      phone: '0212 999 00 11',
      streetAddress: 'Bağcılar Cad. No:5',
      city: 'İstanbul',
      zipCode: '34200',
      hasOwnDelivery: true,
      isOpen: true,
      lat: 41.0316 + (Math.random() - 0.5) * 0.02,
      lng: 28.8379 + (Math.random() - 0.5) * 0.02,
    });
    console.log('Shop oluşturuldu:', shop.shopName);
  } else {
    console.log('Shop zaten var:', shop.shopName);
  }

  // İlaçları ekle
  const medDocs = [];
  for (const m of MEDICINES) {
    let med = await Medicine.findOne({ shop: shop._id, name: m.name });
    if (!med) med = await Medicine.create({ ...m, shop: shop._id, isPublic: true });
    medDocs.push(med);
  }
  console.log(`${medDocs.length} ilaç hazır`);

  // Eski siparişleri temizle
  await ShopOrder.deleteMany({ shop: shop._id });

  // 20 adet test siparişi oluştur
  const statuses = ['Beklemede','Beklemede','Onaylandı','Hazırlanıyor','Teslimatta','Teslim Edildi','Teslim Edildi','Teslim Edildi'];
  const orders = [];
  for (let i = 0; i < 20; i++) {
    const customer = pick(CUSTOMERS);
    const items = pickN(medDocs, Math.floor(Math.random() * 3) + 1).map(m => ({
      productId: m._id.toString(),
      name: m.name,
      price: m.price,
      photo: m.photo,
      quantity: Math.floor(Math.random() * 3) + 1,
    }));
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const order = await ShopOrder.create({
      customer: user._id,
      customerName: customer.name,
      customerPhone: customer.phone,
      shop: shop._id,
      items,
      address: `${pick(['Atatürk Cad.','İstiklal Sk.','Cumhuriyet Blv.'])} No:${Math.floor(Math.random()*50)+1}, İstanbul`,
      note: Math.random() > 0.6 ? 'Kapıya bırakın' : '',
      total: Math.round(total * 100) / 100,
      status: pick(statuses),
      createdAt: daysAgo(Math.floor(Math.random() * 30)),
    });
    orders.push(order);
  }
  console.log(`${orders.length} sipariş oluşturuldu`);

  // IncomeExpense: teslim edilen siparişlerden gelir, gider kayıtları
  await IncomeExpense.deleteMany({});
  const delivered = orders.filter(o => o.status === 'Teslim Edildi');
  for (const o of delivered) {
    await IncomeExpense.create({
      name: `Sipariş - ${o.customerName}`,
      type: 'Income',
      amount: o.total.toFixed(2),
      createdAt: o.createdAt,
    });
  }
  // Birkaç gider kaydı
  const expenses = [
    { name: 'Raf kiralama', amount: '850.00' },
    { name: 'Soğuk zincir nakliye', amount: '320.00' },
    { name: 'Platform üyelik', amount: '799.00' },
    { name: 'Paketleme malzemesi', amount: '210.00' },
  ];
  for (const e of expenses) {
    await IncomeExpense.create({ ...e, type: 'Expense', createdAt: daysAgo(Math.floor(Math.random()*20)+1) });
  }
  console.log('Gelir/gider kayıtları oluşturuldu');

  const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);
  console.log(`\n✅ Tamamlandı!`);
  console.log(`   Shop: ${shop.shopName}`);
  console.log(`   İlaç: ${medDocs.length}`);
  console.log(`   Sipariş: ${orders.length} (${delivered.length} teslim edildi)`);
  console.log(`   Toplam Gelir: ${totalRevenue.toFixed(2)} ₺`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
