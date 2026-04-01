import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCustomers } from '../../../store/slices/customersSlice'
import styles from './CustomersPage.module.css'

function CustomersPage() {
  const dispatch = useDispatch()
  const { items, pagination, loading } = useSelector((state) => state.customers)
  const [nameFilter, setNameFilter] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchCustomers({ page, limit: 10 }))
  }, [dispatch, page])

  const handleFilter = () => {
    setPage(1)
    dispatch(fetchCustomers({ name: nameFilter, page: 1, limit: 10 }))
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    dispatch(fetchCustomers({ name: nameFilter, page: newPage, limit: 10 }))
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Customers</h2>
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
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User Info</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Register Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className={styles.center}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="6" className={styles.center}>No customers found</td></tr>
            ) : items.map((customer, i) => (
              <tr key={i}>
                <td>
                  <div className={styles.userInfo}>
                    {customer.photo ? (
                      <img src={customer.photo} alt={customer.name} className={styles.avatar} onError={e => { e.target.style.display='none' }} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>{customer.name?.charAt(0)}</div>
                    )}
                    <span>{customer.name}</span>
                  </div>
                </td>
                <td className={styles.email}>{customer.email}</td>
                <td>{customer.address}</td>
                <td>{customer.phone}</td>
                <td>{customer.register_date}</td>
                <td>
                  <button className={styles.editBtn} title="Edit">✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            ‹ Prev
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.activePage : ''}`}
              onClick={() => handlePageChange(p)}
            >
              {p}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pagination.totalPages}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  )
}

export default CustomersPage
