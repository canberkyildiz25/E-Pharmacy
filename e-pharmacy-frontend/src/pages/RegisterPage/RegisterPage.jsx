import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerUser, clearError } from '../../store/slices/authSlice'
import { toast } from 'react-hot-toast'
import styles from './RegisterPage.module.css'

const schema = yup.object({
  name:     yup.string().required('Ad Soyad zorunludur'),
  email:    yup.string().email('Geçersiz e-posta adresi').required('E-posta zorunludur'),
  phone:    yup.string().matches(/^[+]?[\d\s\-()]{7,15}$/, 'Geçersiz telefon numarası').required('Telefon zorunludur'),
  password: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre zorunludur'),
})

function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((state) => state.auth)
  const [role, setRole] = useState('client')

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (token) navigate('/home')
    return () => { dispatch(clearError()) }
  }, [token, navigate, dispatch])

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser({ ...data, role }))
    if (registerUser.fulfilled.match(result)) {
      toast.success('Hesabınız başarıyla oluşturuldu!')
      if (role === 'franchise') navigate('/franchise/shop', { replace: true })
      else navigate('/home', { replace: true })
    } else {
      toast.error(result.payload || 'Kayıt başarısız')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.promo}>
        <div className={styles.promoContent}>
          <h1 className={styles.promoTitle}>E-Pharmacy'ye Katılın</h1>
          <p className={styles.promoText}>Müşteri veya franchise sahibi olarak kayıt olabilirsiniz</p>
          <div className={styles.promoBadges}>
            <span className={styles.badge}>💊 18K+ İlaç Çeşidi</span>
            <span className={styles.badge}>🏪 50+ Eczane</span>
          </div>
        </div>
      </div>
      <div className={styles.formSide}>
        <div className={styles.formCard}>
          <h2 className={styles.title}>Kayıt Ol</h2>
          <p className={styles.subtitle}>Hesabınızı oluşturun</p>

          {/* Rol seçimi */}
          <div className={styles.roleSwitch}>
            <button
              type="button"
              className={`${styles.roleBtn} ${role === 'client' ? styles.roleActive : ''}`}
              onClick={() => setRole('client')}
            >👤 Müşteri</button>
            <button
              type="button"
              className={`${styles.roleBtn} ${role === 'franchise' ? styles.roleActive : ''}`}
              onClick={() => setRole('franchise')}
            >🏪 Franchise</button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            {[
              { name: 'name',     label: 'Ad Soyad',        type: 'text',     placeholder: 'Ahmet Yılmaz' },
              { name: 'email',    label: 'E-posta Adresi',  type: 'email',    placeholder: 'ornek@mail.com' },
              { name: 'phone',    label: 'Telefon Numarası',type: 'tel',      placeholder: '+90 555 000 0000' },
              { name: 'password', label: 'Şifre',           type: 'password', placeholder: '••••••••' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name} className={styles.field}>
                <label className={styles.label}>{label}</label>
                <input {...register(name)} type={type} placeholder={placeholder}
                  className={errors[name] ? styles.inputError : styles.input} />
                {errors[name] && <span className={styles.err}>{errors[name].message}</span>}
              </div>
            ))}
            {error && <div className={styles.serverError}>{error}</div>}
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
            </button>
            <p className={styles.switchText}>Zaten hesabınız var mı? <Link to="/login" className={styles.switchLink}>Giriş Yap</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
