import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMedicineDetail } from '../../../store/slices/franchiseMedicineSlice'
import { fetchUserInfo } from '../../../store/slices/authSlice'
import styles from './MedicinePage.module.css'

function MedicinePage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { detail, loading } = useSelector(state => state.medicine)

  useEffect(() => {
    if (!user) dispatch(fetchUserInfo())
  }, [dispatch, user])

  useEffect(() => {
    if (user?.shopId && id) {
      dispatch(fetchMedicineDetail({ shopId: user.shopId, productId: id }))
    }
  }, [user, id, dispatch])

  if (loading) return <div className={styles.center}><p>Loading...</p></div>
  if (!detail) return <div className={styles.center}><p>Medicine not found.</p></div>

  const photoUrl = detail.photo
    ? (detail.photo.startsWith('http') ? detail.photo : `http://localhost:5001${detail.photo}`)
    : null

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <div className={styles.card}>
          <div className={styles.imageBox}>
            {photoUrl
              ? <img src={photoUrl} alt={detail.name} className={styles.image} />
              : <span className={styles.imagePlaceholder}>💊</span>
            }
          </div>
          <div className={styles.info}>
            <div className={styles.badge}>{detail.category}</div>
            <h1 className={styles.name}>{detail.name}</h1>
            <p className={styles.price}>${detail.price}</p>
            {detail.description && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <p className={styles.sectionText}>{detail.description}</p>
              </div>
            )}
            {detail.warnings && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>⚠️ Warnings</h3>
                <p className={styles.sectionText}>{detail.warnings}</p>
              </div>
            )}
            {detail.shop?.shopName && (
              <div className={styles.shopTag}>
                🏪 {detail.shop.shopName}
              </div>
            )}
          </div>
        </div>

        {detail.reviews?.length > 0 && (
          <div className={styles.reviews}>
            <h2 className={styles.reviewsTitle}>Reviews ({detail.reviews.length})</h2>
            <div className={styles.reviewList}>
              {detail.reviews.map((r, i) => (
                <div key={i} className={styles.review}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewUser}>{r.userName}</span>
                    <span className={styles.reviewRating}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <p className={styles.reviewText}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MedicinePage
