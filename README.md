# E-Pharmacy 💊

Eczaneleri, müşterileri ve eczane sahiplerini tek platformda buluşturan dijital eczane sistemi.

![E-Pharmacy Banner](https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80)

---

## Özellikler

### 👤 Müşteri Paneli
- Konuma göre yakın eczaneleri keşfet (Geolocation API)
- İlaç ara, filtrele ve sipariş ver
- Sepet yönetimi — adres, telefon ve teslimat notu ile sipariş tamamla
- Sipariş geçmişini takip et

### 🏪 Franchise (Eczane) Paneli
- Eczane profili oluştur ve düzenle
- İlaç envanterini yönet (ekle, düzenle, sil)
- Gelen siparişleri listele ve durumlarını güncelle
- Gelir/gider istatistikleri ve sipariş özeti

### ⚙️ Admin Paneli
- Platform geneli kullanıcı ve eczane yönetimi
- Tüm siparişleri ve istatistikleri görüntüle

---

## Ekran Görüntüleri

| Ana Sayfa | Eczane Paneli | Siparişler |
|-----------|--------------|------------|
| Yakın eczane arama, üyelik planları | İlaç envanteri yönetimi | Sipariş durumu takibi |

---

## Teknoloji Stack

### Backend
| Teknoloji | Kullanım |
|-----------|----------|
| Node.js + Express | REST API |
| MongoDB + Mongoose | Veritabanı |
| JWT | Kimlik doğrulama |
| bcryptjs | Şifre hashleme |
| Multer | Dosya yükleme |
| Helmet + CORS | Güvenlik |

### Frontend
| Teknoloji | Kullanım |
|-----------|----------|
| React 18 + Vite | UI framework |
| Redux Toolkit | State yönetimi |
| React Router v6 | Sayfa yönlendirme |
| React Hook Form + Yup | Form yönetimi ve validasyon |
| CSS Modules | Component bazlı stil |
| Axios | HTTP istekleri |
| React Hot Toast | Bildirimler |

### Harici Servisler
- **Nominatim (OpenStreetMap)** — Adres → koordinat dönüşümü
- **Haversine formülü** — Mesafeye göre eczane sıralama
- **Browser Geolocation API** — Kullanıcı konumu

---

## Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB (yerel veya Atlas)

### 1. Repoyu klonla
```bash
git clone https://github.com/canberkyildiz25/E-Pharmacy.git
cd E-Pharmacy
```

### 2. Backend kurulumu
```bash
cd e-pharmacy-backend
npm install
```

`e-pharmacy-backend/.env` dosyası oluştur:
```env
MONGODB_URI=mongodb://localhost:27017/epharmacy
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

```bash
npm run dev
```

### 3. Frontend kurulumu
```bash
cd ../e-pharmacy-frontend
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışır.

---

## Test Hesapları

Seed scriptlerini sırasıyla çalıştırarak hazır test verisi oluşturabilirsin:

```bash
cd e-pharmacy-backend
node seed-data.js      # eczaneler, ilaçlar ve franchise hesapları
node seed-admin.js     # admin hesabı
```

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Eczane Sahibi | `eczane1@epharmacy.com` | `eczane123` |
| Eczane Sahibi | `eczane2@epharmacy.com` | `eczane123` |
| Admin | `admin@epharmacy.com` | `admin123` |

---

## Proje Yapısı

```
E-Pharmacy/
├── e-pharmacy-backend/
│   ├── src/
│   │   ├── models/          # Mongoose şemaları
│   │   ├── routes/
│   │   │   ├── client/      # Müşteri API'leri
│   │   │   ├── franchise/   # Eczane API'leri
│   │   │   └── admin/       # Admin API'leri
│   │   └── server.js
│   └── seed-data.js
│
└── e-pharmacy-frontend/
    └── src/
        ├── components/      # Yeniden kullanılabilir bileşenler
        ├── pages/
        │   ├── client/      # Müşteri sayfaları
        │   ├── franchise/   # Eczane sayfaları
        │   └── admin/       # Admin sayfaları
        └── store/
            └── slices/      # Redux slice'ları
```

---

## Lisans

MIT
