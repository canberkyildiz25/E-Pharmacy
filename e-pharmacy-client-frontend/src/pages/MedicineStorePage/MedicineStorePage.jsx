import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAllStores } from '../../store/slices/storeSlice'
import styles from './MedicineStorePage.module.css'

function StarRating({ rating = 4 }) {
  return (
    <span className={styles.stars}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? styles.starFull : styles.starEmpty}>★</span>
      ))}
    </span>
  )
}

function MedicineStorePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { all, loading } = useSelector((state) => state.store)

  useEffect(() => {
    dispatch(fetchAllStores())
  }, [dispatch])

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Medicine store</h1>
        {loading ? (
          <p className={styles.state}>Loading stores...</p>
        ) : all.length === 0 ? (
          <p className={styles.state}>No stores found</p>
        ) : (
          <div className={styles.grid}>
            {all.map(store => (
              <div key={store._id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.logoBox}>
                    {store.logo
                      ? <img src={`http://localhost:5001${store.logo}`} alt={store.shopName} className={styles.logo} onError={e => { e.target.style.display='none' }} />
                      : <span className={styles.logoPlaceholder}>🏪</span>
                    }
                  </div>
                  <div className={styles.statusBox}>
                    <span className={`${styles.status} ${store.isOpen !== false ? styles.open : styles.closed}`}>
                      {store.isOpen !== false ? 'OPEN' : 'CLOSE'}
                    </span>
                    <StarRating rating={store.rating || 4} />
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.storeName}>{store.shopName}</h2>
                  <p className={styles.storeInfo}>📍 {store.streetAddress}, {store.city}</p>
                  <p className={styles.storeInfo}>📞 {store.phone}</p>
                  {store.email && <p className={styles.storeInfo}>✉️ {store.email}</p>}
                </div>
                <button className={styles.visitBtn} onClick={() => navigate('/medicine')}>Visit Store</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MedicineStorePage
