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

function HomePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { nearest } = useSelector((state) => state.store)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    dispatch(fetchNearestStores())
    api.get('/customer-reviews').then(res => setReviews(res.data)).catch(() => {})
  }, [dispatch])

  return (
    <div className={styles.page}>
      {/* Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>İlacınız<br />kapınızda</h1>
          <p className={styles.heroText}>Tüm sağlık endişelerinize bizimle veda edin</p>
          <Link to="/medicine" className={styles.heroBtn}>Alışverişe Başla</Link>
        </div>
      </section>

      {/* Promo Banners */}
      <section className={styles.promoBanners}>
        <div className={styles.container}>
          <div className={styles.bannerGrid}>
            <div className={`${styles.banner} ${styles.bannerGreen}`}>
              <div>
                <p className={styles.bannerLabel}>Büyük İndirim</p>
                <p className={styles.bannerDiscount}>%70</p>
                <button className={styles.bannerBtn} onClick={() => navigate('/medicine?discount=70')}>Hemen Al</button>
              </div>
              <span className={styles.bannerIcon}>💊</span>
            </div>
            <div className={`${styles.banner} ${styles.bannerDark}`}>
              <div>
                <p className={styles.bannerLabel}>Güvenli Teslimat</p>
                <p className={styles.bannerDiscount}>%100</p>
                <button className={styles.bannerBtn} onClick={() => navigate('/medicine-store')}>Daha Fazla</button>
              </div>
              <span className={styles.bannerIcon}>🚚</span>
            </div>
            <div className={`${styles.banner} ${styles.bannerBlue}`}>
              <div>
                <p className={styles.bannerLabel}>İndirim</p>
                <p className={styles.bannerDiscount}>%35</p>
                <button className={styles.bannerBtn} onClick={() => navigate('/medicine?discount=35')}>Hemen Al</button>
              </div>
              <span className={styles.bannerIcon}>🏥</span>
            </div>
          </div>
        </div>
      </section>

      {/* Nearest Medicine Stores */}
      <section className={styles.storesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Yakınındaki Eczaneler</h2>
            <p className={styles.sectionSub}>İlaç ara, konumuna göre filtrele</p>
          </div>
          <div className={styles.storeGrid}>
            {nearest.length === 0 ? (
              <p className={styles.empty}>Eczane bulunamadı</p>
            ) : nearest.map(store => (
              <div key={store._id} className={styles.storeCard} onClick={() => navigate(`/medicine-store`)}>
                <div className={styles.storeCardTop}>
                  <h3 className={styles.storeName}>{store.shopName}</h3>
                  <span className={`${styles.storeStatus} ${store.isOpen !== false ? styles.open : styles.closed}`}>
                    {store.isOpen !== false ? 'AÇIK' : 'KAPALI'}
                  </span>
                </div>
                <p className={styles.storeAddress}>📍 {store.streetAddress}, {store.city}</p>
                <p className={styles.storePhone}>📞 {store.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add Pharmacy Promo */}
      <section className={styles.promoSection}>
        <div className={styles.container}>
          <div className={styles.promoGrid}>
            <div className={styles.promoText}>
              <h2 className={styles.promoTitle}>Yerel eczanenizi şimdi online'a taşıyın</h2>
              <p className={styles.promoDesc}>Online platformumuz aracılığıyla yerel eczanenizle bağlantı kurarak reçetelerinizi evden doldurmanın rahatlığının keyfini çıkarın.</p>
              <Link to="/medicine-store" className={styles.promoBtn}>İlaç Satın Al</Link>
            </div>
            <ul className={styles.featureList}>
              {[
                { icon: '📋', text: 'Online sipariş alın' },
                { icon: '🏪', text: 'Mağaza profilinizi oluşturun' },
                { icon: '⚙️', text: 'Mağazanızı yönetin' },
                { icon: '📈', text: 'Daha fazla sipariş alın' },
                { icon: '📦', text: 'Stok takibi yapın' },
              ].map((f, i) => (
                <li key={i} className={styles.featureItem}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Reviews */}
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
                  <div className={styles.reviewAvatar}>{r.userName?.[0]?.toUpperCase()}</div>
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
    </div>
  )
}

export default HomePage
