import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchShop, fetchMedicines, addMedicine, editMedicine, deleteMedicine } from '../../../store/slices/shopSlice'
import { fetchUserInfo } from '../../../store/slices/authSlice'
import { toast } from 'react-hot-toast'
import AddMedicineModal from '../../../components/franchise/modals/AddMedicineModal'
import EditMedicineModal from '../../../components/franchise/modals/EditMedicineModal'
import DeleteMedicineModal from '../../../components/franchise/modals/DeleteMedicineModal'
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
    if (addMedicine.fulfilled.match(result)) { toast.success('İlaç eklendi!'); setAddModal(false) }
    else toast.error(result.payload || 'Hata oluştu')
  }

  const handleEditMedicine = async (formData) => {
    const result = await dispatch(editMedicine({ shopId: user.shopId, productId: editModal._id, formData }))
    if (editMedicine.fulfilled.match(result)) { toast.success('İlaç güncellendi!'); setEditModal(null) }
    else toast.error(result.payload || 'Hata oluştu')
  }

  const handleDeleteMedicine = async () => {
    const result = await dispatch(deleteMedicine({ shopId: user.shopId, productId: deleteModal._id }))
    if (deleteMedicine.fulfilled.match(result)) { toast.success('İlaç silindi!'); setDeleteModal(null) }
    else toast.error(result.payload || 'Hata oluştu')
  }

  const myMedicines = medicines.filter(m => m.shop === user?.shopId || m.shop?._id === user?.shopId)

  if (!user?.shopId) {
    return (
      <div className={styles.noShop}>
        <span className={styles.noShopIcon}>🏪</span>
        <h2>Henüz eczaneniz yok</h2>
        <p>Başlamak için eczanenizi oluşturun</p>
        <button className={styles.createBtn} onClick={() => navigate('/franchise/create-shop')}>Eczane Oluştur</button>
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
              <h1 className={styles.shopName}>{shop?.shopName || 'Eczanem'}</h1>
              <p className={styles.shopMeta}>Sahip: {shop?.ownerName} · {shop?.streetAddress}, {shop?.city} · {shop?.phone}</p>
            </div>
          </div>
          <div className={styles.shopActions}>
            <button className={styles.editBtn} onClick={() => navigate('/franchise/edit-shop')}>Bilgileri Düzenle</button>
            <button className={styles.addBtn} onClick={() => setAddModal(true)}>+ İlaç Ekle</button>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'drugstore' ? styles.activeTab : ''}`} onClick={() => setActiveTab('drugstore')}>Eczanem</button>
          <button className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`} onClick={() => setActiveTab('all')}>Tüm İlaçlar</button>
        </div>

        {/* All Medicine Tab - Filter */}
        {activeTab === 'all' && (
          <div className={styles.filterBar}>
            <select className={styles.select} value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
              <option value="">Kategori seçin</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input className={styles.searchInput} placeholder="İlaç ara" value={searchName} onChange={(e) => setSearchName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleFilter()} />
            <button className={styles.filterBtn} onClick={handleFilter}>Filtrele</button>
          </div>
        )}

        {/* Medicine Grid */}
        <div className={styles.grid}>
          {loading ? (
            <p className={styles.loading}>Yükleniyor...</p>
          ) : (activeTab === 'drugstore' ? myMedicines : medicines).length === 0 ? (
            <p className={styles.empty}>İlaç bulunamadı</p>
          ) : (activeTab === 'drugstore' ? myMedicines : medicines).map(med => (
            <div key={med._id} className={styles.card}>
              <div className={styles.cardImg}>
                {med.photo ? <img src={med.photo.startsWith('http') ? med.photo : `http://localhost:5001${med.photo}`} alt={med.name} onError={e => { e.target.style.display='none' }} /> : <span>💊</span>}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.medName}>{med.name}</h3>
                <p className={styles.medPrice}>{med.price} ₺</p>
                <div className={styles.cardActions}>
                  {activeTab === 'all' ? (
                    <>
                      <button className={styles.addToShopBtn} onClick={() => toast.success('Eczaneye eklendi!')}>Eczaneye Ekle</button>
                      <button className={styles.detailsBtn} onClick={() => navigate(`/medicine/${med._id}`)}>Detay</button>
                    </>
                  ) : (
                    <>
                      <button className={styles.cardEditBtn} onClick={() => setEditModal(med)}>Düzenle</button>
                      <button className={styles.cardDeleteBtn} onClick={() => setDeleteModal(med)}>Sil</button>
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
