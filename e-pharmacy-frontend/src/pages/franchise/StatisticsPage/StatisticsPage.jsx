import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStatistics } from '../../../store/slices/statisticsSlice'
import styles from './StatisticsPage.module.css'

const STATUS_COLOR = {
  'Beklemede': '#f59e0b',
  'Onaylandı': '#3b82f6',
  'Hazırlanıyor': '#8b5cf6',
  'Teslimatta': '#06b6d4',
  'Teslim Edildi': '#22c55e',
  'İptal': '#ef4444',
}

function StatisticsPage() {
  const dispatch = useDispatch()
  const { data, loading } = useSelector(state => state.statistics)

  useEffect(() => {
    dispatch(fetchStatistics())
  }, [dispatch])

  if (loading) return <div className={styles.center}><p>Yükleniyor...</p></div>

  const stats = data?.statistics
  const recentCustomers = data?.recentCustomers || []
  const incomeExpenses = data?.incomeExpenses || []

  const totalIncome = incomeExpenses.filter(i => i.type === 'Income').reduce((sum, i) => sum + parseFloat(i.amount || 0), 0)
  const totalExpense = incomeExpenses.filter(i => i.type === 'Expense').reduce((sum, i) => sum + parseFloat(i.amount || 0), 0)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>İstatistikler</h1>

        {/* Stat Cards */}
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>💊</span>
            <div>
              <p className={styles.statLabel}>Toplam İlaç</p>
              <p className={styles.statValue}>{stats?.totalMedicines ?? '—'}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📦</span>
            <div>
              <p className={styles.statLabel}>Toplam Sipariş</p>
              <p className={styles.statValue}>{stats?.totalShops ?? '—'}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>✅</span>
            <div>
              <p className={styles.statLabel}>Teslim Edilen</p>
              <p className={styles.statValue}>{stats?.totalCustomers ?? '—'}</p>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.incomeCard}`}>
            <span className={styles.statIcon}>📈</span>
            <div>
              <p className={styles.statLabel}>Toplam Gelir</p>
              <p className={styles.statValue}>{totalIncome.toFixed(2)} ₺</p>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.expenseCard}`}>
            <span className={styles.statIcon}>📉</span>
            <div>
              <p className={styles.statLabel}>Toplam Gider</p>
              <p className={styles.statValue}>{totalExpense.toFixed(2)} ₺</p>
            </div>
          </div>
        </div>

        <div className={styles.bottomGrid}>
          {/* Son Siparişler */}
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Son Siparişler</h2>
            {recentCustomers.length === 0 ? (
              <p className={styles.empty}>Henüz sipariş yok</p>
            ) : (
              <div className={styles.customerList}>
                {recentCustomers.map(c => (
                  <div key={c._id} className={styles.customerRow}>
                    <div className={styles.customerAvatar}>
                      <span>{c.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className={styles.customerInfo}>
                      <p className={styles.customerName}>{c.name}</p>
                      <p className={styles.customerEmail}>{c.phone}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={styles.customerSpent}>{parseFloat(c.total || 0).toFixed(2)} ₺</span>
                      <p style={{ fontSize: 11, marginTop: 2, color: STATUS_COLOR[c.status] || '#888', fontWeight: 600 }}>{c.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gelir & Gider */}
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Gelir & Gider</h2>
            {incomeExpenses.length === 0 ? (
              <p className={styles.empty}>Henüz işlem yok</p>
            ) : (
              <div className={styles.txList}>
                {incomeExpenses.map(tx => (
                  <div key={tx._id} className={styles.txRow}>
                    <div className={styles.txDot} data-type={tx.type} />
                    <div className={styles.txInfo}>
                      <p className={styles.txName}>{tx.name}</p>
                      <p className={styles.txType}>{tx.type === 'Income' ? 'Gelir' : tx.type === 'Expense' ? 'Gider' : 'Hata'}</p>
                    </div>
                    <span className={`${styles.txAmount} ${tx.type === 'Income' ? styles.income : tx.type === 'Expense' ? styles.expense : styles.error}`}>
                      {tx.type === 'Income' ? '+' : '-'}{tx.amount} ₺
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
