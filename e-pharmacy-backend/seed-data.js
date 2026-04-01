require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./src/models/User')
const Shop = require('./src/models/Shop')
const Medicine = require('./src/models/Medicine')
const CustomerReview = require('./src/models/CustomerReview')

const REVIEWS = [
  { userName: 'Ayşe Kaya',    rating: 5, photo: 'https://i.pravatar.cc/150?img=1',  text: 'Siparişim çok hızlı geldi, ilaçlar orijinal ve sağlam paketlenmişti. Kesinlikle tavsiye ediyorum!' },
  { userName: 'Mehmet Demir', rating: 5, photo: 'https://i.pravatar.cc/150?img=3',  text: 'Yıllardır eczaneden aldığım ilacı burada çok daha uygun fiyata buldum. Harika bir platform.' },
  { userName: 'Fatma Şahin',  rating: 4, photo: 'https://i.pravatar.cc/150?img=5',  text: 'Kullanımı çok kolay, ödeme güvenli. Bir sonraki siparişimi de buradan vereceğim.' },
  { userName: 'Ali Yıldız',   rating: 5, photo: 'https://i.pravatar.cc/150?img=7',  text: 'Annem için acil ilaç lazımdı, aynı gün kapıya geldi. Çok teşekkür ederim!' },
  { userName: 'Zeynep Çelik', rating: 5, photo: 'https://i.pravatar.cc/150?img=9',  text: 'Hem fiyatlar uygun hem de müşteri hizmetleri çok ilgili. 5 yıldız hak ediyorlar.' },
  { userName: 'Hasan Öztürk', rating: 4, photo: 'https://i.pravatar.cc/150?img=11', text: 'Ürün çeşitliliği çok fazla, aradığım her şeyi bulabildim. Kargo da hızlıydı.' },
  { userName: 'Elif Arslan',  rating: 5, photo: 'https://i.pravatar.cc/150?img=13', text: 'Online eczane konusunda en güvendiğim platform bu. Hiç sorun yaşamadım.' },
  { userName: 'Burak Aydın',  rating: 5, photo: 'https://i.pravatar.cc/150?img=15', text: 'Vitamin takviyelerini burada aldım, fiyat/kalite dengesi mükemmel.' },
  { userName: 'Selin Güneş',  rating: 4, photo: 'https://i.pravatar.cc/150?img=17', text: 'Bebek ürünleri bölümü çok kapsamlı. Güvenle alışveriş yapabiliyorum.' },
]

