import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMedicineDetail } from '../../../store/slices/clientMedicineSlice'
import { updateCart } from '../../../store/slices/cartSlice'
import { toast } from 'react-hot-toast'
import AuthModal from '../../../components/client/modals/AuthModal'
import styles from './ProductPage.module.css'

const REVIEWS_PER_PAGE = 5

function StarRating({ rating = 5, size = 16 }) {
  return (
    <span className={styles.stars} style={{ fontSize: size }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= rating ? '#f6ad55' : '#e0e0e0' }}>★</span>)}
    </span>
  )
}

function ProductPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { detail, loading } = useSelector((state) => state.clientMedicine)
  const { token } = useSelector((state) => state.auth)
  const [tab, setTab] = useState('description')
  const [quantity, setQuantity] = useState(1)
  const [authModal, setAuthModal] = useState(false)
  const [reviewPage, setReviewPage] = useState(1)

  useEffect(() => {
    if (id) dispatch(fetchMedicineDetail(id))
  }, [id, dispatch])

  const handleAddToCart = async () => {
    if (!token) { setAuthModal(true); return }
    const result = await dispatch(updateCart({ productId: detail._id, name: detail.name, price: detail.price, photo: detail.photo, quantity }))
    if (updateCart.fulfilled.match(result)) toast.success(`${quantity}x ${detail.name} sepete eklendi!`)
    else toast.error('Eklenemedi')
  }

  if (loading) return <div className={styles.center}><p>Yükleniyor...</p></div>
  if (!detail) return <div className={styles.center}><p>Ürün bulunamadı.</p></div>

  const photoUrl = detail.photo ? (detail.photo.startsWith('http') ? detail.photo : `http://localhost:5001${detail.photo}`) : null
  const reviews = detail.reviews || []
  const totalReviewPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE)
  const visibleReviews = reviews.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE)
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← İlaçlara Geri Dön</button>

        {/* Product Overview */}
        <div className={styles.overview}>
          <div className={styles.imageBox}>
            {photoUrl ? <img src={photoUrl} alt={detail.name} className={styles.image} /> : <span className={styles.imagePlaceholder}>💊</span>}
          </div>
          <div className={styles.info}>
            <span className={styles.badge}>{detail.category}</span>
            <h1 className={styles.name}>{detail.name}</h1>
            {detail.shop?.shopName && <p className={styles.brand}>🏪 {detail.shop.shopName}</p>}
            <p className={styles.price}>${detail.price}</p>
            {avgRating && (
              <div className={styles.ratingRow}>
                <StarRating rating={Math.round(avgRating)} />
                <span className={styles.ratingText}>{avgRating} ({reviews.length} yorum)</span>
              </div>
            )}
            <div className={styles.quantityRow}>
              <button className={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span className={styles.qty}>{quantity}</span>
              <button className={styles.qtyBtn} onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            <button className={styles.addBtn} onClick={handleAddToCart}>Sepete Ekle</button>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'description' ? styles.activeTab : ''}`} onClick={() => setTab('description')}>Açıklama</button>
          <button className={`${styles.tab} ${tab === 'reviews' ? styles.activeTab : ''}`} onClick={() => setTab('reviews')}>
            Yorumlar {reviews.length > 0 && <span className={styles.reviewCount}>{reviews.length}</span>}
          </button>
        </div>

        {tab === 'description' ? (
          <div className={styles.tabContent}>
            {detail.description ? <p className={styles.desc}>{detail.description}</p> : <p className={styles.empty}>Açıklama mevcut değil.</p>}
            {detail.warnings && (
              <div className={styles.warnings}>
                <h3 className={styles.warningTitle}>⚠️ Uyarılar</h3>
                <p className={styles.desc}>{detail.warnings}</p>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.tabContent}>
            {visibleReviews.length === 0 ? (
              <p className={styles.empty}>Henüz yorum yok.</p>
            ) : (
              <>
                <div className={styles.reviewList}>
                  {visibleReviews.map((r, i) => (
                    <div key={i} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewAvatar}>{r.userName?.[0]?.toUpperCase() || '?'}</div>
                        <div className={styles.reviewMeta}>
                          <p className={styles.reviewUser}>{r.userName}</p>
                          <p className={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString('tr-TR')}</p>
                        </div>
                        <StarRating rating={r.rating} />
                      </div>
                      <p className={styles.reviewText}>{r.text}</p>
                    </div>
                  ))}
                </div>
                {totalReviewPages > 1 && (
                  <div className={styles.pagination}>
                    <button className={styles.pageBtn} onClick={() => setReviewPage(p => Math.max(1, p - 1))} disabled={reviewPage === 1}>&#8249;</button>
                    {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`${styles.pageBtn} ${p === reviewPage ? styles.activePage : ''}`} onClick={() => setReviewPage(p)}>{p}</button>
                    ))}
                    <button className={styles.pageBtn} onClick={() => setReviewPage(p => Math.min(totalReviewPages, p + 1))} disabled={reviewPage === totalReviewPages}>&#8250;</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {authModal && <AuthModal onClose={() => setAuthModal(false)} />}
    </div>
  )
}

export default ProductPage
