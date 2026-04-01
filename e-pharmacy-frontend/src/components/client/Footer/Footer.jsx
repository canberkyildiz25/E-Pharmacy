import { Link, NavLink } from 'react-router-dom'
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/home" className={styles.logo}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="8" fill="#3BCC70"/><path d="M14 6v16M6 14h16" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
              <span className={styles.logoText}>E-Pharmacy</span>
            </Link>
            <p className={styles.tagline}>Daha iyi hissetmenizi, aktif yaşamınıza dönmenizi ve her anın tadını çıkarmanızı sağlayacak ilaçları kapınıza getiriyoruz.</p>
            <ul className={styles.social}>
              <li>
                <a href="https://www.facebook.com/goITclub/" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/goitclub/" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/c/GoIT" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="YouTube">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.5C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
                </a>
              </li>
            </ul>
          </div>

          <nav className={styles.nav}>
            <NavLink to="/home" className={styles.navLink}>Ana Sayfa</NavLink>
            <NavLink to="/medicine-store" className={styles.navLink}>Eczaneler</NavLink>
            <NavLink to="/medicine" className={styles.navLink}>İlaçlar</NavLink>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>© E-Pharmacy 2024. Tüm Hakları Saklıdır.</p>
          <div className={styles.bottomLinks}>
            <Link to="/privacy-policy" className={styles.bottomLink}>Gizlilik Politikası</Link>
            <Link to="/terms" className={styles.bottomLink}>Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
