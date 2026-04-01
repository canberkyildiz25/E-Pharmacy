import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchMedicines } from '../../../store/slices/clientMedicineSlice'
import { updateCart } from '../../../store/slices/cartSlice'
import { toast } from 'react-hot-toast'
import AuthModal from '../../../components/client/modals/AuthModal'
import styles from './MedicinePage.module.css'

const CATEGORY_META = [
  { key: '',                     label: 'Tümü',          icon: '🏪', img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&q=70' },
  { key: 'Pain Relief',          label: 'Ağrı Kesici',   icon: '💊', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=70' },
  { key: 'Vitamins & Supplements', label: 'Vitamin',     icon: '🌿', img: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=200&q=70' },
  { key: 'Skin Care',            label: 'Cilt Bakımı',   icon: '🧴', img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=70' },
  { key: 'Dental Care',          label: 'Diş Bakımı',    icon: '🦷', img: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=200&q=70' },
  { key: 'Eye Care',             label: 'Göz Bakımı',    icon: '👁', img: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&q=70' },
  { key: 'Baby Care',            label: 'Bebek',         icon: '👶', img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=200&q=70' },
  { key: 'Antibiotics',          label: 'Antibiyotik',   icon: '🔬', img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200&q=70' },
]

function StarRating({ count = 4 }) {
  return (
    <span className={styles.stars}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= count ? styles.starFull : styles.starEmpty}>★</span>
      ))}
    </span>
  )
}

function MedicinePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { list, pagination, loading } = useSelector((state) => state.clientMedicine)
  const { token } = useSelector((state) => state.auth)
  const [searchName, setSearchName] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [page, setPage] = useState(1)
  const [authModal, setAuthModal] = useState(false)

  useEffect(() => {
    dispatch(fetchMedicines({ page: 1 }))
  }, [dispatch])

  const handleCategoryClick = (key) => {
    setSearchCategory(key)
    setPage(1)
    dispatch(fetchMedicines({ name: searchName, category: key, page: 1 }))
  }

  const handleFilter = () => {
    setPage(1)
    dispatch(fetchMedicines({ name: searchName, category: searchCategory, page: 1 }))
  }

  const handlePageChange = (p) => {
    setPage(p)
    dispatch(fetchMedicines({ name: searchName, category: searchCategory, page: p }))
  }

  const handleAddToCart = async (med) => {
    if (!token) { setAuthModal(true); return }
    const result = await dispatch(updateCart({ productId: med._id, name: med.name, price: med.price, photo: med.photo, quantity: 1 }))
    if (updateCart.fulfilled.match(result)) toast.success('Sepete eklendi!')
    else toast.error('Eklenemedi')
  }

  const photoUrl = (photo) => photo && photo.trim() ? (photo.startsWith('http') ? photo : `http://localhost:5000${photo}`) : null

  const avgRating = (reviews) => {
    if (!reviews?.length) return 4
    return Math.round(reviews.reduce((s, r) => s + (r.rating || 4), 0) / reviews.length)
  }

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>💊 Türkiye'nin E-Eczane Platformu</span>
          <h1 className={styles.heroTitle}>İlaç &amp; Sağlık Ürünleri</h1>
          <p className={styles.heroSub}>Güvenilir kaynaklardan orijinal ilaçlar, vitamin ve sağlık ürünleri</p>
          <div className={styles.heroSearch}>
            <span className={styles.heroSearchIcon}>🔍</span>
            <input
              className={styles.heroSearchInput}
              placeholder="İlaç veya ürün ara..."
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFilter()}
            />
            <button className={styles.heroSearchBtn} onClick={handleFilter}>Ara</button>
          </div>
        </div>
      </section>

      {/* ── CATEGORY PILLS ── */}
      <section className={styles.categorySection}>
        <div className={styles.container}>
          <div className={styles.categoryGrid}>
            {CATEGORY_META.map(cat => (
              <button
                key={cat.key}
                className={`${styles.catCard} ${searchCategory === cat.key ? styles.catCardActive : ''}`}
                onClick={() => handleCategoryClick(cat.key)}
              >
                <div className={styles.catImgWrap}>
                  <img src={cat.img} alt={cat.label} className={styles.catImg} />
                  <div className={styles.catImgOverlay} />
                  <span className={styles.catIcon}>{cat.icon}</span>
                </div>
                <span className={styles.catLabel}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              {searchCategory
                ? CATEGORY_META.find(c => c.key === searchCategory)?.label || searchCategory
                : 'Tüm Ürünler'}
            </h2>
            {pagination && <span className={styles.count}>{pagination.total || list.length} ürün</span>}
          </div>

          {loading ? (
            <div className={styles.grid}>
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={styles.skeleton} />)}
            </div>
          ) : list.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🔍</span>
              <p>Aramanıza uygun ürün bulunamadı</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {list.map(med => {
                const img = photoUrl(med.photo)
                const rating = avgRating(med.reviews)
                return (
                  <div key={med._id} className={styles.card}>
                    <div className={styles.cardImg} onClick={() => navigate(`/product/${med._id}`)}>
                      {img
                        ? <img src={img} alt={med.name} onError={e => { e.target.style.display='none'; e.target.parentNode.dataset.fallback='1' }} />
                        : <span className={styles.cardImgFallback}>💊</span>
                      }
                      <div className={styles.cardOverlay}>
                        <span className={styles.viewBtn}>Detay →</span>
                      </div>
                      {med.category && (
                        <span className={styles.catBadge}>
                          {CATEGORY_META.find(c => c.key === med.category)?.icon || '💊'} {med.category}
                        </span>
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.medName}>{med.name}</h3>
                      <div className={styles.ratingRow}>
                        <StarRating count={rating} />
                        <span className={styles.reviewCount}>({med.reviews?.length || 0})</span>
                      </div>
                      <p className={styles.medPrice}>{parseFloat(med.price).toFixed(2)} ₺</p>
                      <div className={styles.cardActions}>
                        <button className={styles.addBtn} onClick={() => handleAddToCart(med)}>
                          🛒 Sepete Ekle
                        </button>
                        <button className={styles.detailBtn} onClick={() => navigate(`/product/${med._id}`)}>
                          Detay
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button className={styles.pageBtn} onClick={() => handlePageChange(page - 1)} disabled={page === 1}>‹</button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`${styles.pageBtn} ${p === page ? styles.activePage : ''}`} onClick={() => handlePageChange(p)}>{p}</button>
              ))}
              <button className={styles.pageBtn} onClick={() => handlePageChange(page + 1)} disabled={page === pagination.totalPages}>›</button>
            </div>
          )}
        </div>
      </section>

      {/* ── INFO BANNER ── */}
      <section className={styles.infoBanner}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            {[
              { icon: '🚚', title: 'Hızlı Teslimat', desc: 'Siparişiniz aynı gün kapınızda' },
              { icon: '✅', title: 'Orijinal Ürün', desc: 'Tüm ürünler onaylı kaynaklardan' },
              { icon: '🔒', title: 'Güvenli Ödeme', desc: 'SSL şifrelemeli güvenli alışveriş' },
              { icon: '📞', title: '7/24 Destek', desc: 'Her zaman yanınızdayız' },
            ].map((item, i) => (
              <div key={i} className={styles.infoItem}>
                <span className={styles.infoIcon}>{item.icon}</span>
                <div>
                  <p className={styles.infoTitle}>{item.title}</p>
                  <p className={styles.infoDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {authModal && <AuthModal onClose={() => setAuthModal(false)} />}
    </div>
  )
}

export default MedicinePage
