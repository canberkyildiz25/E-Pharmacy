import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '../../store/slices/ordersSlice'
import styles from './OrdersPage.module.css'

const STATUS_COLORS = {
  Completed: '#1BC7BA', Confirmed: '#8B50B0', Pending: '#E9A243',
  Cancelled: '#E5677E', Processing: '#F9DA6A', Shipped: '#7A8DFF', Delivered: '#3BCC70'
}

function OrdersPage() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector((state) => state.orders)
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => { dispatch(fetchOrders()) }, [dispatch])

  const handleFilter = () => {
    dispatch(fetchOrders(nameFilter ? { name: nameFilter } : {}))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleFilter()
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Orders</h2>
      <div className={styles.filterRow}>
        <input
          type="text"
          placeholder="User Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.filterInput}
        />
        <button className={styles.filterBtn} onClick={handleFilter}>Filter</button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User Info</th>
              <th>Address</th>
              <th>Products</th>
              <th>Order Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className={styles.center}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="6" className={styles.center}>No orders found</td></tr>
            ) : items.map((order, i) => (
              <tr key={i}>
                <td>
                  <div className={styles.userInfo}>
                    {order.photo ? (
                      <img src={order.photo} alt={order.name} className={styles.avatar} onError={e => { e.target.style.display='none' }} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>{order.name?.charAt(0)}</div>
                    )}
                    <span>{order.name}</span>
                  </div>
                </td>
                <td>{order.address}</td>
                <td>{order.products}</td>
                <td>{order.order_date}</td>
                <td>${order.price}</td>
                <td>
                  <span className={styles.statusBadge} style={{ background: STATUS_COLORS[order.status] + '22', color: STATUS_COLORS[order.status] }}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrdersPage
