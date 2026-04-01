import { Link } from 'react-router-dom'
import styles from './AuthModal.module.css'

function AuthModal({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <span className={styles.icon}>🔒</span>
        <h2 className={styles.title}>Giriş Gerekli</h2>
        <p className={styles.text}>Sepete ürün eklemek için giriş yapmanız gerekmektedir.</p>
        <div className={styles.actions}>
          <Link to="/login" className={styles.loginBtn} onClick={onClose}>Giriş Yap</Link>
          <Link to="/register" className={styles.registerBtn} onClick={onClose}>Kayıt Ol</Link>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
