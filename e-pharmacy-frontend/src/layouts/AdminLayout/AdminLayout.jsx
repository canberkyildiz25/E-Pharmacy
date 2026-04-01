import { Outlet } from 'react-router-dom'
import Header  from '../../components/admin/Header/Header'
import Sidebar from '../../components/admin/Sidebar/Sidebar'
import styles  from './AdminLayout.module.css'

function AdminLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
