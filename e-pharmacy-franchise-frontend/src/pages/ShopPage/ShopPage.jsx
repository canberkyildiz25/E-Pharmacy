import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchShop, fetchMedicines, addMedicine, editMedicine, deleteMedicine } from '../../store/slices/shopSlice'
import { fetchUserInfo } from '../../store/slices/authSlice'
import { toast } from 'react-hot-toast'
import AddMedicineModal from '../../components/modals/AddMedicineModal'
import EditMedicineModal from '../../components/modals/EditMedicineModal'
import DeleteMedicineModal from '../../components/modals/DeleteMedicineModal'
import styles from './ShopPage.module.css'

function ShopPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { shop, medicines, categories, pagination, loading } = useSelector((state) => state.shop)
  const [activeTab, setActiveTab] = useState('drugstore')
  const [searchName, setSearchName] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [page, setPage] = useState(1)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)

  useEffect(() => {
    if (!user) dispatch(fetchUserInfo())
  }, [dispatch, user])

  useEffect(() => {
    if (user?.shopId) {
      dispatch(fetchShop(user.shopId))
      dispatch(fetchMedicines({ shopId: user.shopId, params: { page: 1 } }))
    }
  }, [user, dispatch])

  const handleFilter = () => {
    if (!user?.shopId) return
    setPage(1)
    dispatch(fetchMedicines({ shopId: user.shopId, params: { name: searchName, category: searchCategory, page: 1 } }))
  }

  const handlePageChange = (p) => {
    setPage(p)
    dispatch(fetchMedicines({ shopId: user.shopId, params: { name: searchName, category: searchCategory, page: p } }))
  }

  const handleAddMedicine = async (formData) => {
    const result = await dispatch(addMedicine({ shopId: user.shopId, formData }))
    if (addMedicine.fulfilled.match(result)) { toast.success('Medicine added!'); setAddModal(false) }
    else toast.error(result.payload || 'Failed')
  }

  const handleEditMedicine = async (formData) => {
    const result = await dispatch(editMedicine({ shopId: user.shopId, productId: editModal._id, formData }))
    if (editMedicine.fulfilled.match(result)) { toast.success('Medicine updated!'); setEditModal(null) }
    else toast.error(result.payload || 'Failed')
  }

  const handleDeleteMedicine = async () => {
    const result = await dispatch(deleteMedicine({ shopId: user.shopId, productId: deleteModal._id }))
    if (deleteMedicine.fulfilled.match(result)) { toast.success('Medicine deleted!'); setDeleteModal(null) }
    else toast.error(result.payload || 'Failed')
  }

  const myMedicines = medicines.filter(m => m.shop === user?.shopId || m.shop?._id === user?.shopId)

  if (!user?.shopId) {
    return (
      <div className={styles.noShop}>
        <span className={styles.noShopIcon}>🏪</span>
        <h2>You don&apos;t have a shop yet</h2>
        <p>Create your pharmacy shop to get started</p>
        <button className={styles.createBtn} onClick={() => navigate('/create-shop')}>Create Shop</button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Shop Header */}
        <div className={styles.shopHeader}>
          <div className={styles.shopInfo}>
            {shop?.logo && <img src={`http://localhost:5001${shop.logo}`} alt="logo" className={styles.shopLogo} />}
            <div>
              <h1 className={styles.shopName}>{shop?.shopName || 'My Shop'}</h1>
              <p className={styles.shopMeta}>Owner: {shop?.ownerName} · {shop?.streetAddress}, {shop?.city} · {shop?.phone}</p>
            </div>
          </div>
          <div className={styles.shopActions}>
            <button className={styles.editBtn} onClick={() => navigate('/edit-shop')}>Edit data</button>
            <button className={styles.addBtn} onClick={() => setAddModal(true)}>+ Add medicine</button>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'drugstore' ? styles.activeTab : ''}`} onClick={() => setActiveTab('drugstore')}>Drug store</button>
          <button className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`} onClick={() => setActiveTab('all')}>All medicine</button>
        </div>

        {/* All Medicine Tab - Filter */}
        {activeTab === 'all' && (
          <div className={styles.filterBar}>
            <select className={styles.select} value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
              <option value="">Product category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input className={styles.searchInput} placeholder="Search medicine" value={searchName} onChange={(e) => setSearchName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleFilter()} />
            <button className={styles.filterBtn} onClick={handleFilter}>Filter</button>
          </div>
        )}

        {/* Medicine Grid */}
        <div className={styles.grid}>
          {loading ? (
            <p className={styles.loading}>Loading...</p>
          ) : (activeTab === 'drugstore' ? myMedicines : medicines).length === 0 ? (
            <p className={styles.empty}>No medicines found</p>
          ) : (activeTab === 'drugstore' ? myMedicines : medicines).map(med => (
            <div key={med._id} className={styles.card}>
              <div className={styles.cardImg}>
                {med.photo ? <img src={med.photo.startsWith('http') ? med.photo : `http://localhost:5001${med.photo}`} alt={med.name} onError={e => { e.target.style.display='none' }} /> : <span>💊</span>}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.medName}>{med.name}</h3>
                <p className={styles.medPrice}>${med.price}</p>
                <div className={styles.cardActions}>
                  {activeTab === 'all' ? (
                    <>
                      <button className={styles.addToShopBtn} onClick={() => toast.success('Added to shop!')}>Add to shop</button>
                      <button className={styles.detailsBtn} onClick={() => navigate(`/medicine/${med._id}`)}>Details</button>
                    </>
                  ) : (
                    <>
                      <button className={styles.cardEditBtn} onClick={() => setEditModal(med)}>Edit</button>
                      <button className={styles.cardDeleteBtn} onClick={() => setDeleteModal(med)}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination for All Medicine tab */}
        {activeTab === 'all' && pagination && pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.pageBtn} onClick={() => handlePageChange(page - 1)} disabled={page === 1}>&#8249;</button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`${styles.pageBtn} ${p === page ? styles.activePage : ''}`} onClick={() => handlePageChange(p)}>{p}</button>
            ))}
            <button className={styles.pageBtn} onClick={() => handlePageChange(page + 1)} disabled={page === pagination.totalPages}>&#8250;</button>
          </div>
        )}
      </div>

      {addModal && <AddMedicineModal onSubmit={handleAddMedicine} onClose={() => setAddModal(false)} />}
      {editModal && <EditMedicineModal medicine={editModal} onSubmit={handleEditMedicine} onClose={() => setEditModal(null)} />}
      {deleteModal && <DeleteMedicineModal medicine={deleteModal} onConfirm={handleDeleteMedicine} onClose={() => setDeleteModal(null)} />}
    </div>
  )
}

export default ShopPage
