import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSuppliers, addSupplier, updateSupplier } from '../../store/slices/suppliersSlice'
import SupplierModal from '../../components/SupplierModal/SupplierModal'
import styles from './SuppliersPage.module.css'

function SuppliersPage() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector((state) => state.suppliers)
  const [nameFilter, setNameFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)

  useEffect(() => { dispatch(fetchSuppliers()) }, [dispatch])

  const handleFilter = () => {
    dispatch(fetchSuppliers(nameFilter ? { name: nameFilter } : {}))
  }

  const handleAdd = async (data) => {
    await dispatch(addSupplier(data))
    setModalOpen(false)
  }

  const handleEdit = async (data) => {
    await dispatch(updateSupplier({ id: editingSupplier._id, data }))
    setEditingSupplier(null)
    setModalOpen(false)
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Suppliers</h2>
      <div className={styles.toolbar}>
        <div className={styles.filterRow}>
          <input
            type="text"
            placeholder="User Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
            className={styles.filterInput}
          />
          <button className={styles.filterBtn} onClick={handleFilter}>Filter</button>
        </div>
        <button className={styles.addBtn} onClick={() => { setEditingSupplier(null); setModalOpen(true) }}>
          + Add a new supplier
        </button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Supplier Info</th>
              <th>Address</th>
              <th>Company</th>
              <th>Delivery Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className={styles.center}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="7" className={styles.center}>No suppliers found</td></tr>
            ) : items.map((supplier, i) => (
              <tr key={i}>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.avatarPlaceholder}>{supplier.name?.charAt(0)}</div>
                    <span>{supplier.name}</span>
                  </div>
                </td>
                <td>{supplier.address}</td>
                <td>{supplier.suppliers}</td>
                <td>{supplier.date}</td>
                <td>{supplier.amount}</td>
                <td>
                  <span className={styles.statusBadge} style={{
                    background: supplier.status === 'Active' ? '#EFF9F4' : '#FFF5F5',
                    color: supplier.status === 'Active' ? '#3BCC70' : '#E5677E'
                  }}>
                    {supplier.status}
                  </span>
                </td>
                <td>
                  <button className={styles.editBtn} onClick={() => { setEditingSupplier(supplier); setModalOpen(true) }}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <SupplierModal
          supplier={editingSupplier}
          onSubmit={editingSupplier ? handleEdit : handleAdd}
          onClose={() => { setModalOpen(false); setEditingSupplier(null) }}
        />
      )}
    </div>
  )
}

export default SuppliersPage
