import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboard } from '../../store/slices/dashboardSlice'
import styles from './DashboardPage.module.css'

function DashboardPage() {
  const dispatch = useDispatch()
  const { data, loading } = useSelector((state) => state.dashboard)

  useEffect(() => { dispatch(fetchDashboard()) }, [dispatch])

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>
  if (!data) return null

  const { statistics, recentCustomers, incomeExpenses } = data

  const getTypeColor = (type) => {
    if (type === 'Income') return '#3BCC70'
    if (type === 'Expense') return '#E5677E'
    return '#E9A243'
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Dashboard</h2>

      {/* Statistics */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#EFF9F4' }}>💊</div>
          <div>
            <p className={styles.statLabel}>All products</p>
            <p className={styles.statValue}>{statistics.totalProducts}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#F0F0FF' }}>🏭</div>
          <div>
            <p className={styles.statLabel}>All suppliers</p>
            <p className={styles.statValue}>{statistics.totalSuppliers}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#FFF8EC' }}>👥</div>
          <div>
            <p className={styles.statLabel}>All customers</p>
            <p className={styles.statValue}>{statistics.totalCustomers}</p>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Recent Customers */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent Customers</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Spent</th>
              </tr>
            </thead>
            <tbody>
              {recentCustomers.map((c, i) => (
                <tr key={i}>
                  <td>
                    <div className={styles.userInfo}>
                      {c.photo ? (
                        <img src={c.photo} alt={c.name} className={styles.avatar} onError={e => { e.target.style.display='none' }} />
                      ) : (
                        <div className={styles.avatarPlaceholder}>{c.name?.charAt(0)}</div>
                      )}
                      <span>{c.name}</span>
                    </div>
                  </td>
                  <td className={styles.email}>{c.email}</td>
                  <td className={styles.spent}>${c.spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Income/Expenses */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Income / Expenses</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {incomeExpenses.map((item, i) => (
                <tr key={i}>
                  <td className={styles.truncate} title={item.name}>{item.name}</td>
                  <td style={{ color: getTypeColor(item.type), fontWeight: 600 }}>{item.amount}</td>
                  <td>
                    <span className={styles.badge} style={{ background: getTypeColor(item.type) + '22', color: getTypeColor(item.type) }}>
                      {item.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
