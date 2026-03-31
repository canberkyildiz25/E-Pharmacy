import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchMedicines } from '../../store/slices/medicineSlice'
import { updateCart } from '../../store/slices/cartSlice'
import { toast } from 'react-hot-toast'
import AuthModal from '../../components/modals/AuthModal'
import styles from './MedicinePage.module.css'

function MedicinePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { list, categories, pagination, loading } = useSelector((state) => state.medicine)
  const { token } = useSelector((state) => state.auth)
  const [searchName, setSearchName] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [page, setPage] = useState(1)
  const [authModal, setAuthModal] = useState(false)

  useEffect(() => {
    dispatch(fetchMedicines({ page: 1 }))
  }, [dispatch])

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
    if (updateCart.fulfilled.match(result)) toast.success('Added to cart!')
    else toast.error('Failed to add')
  }

  const photoUrl = (photo) => photo ? (photo.startsWith('http') ? photo : `http://localhost:5001${photo}`) : null

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Medicine</h1>

        <div className={styles.filterBar}>
          <select className={styles.select} value={searchCategory} onChange={e => setSearchCategory(e.target.value)}>
            <option value="">Product category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className={styles.searchInput} placeholder="Search medicine" value={searchName} onChange={e => setSearchName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleFilter()} />
          <button className={styles.filterBtn} onClick={handleFilter}>Filter</button>
        </div>

        {loading ? (
          <p className={styles.state}>Loading...</p>
        ) : list.length === 0 ? (
          <p className={styles.state}>Nothing was found for your request</p>
        ) : (
          <div className={styles.grid}>
            {list.map(med => (
              <div key={med._id} className={styles.card}>
                <div className={styles.cardImg}>
                  {photoUrl(med.photo) ? <img src={photoUrl(med.photo)} alt={med.name} onError={e => { e.target.style.display='none' }} /> : <span>💊</span>}
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.medName}>{med.name}</h3>
                  <p className={styles.medPrice}>${med.price}</p>
                  <div className={styles.cardActions}>
                    <button className={styles.addBtn} onClick={() => handleAddToCart(med)}>Add to cart</button>
                    <button className={styles.detailBtn} onClick={() => navigate(`/product/${med._id}`)}>Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.pageBtn} onClick={() => handlePageChange(page - 1)} disabled={page === 1}>&#8249;</button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`${styles.pageBtn} ${p === page ? styles.activePage : ''}`} onClick={() => handlePageChange(p)}>{p}</button>
            ))}
            <button className={styles.pageBtn} onClick={() => handlePageChange(page + 1)} disabled={page === pagination.totalPages}>&#8250;</button>
          </div>
        )}
      </div>

      {authModal && <AuthModal onClose={() => setAuthModal(false)} />}
    </div>
  )
}

export default MedicinePage
