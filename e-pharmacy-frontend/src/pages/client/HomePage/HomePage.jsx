import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { fetchNearestStores } from '../../../store/slices/storeSlice'
import api from '../../../services/api'
import styles from './HomePage.module.css'

function StarRating({ rating = 4 }) {
  return (
    <span className={styles.stars}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= rating ? styles.starFull : styles.starEmpty}>★</span>
      ))}
    </span>
  )
}

const PHARMACY_IMAGES = [
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=70',
  'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&q=70',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=70',
  'https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&q=70',
  'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&q=70',
  'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=70',
]

function StoreModal({ store, idx, onClose, navigate }) {
  if (!store) return null
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <img
          src={store.coverImage || PHARMACY_IMAGES[idx % PHARMACY_IMAGES.length]}
          alt={store.shopName}
          className={styles.modalImg}
        />
        <div className={styles.modalBody}>
          <div className={styles.modalTop}>
            <div>
              <h2 className={styles.modalName}>{store.shopName}</h2>
              <StarRating rating={store.rating || 4} />
            </div>
            <span className={`${styles.storeStatus} ${store.isOpen !== false ? styles.open : styles.closed}`}>
              {store.isOpen !== false ? '● AÇIK' : '● KAPALI'}
            </span>
          </div>
          <div className={styles.modalInfoList}>
            <div className={styles.modalInfoRow}><span>📍</span><span>{store.streetAddress}, {store.city}</span></div>
            {store.phone && <div className={styles.modalInfoRow}><span>📞</span><span>{store.phone}</span></div>}
            {store.email && <div className={styles.modalInfoRow}><span>✉️</span><span>{store.email}</span></div>}
            {store.workingHours && <div className={styles.modalInfoRow}><span>🕐</span><span>{store.workingHours}</span></div>}
            {store.hasOwnDelivery && <div className={styles.modalInfoRow}><span>🚚</span><span>Kendi teslimatı mevcut</span></div>}
          </div>
          {store.description && <p className={styles.modalDesc}>{store.description}</p>}
          <div className={styles.modalBtns}>
            <button className={styles.modalBtn} onClick={() => { navigate('/medicine'); onClose() }}>
              🛒 Sipariş Ver
            </button>
            <a
              className={styles.modalBtnOutline}
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${store.streetAddress}, ${store.city}`)}`}
              target="_blank"
              rel="noreferrer"
            >
              🗺️ Yol Tarifi
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function HomePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { nearest } = useSelector((state) => state.store)
  const [reviews, setReviews] = useState([])
  const [selectedStore, setSelectedStore] = useState(null)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [locationStatus, setLocationStatus] = useState('idle') // idle | asking | granted | denied

  useEffect(() => {
    api.get('/customer-reviews').then(res => setReviews(res.data)).catch(() => {})

    if (!navigator.geolocation) {
      dispatch(fetchNearestStores())
      return
    }
    setLocationStatus('asking')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationStatus('granted')
        dispatch(fetchNearestStores({ lat: pos.coords.latitude, lng: pos.coords.longitude }))
      },
      () => {
        setLocationStatus('denied')
        dispatch(fetchNearestStores())
      },
      { timeout: 8000 }
    )
  }, [dispatch])

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <span className={styles.heroBadge}>✦ Türkiye'nin Online Eczane Platformu</span>
            <h1 className={styles.heroTitle}>
              Tüm Eczaneler<br />
              <span className={styles.heroAccent}>Artık Online'da</span>
            </h1>
            <p className={styles.heroText}>
              Çevrenizdeki eczaneleri keşfedin, ilaçlarınızı online sipariş verin,
              eczaneden teslim alın ya da kapınıza getirtin.
              Hızlı, güvenli, her zaman yanınızda.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/medicine" className={styles.heroBtnPrimary}>Eczane Bul</Link>
              <Link to="/medicine-store" className={styles.heroBtnSecondary}>Tüm Eczaneler</Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}><strong>1.200+</strong><span>Kayıtlı Eczane</span></div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}><strong>48.000+</strong><span>Mutlu Müşteri</span></div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}><strong>15 dk</strong><span>Ortalama Teslimat</span></div>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImgGrid}>
              <img src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&q=80" alt="pharmacy" className={`${styles.heroImg} ${styles.heroImgLarge}`} />
              <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80" alt="medicine" className={styles.heroImg} />
              <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80" alt="hospital" className={styles.heroImg} />
            </div>
          </div>
        </div>
      </section>

      {/* ── NASIL ÇALIŞIR ── */}
      <section className={styles.howSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Nasıl Çalışır?</h2>
            <p className={styles.sectionSub}>3 adımda ilacınız elinizde</p>
          </div>
          <div className={styles.stepsGrid}>
            {[
              { step: '01', icon: '🔍', title: 'Eczane Bul', desc: 'Konumuna göre çevrenizdeki eczaneleri listele, stok ve çalışma saatlerini gör.' },
              { step: '02', icon: '🛒', title: 'Online Sipariş Ver', desc: 'İstediğin ilacı seç, sepete ekle. Reçeteli ürünler için fotoğraf yükle.' },
              { step: '03', icon: '📦', title: 'Teslim Al', desc: 'Eczaneden gel al ya da hızlı teslimat seçeneğiyle kapına getirt.' },
            ].map(s => (
              <div key={s.step} className={styles.stepCard}>
                <span className={styles.stepNumber}>{s.step}</span>
                <div className={styles.stepIcon}>{s.icon}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YAKINDAKI ECZANELER ── */}
      <section className={styles.storesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Yakınındaki Eczaneler</h2>
            <p className={styles.sectionSub}>
              {locationStatus === 'granted' ? '📍 Konumuna göre sıralandı' :
               locationStatus === 'denied'  ? 'Konum izni verilmedi, rastgele listeleniyor' :
               locationStatus === 'asking'  ? 'Konumun alınıyor...' :
               'Konumuna en yakın açık eczaneler'}
            </p>
          </div>
          <div className={styles.storeGrid}>
            {nearest.length === 0 ? (
              <p className={styles.empty}>Eczane bulunamadı</p>
            ) : nearest.map((store, idx) => (
              <div key={store._id} className={styles.storeCard} onClick={() => { setSelectedStore(store); setSelectedIdx(idx) }}>
                <div className={styles.storeCardTop}>
                  <h3 className={styles.storeName}>{store.shopName}</h3>
                  <span className={`${styles.storeStatus} ${store.isOpen !== false ? styles.open : styles.closed}`}>
                    {store.isOpen !== false ? 'AÇIK' : 'KAPALI'}
                  </span>
                </div>
                <p className={styles.storeAddress}>📍 {store.streetAddress}, {store.city}</p>
                <p className={styles.storePhone}>📞 {store.phone}</p>
                <div className={styles.storeActions}>
                  <button className={styles.storeBtn}>Detayları Gör →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ECZANE SAHİPLERİ ── */}
      <section className={styles.ownerSection}>
        <div className={styles.container}>
          <div className={styles.ownerGrid}>
            <div className={styles.ownerImgCol}>
              <img src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80" alt="pharmacist" className={styles.ownerImg} />
              <div className={styles.ownerImgBadge}>
                <span className={styles.ownerBadgeIcon}>🚀</span>
                <div>
                  <strong>Hızlı Kurulum</strong>
                  <span>10 dakikada yayına girin</span>
                </div>
              </div>
            </div>
            <div className={styles.ownerContent}>
              <span className={styles.ownerTag}>Eczane Sahipleri İçin</span>
              <h2 className={styles.ownerTitle}>Eczanenizi<br />Online'a Taşıyın</h2>
              <p className={styles.ownerDesc}>
                Binlerce müşteriye ulaşın. Eczanenizi platformumuza ekleyin, online sipariş alın,
                stoklarınızı yönetin ve satışlarınızı artırın. Fiziksel eczanenizin yanı sıra
                dijital mağazanızla 7/24 açık olun.
              </p>
              <div className={styles.ownerFeatures}>
                {[
                  { icon: '📋', text: 'Online sipariş alın, reçete yönetimi yapın' },
                  { icon: '🏪', text: 'Mağaza profili oluşturun, ürün kataloğu ekleyin' },
                  { icon: '📊', text: 'Satış raporları ve müşteri analizleri görün' },
                  { icon: '📦', text: 'Stok takibi ve düşük stok uyarıları' },
                  { icon: '💬', text: 'Müşterilerle mesajlaşın, destek sağlayın' },
                ].map((f, i) => (
                  <div key={i} className={styles.ownerFeature}>
                    <span className={styles.ownerFeatureIcon}>{f.icon}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className={styles.ownerBtn}>Eczanemi Ekle →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ÜYELİK MODELİ ── */}
      <section className={styles.plansSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader} style={{ textAlign: 'center' }}>
            <h2 className={styles.sectionTitle}>Üyelik Planları</h2>
            <p className={styles.sectionSub}>Eczanenizin büyüklüğüne göre en uygun planı seçin</p>
          </div>
          <div className={styles.plansGrid}>

            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <span className={styles.planIcon}>🌱</span>
                <h3 className={styles.planName}>Başlangıç</h3>
                <div className={styles.planPrice}><span className={styles.planAmount}>Ücretsiz</span></div>
                <p className={styles.planNote}>Sonsuza kadar ücretsiz</p>
              </div>
              <ul className={styles.planFeatures}>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> Eczane profili oluşturma</li>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> 50 ürüne kadar katalog</li>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> Aylık 100 sipariş</li>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> Temel raporlama</li>
                <li className={`${styles.planFeature} ${styles.planFeatureOff}`}><span className={styles.cross}>✗</span> Öncelikli listeleme</li>
                <li className={`${styles.planFeature} ${styles.planFeatureOff}`}><span className={styles.cross}>✗</span> Müşteri mesajlaşma</li>
              </ul>
              <Link to="/register" className={styles.planBtn}>Ücretsiz Başla</Link>
            </div>

            <div className={`${styles.planCard} ${styles.planCardPopular}`}>
              <div className={styles.planPopularBadge}>En Popüler</div>
              <div className={styles.planHeader}>
                <span className={styles.planIcon}>⚡</span>
                <h3 className={styles.planName}>Standart</h3>
                <div className={styles.planPrice}>
                  <span className={styles.planAmount}>₺799</span>
                  <span className={styles.planPer}>/ay</span>
                </div>
                <p className={styles.planNote}>Yıllık ödemede %20 indirim</p>
              </div>
              <ul className={styles.planFeatures}>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> Sınırsız ürün kataloğu</li>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> Sınırsız sipariş</li>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> Gelişmiş raporlama</li>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> Öncelikli arama sıralaması</li>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> Müşteri mesajlaşma</li>
                <li className={`${styles.planFeature} ${styles.planFeatureOff}`}><span className={styles.cross}>✗</span> Özel kampanya yönetimi</li>
              </ul>
              <Link to="/register" className={`${styles.planBtn} ${styles.planBtnPrimary}`}>Hemen Başla</Link>
            </div>

            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <span className={styles.planIcon}>👑</span>
                <h3 className={styles.planName}>Premium</h3>
                <div className={styles.planPrice}>
                  <span className={styles.planAmount}>₺1.499</span>
                  <span className={styles.planPer}>/ay</span>
                </div>
                <p className={styles.planNote}>Yıllık ödemede %25 indirim</p>
              </div>
              <ul className={styles.planFeatures}>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> Standart'taki her şey</li>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> Ana sayfada öne çıkma</li>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> Özel kampanya yönetimi</li>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> Çoklu şube desteği</li>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> API entegrasyonu</li>
                <li className={styles.planFeature}><span className={styles.check}>✓</span> 7/24 öncelikli destek</li>
              </ul>
              <Link to="/register" className={styles.planBtn}>Başla</Link>
            </div>

          </div>
          <p className={styles.plansFooNote}>
            Tüm planlarda ilk 30 gün ücretsiz deneme • Kredi kartı gerekmez • İstediğiniz zaman iptal edin
          </p>
        </div>
      </section>

      {/* ── YORUMLAR ── */}
      <section className={styles.reviewsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Müşteri Yorumları</h2>
            <p className={styles.sectionSub}>Kullanıcılarımızın deneyimlerini okuyun</p>
          </div>
          <div className={styles.reviewGrid}>
            {reviews.map((r, i) => (
              <div key={i} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  {r.photo
                    ? <img src={r.photo} alt={r.userName} className={styles.reviewAvatarImg} />
                    : <div className={styles.reviewAvatar}>{r.userName?.[0]?.toUpperCase()}</div>
                  }
                  <div>
                    <p className={styles.reviewName}>{r.userName}</p>
                    <StarRating rating={r.rating} />
                  </div>
                </div>
                <p className={styles.reviewText}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StoreModal store={selectedStore} idx={selectedIdx} onClose={() => setSelectedStore(null)} navigate={navigate} />
    </div>
  )
}

export default HomePage
