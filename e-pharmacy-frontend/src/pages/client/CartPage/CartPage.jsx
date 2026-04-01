import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateCart, checkout } from '../../../store/slices/cartSlice'
import { toast } from 'react-hot-toast'
import api from '../../../services/api'
import styles from './CartPage.module.css'

function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, loading } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ address: '', phone: '', note: '' })
  const [placing, setPlacing] = useState(false)
  const [photoMap, setPhotoMap] = useState({})

  // Sepetteki ürünlerin güncel fotoğraflarını çek
  useEffect(() => {
    if (!items.length) return
    Promise.all(
      items.map(item =>
        api.get(`/medicines/${item.productId}`)
          .then(r => ({ id: item.productId, photo: r.data.photo }))
          .catch(() => ({ id: item.productId, photo: null }))
      )
    ).then(results => {
      const map = {}
      results.forEach(r => { map[r.id] = r.photo })
      setPhotoMap(map)
    })
  }, [items.length])

  const total = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0)

  const getPhoto = (item) => {
    const p = photoMap[item.productId] || item.photo
    if (!p || !p.trim()) return null
    return p.startsWith('http') ? p : `http://localhost:5000${p}`
  }

  const changeQty = (item, delta) => {
    const newQty = item.quantity + delta
    dispatch(updateCart({ productId: item.productId, name: item.name, price: item.price, photo: item.photo, quantity: newQty }))
  }

  const handleCheckout = async () => {
    if (!form.address.trim()) { toast.error('Lütfen teslimat adresini girin'); return }
    if (!form.phone.trim())   { toast.error('Lütfen telefon numaranızı girin'); return }
    setPlacing(true)
    const result = await dispatch(checkout({ address: form.address, phone: form.phone, note: form.note }))
    setPlacing(false)
    if (checkout.fulfilled.match(result)) {
      toast.success('Siparişiniz alındı! 🎉')
      navigate('/medicine')
    } else {
      toast.error('Bir hata oluştu, tekrar deneyin')
    }
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyPage}>
        <div className={styles.emptyBox}>
          <span className={styles.emptyIcon}>🛒</span>
          <h2>Sepetiniz boş</h2>
          <p>İlaçlar sayfasından ürün ekleyebilirsiniz.</p>
          <button className={styles.shopBtn} onClick={() => navigate('/medicine')}>Alışverişe Başla</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Sepetim</h1>

        <div className={styles.layout}>
          {/* Sol: Ürünler */}
          <div className={styles.itemsCol}>
            <div className={styles.itemsCard}>
              {items.map((item) => {
                const img = getPhoto(item)
                return (
                  <div key={item.productId} className={styles.item}>
                    <div className={styles.itemImg} onClick={() => navigate(`/product/${item.productId}`)} style={{ cursor: 'pointer' }}>
                      {img
                        ? <img src={img} alt="" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
                        : null
                      }
                      <span style={{ display: img ? 'none' : 'flex', fontSize: 28, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>💊</span>
                    </div>
                    <div className={styles.itemInfo} style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${item.productId}`)}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemPrice}>{parseFloat(item.price).toFixed(2)} ₺</p>
                    </div>
                    <div className={styles.qtyControl}>
                      <button onClick={() => changeQty(item, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => changeQty(item, 1)}>+</button>
                    </div>
                    <p className={styles.itemTotal}>{(parseFloat(item.price) * item.quantity).toFixed(2)} ₺</p>
                    <button className={styles.removeBtn} onClick={() => changeQty(item, -item.quantity)}>✕</button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sağ: Özet + Form */}
          <div className={styles.summaryCol}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Sipariş Özeti</h2>
              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}><span>Ürünler ({items.length})</span><span>{total.toFixed(2)} ₺</span></div>
                <div className={styles.summaryRow}><span>Teslimat</span><span className={styles.free}>Ücretsiz</span></div>
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}><span>Toplam</span><strong>{total.toFixed(2)} ₺</strong></div>
              </div>
            </div>

            <div className={styles.formCard}>
              <h2 className={styles.summaryTitle}>Teslimat Bilgileri</h2>
              <div className={styles.field}>
                <label>Ad Soyad</label>
                <input value={user?.name || ''} disabled className={styles.inputDisabled} />
              </div>
              <div className={styles.field}>
                <label>Telefon *</label>
                <input
                  placeholder="05xx xxx xx xx"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label>Teslimat Adresi *</label>
                <textarea
                  placeholder="Mahalle, cadde, kapı no..."
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className={styles.textarea}
                  rows={3}
                />
              </div>
              <div className={styles.field}>
                <label>Not (isteğe bağlı)</label>
                <textarea
                  placeholder="Kapıya bırakın, zil çalmayın..."
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  className={styles.textarea}
                  rows={2}
                />
              </div>
              <button
                className={styles.checkoutBtn}
                onClick={handleCheckout}
                disabled={placing || loading}
              >
                {placing ? 'Sipariş veriliyor...' : `Sipariş Ver • ${total.toFixed(2)} ₺`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
