import { useEffect, useState } from 'react'
import api from '../../../services/api'
import { toast } from 'react-hot-toast'
import styles from './OrdersPage.module.css'

const STATUSES = ['Beklemede', 'Onaylandı', 'Hazırlanıyor', 'Teslimatta', 'Teslim Edildi', 'İptal']

const STATUS_COLOR = {
  'Beklemede':    { bg: '#fff8e1', color: '#f59e0b' },
  'Onaylandı':   { bg: '#e8f5ec', color: '#3BCC70' },
  'Hazırlanıyor': { bg: '#e8f0ff', color: '#4472c4' },
  'Teslimatta':  { bg: '#f0f9ff', color: '#0ea5e9' },
  'Teslim Edildi': { bg: '#f0fdf4', color: '#16a34a' },
  'İptal':       { bg: '#fff5f5', color: '#e53e3e' },
}

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Hepsi')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.get('/franchise/orders')
      .then(r => setOrders(r.data))
      .catch(() => toast.error('Siparişler yüklenemedi'))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (orderId, status) => {
    try {
      const res = await api.patch(`/franchise/orders/${orderId}/status`, { status })
      setOrders(prev => prev.map(o => o._id === orderId ? res.data : o))
      toast.success(`Durum güncellendi: ${status}`)
    } catch {
      toast.error('Güncellenemedi')
    }
  }

  const filtered = filter === 'Hepsi' ? orders : orders.filter(o => o.status === filter)

  const counts = {}
  orders.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1 })

  if (loading) return <div className={styles.loading}>Yükleniyor...</div>

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Gelen Siparişler</h1>
            <p className={styles.pageSub}>Eczanenize gelen tüm online siparişler</p>
          </div>
          <div className={styles.totalBadge}>{orders.length} sipariş</div>
        </div>

        {/* Stat cards */}
        <div className={styles.statRow}>
          {[
            { label: 'Beklemede', icon: '⏳' },
            { label: 'Onaylandı', icon: '✅' },
            { label: 'Hazırlanıyor', icon: '📦' },
            { label: 'Teslimatta', icon: '🚚' },
            { label: 'Teslim Edildi', icon: '🎉' },
            { label: 'İptal', icon: '❌' },
          ].map(s => (
            <div key={s.label} className={styles.statCard} style={STATUS_COLOR[s.label]}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statCount}>{counts[s.label] || 0}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className={styles.filterTabs}>
          {['Hepsi', ...STATUSES].map(s => (
            <button
              key={s}
              className={`${styles.filterTab} ${filter === s ? styles.filterTabActive : ''}`}
              onClick={() => setFilter(s)}
            >
              {s} {s !== 'Hepsi' && counts[s] ? <span className={styles.tabCount}>{counts[s]}</span> : null}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📋</span>
            <p>Bu kategoride sipariş yok</p>
          </div>
        ) : (
          <div className={styles.orderList}>
            {filtered.map(order => {
              const sc = STATUS_COLOR[order.status] || {}
              const isOpen = expanded === order._id
              return (
                <div key={order._id} className={styles.orderCard}>
                  <div className={styles.orderTop} onClick={() => setExpanded(isOpen ? null : order._id)}>
                    <div className={styles.orderLeft}>
                      <span className={styles.orderIcon}>🧾</span>
                      <div>
                        <p className={styles.orderCustomer}>{order.customerName}</p>
                        <p className={styles.orderMeta}>
                          {order.items.length} ürün · {order.total?.toFixed(2)} ₺ ·{' '}
                          {new Date(order.createdAt).toLocaleDateString('tr-TR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className={styles.orderRight}>
                      <span className={styles.statusBadge} style={{ background: sc.bg, color: sc.color }}>
                        {order.status}
                      </span>
                      <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className={styles.orderDetail}>
                      <div className={styles.detailGrid}>
                        <div className={styles.detailSection}>
                          <p className={styles.detailLabel}>Teslimat Bilgileri</p>
                          {order.customerPhone && <p className={styles.detailVal}>📞 {order.customerPhone}</p>}
                          {order.address && <p className={styles.detailVal}>📍 {order.address}</p>}
                          {order.note && <p className={styles.detailVal}>💬 {order.note}</p>}
                        </div>
                        <div className={styles.detailSection}>
                          <p className={styles.detailLabel}>Ürünler</p>
                          {order.items.map((item, i) => (
                            <div key={i} className={styles.orderItem}>
                              <span className={styles.orderItemName}>{item.name}</span>
                              <span className={styles.orderItemQty}>x{item.quantity}</span>
                              <span className={styles.orderItemPrice}>{(item.price * item.quantity).toFixed(2)} ₺</span>
                            </div>
                          ))}
                          <div className={styles.orderTotal}>Toplam: <strong>{order.total?.toFixed(2)} ₺</strong></div>
                        </div>
                      </div>

                      <div className={styles.statusActions}>
                        <p className={styles.detailLabel}>Durumu Güncelle</p>
                        <div className={styles.statusBtns}>
                          {STATUSES.map(s => (
                            <button
                              key={s}
                              className={`${styles.statusBtn} ${order.status === s ? styles.statusBtnActive : ''}`}
                              style={order.status === s ? { background: sc.bg, color: sc.color, borderColor: sc.color } : {}}
                              onClick={() => updateStatus(order._id, s)}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
