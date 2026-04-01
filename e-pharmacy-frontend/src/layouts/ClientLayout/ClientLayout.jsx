import { Outlet } from 'react-router-dom'
import Header from '../../components/client/Header/Header'
import Footer from '../../components/client/Footer/Footer'
import styles from './ClientLayout.module.css'

function ClientLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default ClientLayout
