import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStatistics, fetchClientGoods, clearClientGoods } from '../../store/slices/statisticsSlice'
import styles from './StatisticsPage.module.css'

function StatisticsPage() {
  const dispatch = useDispatch()
  const { data, clientGoods, loading } = useSelector(state => state.statistics)
  const [selectedClient, setSelectedClient] = useState(null)

  useEffect(() => {
    dispatch(fetchStatistics())
  }, [dispatch])

  const handleClientClick = (customer) => {
    if (selectedClient?._id === customer._id) {
      setSelectedClient(null)
      dispatch(clearClientGoods())
    } else {
      setSelectedClient(customer)
      dispatch(fetchClientGoods(customer._id))
    }
  }

  if (loading) return <div className={styles.center}><p>Loading...</p></div>

  const stats = data?.statistics
  const recentCustomers = data?.recentCustomers || []
  const incomeExpenses = data?.incomeExpenses || []

  const totalIncome = incomeExpenses.filter(i => i.type === 'Income').reduce((sum, i) => sum + parseFloat(i.amount || 0), 0)
  const totalExpense = incomeExpenses.filter(i => i.type === 'Expense').reduce((sum, i) => sum + parseFloat(i.amount || 0), 0)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Statistics</h1>

        {/* Stat Cards */}
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>💊</span>
            <div>
              <p className={styles.statLabel}>Total Medicines</p>
              <p className={styles.statValue}>{stats?.totalMedicines ?? '—'}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🏪</span>
            <div>
              <p className={styles.statLabel}>Total Shops</p>
              <p className={styles.statValue}>{stats?.totalShops ?? '—'}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>👥</span>
            <div>
              <p className={styles.statLabel}>Total Customers</p>
              <p className={styles.statValue}>{stats?.totalCustomers ?? '—'}</p>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.incomeCard}`}>
            <span className={styles.statIcon}>📈</span>
            <div>
              <p className={styles.statLabel}>Total Income</p>
              <p className={styles.statValue}>${totalIncome.toFixed(2)}</p>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.expenseCard}`}>
            <span className={styles.statIcon}>📉</span>
            <div>
              <p className={styles.statLabel}>Total Expense</p>
              <p className={styles.statValue}>${totalExpense.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className={styles.bottomGrid}>
          {/* Recent Customers */}
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Recent Customers</h2>
            {recentCustomers.length === 0 ? (
              <p className={styles.empty}>No customers yet</p>
            ) : (
              <div className={styles.customerList}>
                {recentCustomers.map(c => (
                  <div key={c._id}>
                    <div
                      className={`${styles.customerRow} ${selectedClient?._id === c._id ? styles.activeRow : ''}`}
                      onClick={() => handleClientClick(c)}
                    >
                      <div className={styles.customerAvatar}>
                        {c.photo
                          ? <img src={c.photo.startsWith('http') ? c.photo : `http://localhost:5001${c.photo}`} alt={c.name} />
                          : <span>{c.name?.[0]?.toUpperCase()}</span>
                        }
                      </div>
                      <div className={styles.customerInfo}>
                        <p className={styles.customerName}>{c.name}</p>
                        <p className={styles.customerEmail}>{c.email}</p>
                      </div>
                      <span className={styles.customerSpent}>${c.spent}</span>
                    </div>

                    {selectedClient?._id === c._id && clientGoods && (
                      <div className={styles.goodsPanel}>
                        <p className={styles.goodsTitle}>Purchased items</p>
                        {clientGoods.purchases?.length === 0 ? (
                          <p className={styles.empty}>No purchases</p>
                        ) : (
                          clientGoods.purchases?.map((p, i) => (
                            <div key={i} className={styles.goodsRow}>
                              {p.photo && <img src={p.photo.startsWith('http') ? p.photo : `http://localhost:5001${p.photo}`} alt={p.medicineName} className={styles.goodsImg} onError={e => { e.target.style.display = 'none' }} />}
                              <div>
                                <p className={styles.goodsName}>{p.medicineName}</p>
                                <p className={styles.goodsPrice}>${p.price}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Income & Expense */}
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Income & Expenses</h2>
            {incomeExpenses.length === 0 ? (
              <p className={styles.empty}>No transactions yet</p>
            ) : (
              <div className={styles.txList}>
                {incomeExpenses.map(tx => (
                  <div key={tx._id} className={styles.txRow}>
                    <div className={styles.txDot} data-type={tx.type} />
                    <div className={styles.txInfo}>
                      <p className={styles.txName}>{tx.name}</p>
                      <p className={styles.txType}>{tx.type}</p>
                    </div>
                    <span className={`${styles.txAmount} ${tx.type === 'Income' ? styles.income : tx.type === 'Expense' ? styles.expense : styles.error}`}>
                      {tx.type === 'Income' ? '+' : '-'}${tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsPage
