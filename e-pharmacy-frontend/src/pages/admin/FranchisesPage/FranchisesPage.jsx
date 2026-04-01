import { useEffect, useState } from 'react'
import api from '../../../services/api'
import styles from './FranchisesPage.module.css'

function FranchisesPage() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/franchises')
      .then(res => setShops(res.data))
      .catch(() => setShops([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = shops.filter(s =>
    s.shopName?.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase()) ||
    s.owner?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>Franchises</h1>
        <input
          className={styles.search}
          placeholder="Search by name, city or owner..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className={styles.state}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p className={styles.state}>No franchises found</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map(shop => (
            <div key={shop._id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.logoBox}>
                  {shop.logo
                    ? <img src={`http://localhost:5001${shop.logo}`} alt={shop.shopName} className={styles.logo} />
                    : <span className={styles.logoPlaceholder}>🏪</span>
                  }
                </div>
                <div className={styles.badge}>{shop.hasOwnDelivery ? 'Own Delivery' : 'No Delivery'}</div>
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.shopName}>{shop.shopName}</h2>
                <p className={styles.meta}>👤 {shop.ownerName}</p>
                <p className={styles.meta}>📍 {shop.streetAddress}, {shop.city} {shop.zipCode}</p>
                <p className={styles.meta}>📧 {shop.email}</p>
                <p className={styles.meta}>📞 {shop.phone}</p>
              </div>
              {shop.owner && (
                <div className={styles.cardFooter}>
                  <span className={styles.ownerTag}>Account: {shop.owner.email}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FranchisesPage
