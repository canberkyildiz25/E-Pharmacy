import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAllStores } from '../../../store/slices/storeSlice'
import styles from './MedicineStorePage.module.css'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1400&q=80',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1400&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&q=80',
]

const RECOVERY_STORIES = [
  {
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
    name: 'Ayşe K.',
    quote: 'İlaçlarımı zamanında aldım, 3 günde iyileştim. Hızlı teslimat harikaydı!',
    rating: 5,
  },
  {
    img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80',
    name: 'Mehmet D.',
    quote: 'Kronik ilaçlarımı düzenli alabiliyorum. Stok asla bitmiyor, çok memnunum.',
    rating: 5,
  },
  {
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
    name: 'Dr. Fatma Y.',
    quote: 'Hastalarıma güvenle tavsiye ediyorum. Orijinal ve kaliteli ürünler.',
    rating: 5,
  },
]

const PHARMACY_IMAGES = [
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=70',
  'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&q=70',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=70',
  'https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&q=70',
  'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&q=70',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=70',
  'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=70',
  'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&q=70',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=70',
  'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&q=70',
]

const MEDICINE_SHOWCASE = [
  { img: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&q=80', label: 'Vitamin & Takviye' },
  { img: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&q=80', label: 'Reçeteli İlaçlar' },
  { img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80', label: 'Ağrı Kesiciler' },
  { img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&q=80', label: 'Cilt Bakımı' },
]

const STATS = [
  { value: '50+', label: 'Aktif Eczane' },
  { value: '10K+', label: 'Mutlu Müşteri' },
  { value: '5K+', label: 'İlaç Çeşidi' },
  { value: '24/7', label: 'Destek' },
]

function StarRating({ rating = 4 }) {
  return (
    <span className={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? styles.starFull : styles.starEmpty}>★</span>
      ))}
    </span>
  )
}

function MedicineStorePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { all, loading } = useSelector((state) => state.store)
  const [search, setSearch] = useState('')
  const [heroIdx, setHeroIdx] = useState(0)

  useEffect(() => {
    dispatch(fetchAllStores())
  }, [dispatch])

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 4000)
    return () => clearInterval(t)
  }, [])

  const filtered = all.filter(s =>
    s.shopName.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        {HERO_IMAGES.map((src, i) => (
          <img key={i} src={src} alt="" className={`${styles.heroBg} ${i === heroIdx ? styles.heroBgActive : ''}`} />
        ))}
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>✦ Türkiye'nin E-Eczane Platformu</span>
          <h1 className={styles.heroTitle}>Sağlığınız İçin<br /><span className={styles.heroAccent}>En İyi Eczaneler</span></h1>
          <p className={styles.heroSub}>Güvenilir eczanelerden orijinal ilaçları kapınıza kadar getiriyoruz.</p>
          <div className={styles.heroSearch}>
            <span className={styles.heroSearchIcon}>🔍</span>
            <input
              className={styles.heroSearchInput}
              placeholder="Eczane veya şehir ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.heroDots}>
          {HERO_IMAGES.map((_, i) => (
            <button key={i} className={`${styles.heroDot} ${i === heroIdx ? styles.heroDotActive : ''}`} onClick={() => setHeroIdx(i)} />
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className={styles.statsBar}>
        {STATS.map((s, i) => (
          <div key={i} className={styles.statItem}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── MEDICINE SHOWCASE ── */}
      <section className={styles.showcaseSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Ürün Kategorileri</h2>
            <p className={styles.sectionSub}>Binlerce çeşit ilaç ve sağlık ürünü tek platformda</p>
          </div>
          <div className={styles.showcaseGrid}>
            {MEDICINE_SHOWCASE.map((item, i) => (
              <div key={i} className={styles.showcaseCard}>
                <img src={item.img} alt={item.label} className={styles.showcaseImg} />
                <div className={styles.showcaseLabel}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORES ── */}
      <section className={styles.storesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Eczanelerimiz</h2>
            <p className={styles.sectionSub}>{filtered.length} eczane listeleniyor</p>
          </div>
          {loading ? (
            <div className={styles.loadingGrid}>
              {[1,2,3,4,5,6].map(i => <div key={i} className={styles.skeletonCard} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🏪</span>
              <p>Eczane bulunamadı</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((store, idx) => (
                <div key={store._id} className={styles.card}>
                  <div className={styles.cardImgWrap}>
                    <img
                      src={store.coverImage || PHARMACY_IMAGES[idx % PHARMACY_IMAGES.length]}
                      alt={store.shopName}
                      className={styles.cardImg}
                    />
                    <span className={`${styles.statusBadge} ${store.isOpen !== false ? styles.open : styles.closed}`}>
                      {store.isOpen !== false ? '● AÇIK' : '● KAPALI'}
                    </span>
                    {store.hasOwnDelivery && (
                      <span className={styles.deliveryBadge}>🚚 Kendi Teslimatı</span>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <div className={styles.logoBox}>
                        {store.logo
                          ? <img src={`http://localhost:5001${store.logo}`} alt={store.shopName} className={styles.logo} onError={e => { e.target.style.display = 'none' }} />
                          : <span className={styles.logoPlaceholder}>💊</span>
                        }
                      </div>
                      <div>
                        <h3 className={styles.storeName}>{store.shopName}</h3>
                        <StarRating rating={store.rating || 4} />
                      </div>
                    </div>
                    <div className={styles.storeDetails}>
                      <p className={styles.storeInfo}><span className={styles.infoIcon}>📍</span>{store.streetAddress}, {store.city}</p>
                      <p className={styles.storeInfo}><span className={styles.infoIcon}>📞</span>{store.phone}</p>
                      {store.email && <p className={styles.storeInfo}><span className={styles.infoIcon}>✉️</span>{store.email}</p>}
                    </div>
                    <button className={styles.visitBtn} onClick={() => navigate('/medicine')}>
                      Mağazayı Ziyaret Et →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── RECOVERY STORIES ── */}
      <section className={styles.storiesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>İyileşen Müşterilerimiz</h2>
            <p className={styles.sectionSub}>Binlerce kişi sağlığına kavuştu</p>
          </div>
          <div className={styles.storiesGrid}>
            {RECOVERY_STORIES.map((s, i) => (
              <div key={i} className={styles.storyCard}>
                <div className={styles.storyImgWrap}>
                  <img src={s.img} alt={s.name} className={styles.storyImg} />
                  <div className={styles.storyImgOverlay} />
                </div>
                <div className={styles.storyBody}>
                  <div className={styles.storyQuoteIcon}>"</div>
                  <p className={styles.storyQuote}>{s.quote}</p>
                  <div className={styles.storyFooter}>
                    <span className={styles.storyName}>{s.name}</span>
                    <StarRating rating={s.rating} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER ── */}
      <section className={styles.bannerSection}>
        <div className={styles.bannerInner}>
          <div className={styles.bannerText}>
            <h2 className={styles.bannerTitle}>Sağlıklı Bir Yaşam İçin<br />Her Zaman Yanınızdayız</h2>
            <p className={styles.bannerSub}>Reçeteli ve reçetesiz ilaçlar, vitamin ve takviyeler — hepsi bir tıklama uzağınızda.</p>
            <button className={styles.bannerBtn} onClick={() => navigate('/medicine')}>İlaçlara Göz At</button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&q=80"
            alt="pharmacy"
            className={styles.bannerImg}
          />
        </div>
      </section>

    </div>
  )
}

export default MedicineStorePage