const SHOPS = [
  { name: 'Merkez Eczanesi', owner: 'eczane1@epharmacy.com', city: 'İstanbul', street: 'Bağcılar Cad. No:12', phone: '0212 111 22 33', zip: '34200', logo: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80' },
  { name: 'Güneş Eczanesi',  owner: 'eczane2@epharmacy.com', city: 'Ankara',   street: 'Kızılay Mah. No:5',   phone: '0312 222 33 44', zip: '06420', logo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80' },
  { name: 'Hayat Eczanesi',  owner: 'eczane3@epharmacy.com', city: 'İzmir',    street: 'Alsancak Blv. No:7',  phone: '0232 333 44 55', zip: '35220', logo: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&q=80' },
  { name: 'Sağlık Eczanesi', owner: 'eczane4@epharmacy.com', city: 'Bursa',    street: 'Osmangazi Cad. No:3', phone: '0224 444 55 66', zip: '16010', logo: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80' },
  { name: 'Umut Eczanesi',   owner: 'eczane5@epharmacy.com', city: 'Antalya',  street: 'Lara Blv. No:21',     phone: '0242 555 66 77', zip: '07100', logo: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80' },
  { name: 'Çelik Eczanesi',  owner: 'eczane6@epharmacy.com', city: 'Adana',    street: 'Seyhan Cad. No:9',    phone: '0322 666 77 88', zip: '01010', logo: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80' },
]

const MEDICINES = [
  { name: 'Parol 500mg Tablet',       price: '28.50', category: 'Medicine',               photo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', description: 'Parasetamol içerikli ağrı kesici ve ateş düşürücü.', warnings: 'Günde 4 defadan fazla kullanmayın.' },
  { name: 'Nurofen 400mg',            price: '45.90', category: 'Medicine',               photo: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80', description: 'İbuprofen içerikli ağrı ve ateş ilacı.', warnings: 'Aç karnına almayın.' },
  { name: 'Aspirin 500mg',            price: '18.75', category: 'Medicine',               photo: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80', description: 'Asetilsalisilik asit içerikli klasik ağrı kesici.', warnings: '16 yaş altında kullanmayın.' },
  { name: 'Arveles 25mg',             price: '52.00', category: 'Medicine',               photo: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80', description: 'Deksketoprofen trometamol içerikli güçlü analjezik.', warnings: 'Reçeteli kullanım önerilir.' },
  { name: 'C Vitamini 1000mg',        price: '35.00', category: 'Vitamins & Supplements', photo: 'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=400&q=80', description: 'Bağışıklık sistemini destekler, antioksidan.', warnings: 'Aşırı dozdan kaçının.' },
  { name: 'D3 Vitamini 1000 IU',      price: '42.00', category: 'Vitamins & Supplements', photo: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=400&q=80', description: 'Kemik sağlığı ve bağışıklık için D3 vitamini.', warnings: 'Yemekle birlikte alın.' },
  { name: 'Omega-3 Balık Yağı',       price: '89.90', category: 'Vitamins & Supplements', photo: 'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=400&q=80', description: 'Kalp ve beyin sağlığı için yüksek doz omega-3.', warnings: 'Kan sulandırıcı kullananlar dikkat.' },
  { name: 'B12 Vitamini 1000mcg',     price: '38.50', category: 'Vitamins & Supplements', photo: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&q=80', description: 'Sinir sistemi ve enerji metabolizması için.', warnings: 'Böbrek hastalarına önerilmez.' },
  { name: 'Magnezyum 375mg',          price: '55.00', category: 'Vitamins & Supplements', photo: 'https://images.unsplash.com/photo-1544991875-5dc1b05f3d0b?w=400&q=80', description: 'Kas ve sinir fonksiyonu için magnezyum takviyesi.', warnings: 'Diyare yapabilir.' },
  { name: 'Acne Free Jel 30ml',       price: '48.00', category: 'Skin Care',              photo: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80', description: 'Akne ve sivilce karşıtı jel formülü.', warnings: 'Göz çevresine uygulamayın.' },
  { name: 'Bepanthen Krem 30g',       price: '62.00', category: 'Skin Care',              photo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80', description: 'Dexpanthenol içerikli yara iyileştirici krem.', warnings: 'Sadece dış kullanım.' },
  { name: 'Nivea Nemlendirici 150ml', price: '75.50', category: 'Skin Care',              photo: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400&q=80', description: 'Yoğun nemlendirici beden losyonu.', warnings: 'Hasarlı cilde uygulamayın.' },
  { name: 'Gargara Listerine 250ml',  price: '52.00', category: 'Dental Care',            photo: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&q=80', description: 'Antibakteriyel ağız gargarası.', warnings: '6 yaş altı kullanmayın.' },
  { name: 'Oral-B Diş Macunu 75ml',   price: '29.90', category: 'Dental Care',            photo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80', description: 'Florürlü beyazlatıcı diş macunu.', warnings: 'Yutmayın.' },
  { name: 'Refresh Göz Damlası',      price: '67.00', category: 'Eye Care',               photo: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80', description: 'Yapay gözyaşı, kuru göz sendromu için.', warnings: 'Kontakt lens çıkarılarak kullanın.' },
  { name: 'Voltaren Jel 50g',         price: '62.00', category: 'Medicine',               photo: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80', description: 'Diklofenakdiethilamin içerikli antiinflamatuvar jel.', warnings: 'Kırık cilde uygulamayın.' },
  { name: 'Gripe Water Bebek 150ml',  price: '45.00', category: 'Baby Care',              photo: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80', description: 'Bebeklerde gaz ve kolik rahatsızlıkları için.', warnings: '1 aydan küçük bebeklere vermeyin.' },
  { name: 'Calpol Bebek Şurubu 60ml', price: '38.00', category: 'Baby Care',              photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80', description: 'Parasetamol içerikli bebek ateş şurubu.', warnings: 'Doz tablosuna uyun.' },
  { name: 'Voltaren Emulgel 100g',    price: '95.00', category: 'Orthopedic Products',    photo: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f3?w=400&q=80', description: 'Eklem ve kas ağrılarına karşı güçlü jel.', warnings: 'Gözle temastan kaçının.' },
  { name: 'Donjoy Diz Bandajı',       price: '189.00', category: 'Orthopedic Products',   photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', description: 'Diz ağrısı ve yaralanmalar için destekleyici bandaj.', warnings: 'Çok sıkı bağlamayın.' },
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB bağlandı')

  // Franchise kullanıcıları oluştur
  const shopDocs = []
  for (const s of SHOPS) {
    let user = await User.findOne({ email: s.owner })
    if (!user) {
      user = await User.create({ name: s.name + ' Sahibi', email: s.owner, password: 'eczane123', role: 'franchise' })
      console.log('Kullanıcı oluşturuldu:', s.owner)
    }
    let shop = await Shop.findOne({ owner: user._id })
    if (!shop) {
      shop = await Shop.create({
        owner: user._id, shopName: s.name, ownerName: user.name,
        email: s.owner, phone: s.phone, streetAddress: s.street,
        city: s.city, zipCode: s.zip, hasOwnDelivery: true, logo: s.logo,
      })
      console.log('Mağaza oluşturuldu:', s.name)
    } else if (!shop.logo) {
      await Shop.findByIdAndUpdate(shop._id, { logo: s.logo })
    }
    shopDocs.push(shop)
  }

  // Her mağazaya ilaçları ekle, varsa fotoğrafı güncelle
  for (const shop of shopDocs) {
    for (const med of MEDICINES) {
      const exists = await Medicine.findOne({ shop: shop._id, name: med.name })
      if (!exists) {
        await Medicine.create({ ...med, shop: shop._id, isPublic: true })
      } else if (!exists.photo) {
        await Medicine.findByIdAndUpdate(exists._id, { photo: med.photo })
      }
    }
    console.log(`${shop.shopName} → ilaçlar güncellendi`)
  }

  // Müşteri yorumları
  const existingReviews = await CustomerReview.countDocuments()
  if (existingReviews === 0) {
    await CustomerReview.insertMany(REVIEWS)
    console.log(`${REVIEWS.length} müşteri yorumu eklendi`)
  }

  console.log('\nSeed tamamlandı!')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
