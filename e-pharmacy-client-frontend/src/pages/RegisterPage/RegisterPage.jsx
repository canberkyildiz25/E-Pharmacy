import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerUser, clearError } from '../../store/slices/authSlice'
import { toast } from 'react-hot-toast'
import styles from './RegisterPage.module.css'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().matches(/^[+]?[\d\s\-()]{7,15}$/, 'Invalid phone number').required('Phone is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((state) => state.auth)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (token) navigate('/home')
    return () => { dispatch(clearError()) }
  }, [token, navigate, dispatch])

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data))
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully!')
      navigate('/home')
    } else {
      toast.error(result.payload || 'Registration failed')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.promo}>
        <div className={styles.promoContent}>
          <h1 className={styles.promoTitle}>Your medication, delivered</h1>
          <p className={styles.promoText}>Say goodbye to all your healthcare worries with us</p>
        </div>
      </div>
      <div className={styles.formSide}>
        <div className={styles.formCard}>
          <h2 className={styles.title}>Register</h2>
          <p className={styles.subtitle}>Create your account to get started</p>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
              { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 8900' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name} className={styles.field}>
                <label className={styles.label}>{label}</label>
                <input {...register(name)} type={type} placeholder={placeholder} className={errors[name] ? styles.inputError : styles.input} />
                {errors[name] && <span className={styles.err}>{errors[name].message}</span>}
              </div>
            ))}
            {error && <div className={styles.serverError}>{error}</div>}
            <button type="submit" className={styles.btn} disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
            <p className={styles.switchText}>Already have account? <Link to="/login" className={styles.switchLink}>Login</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
