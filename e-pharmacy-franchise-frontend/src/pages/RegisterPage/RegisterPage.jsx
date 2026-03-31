import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { register, clearError } from '../../store/slices/authSlice'
import { toast } from 'react-hot-toast'
import styles from './RegisterPage.module.css'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
})

function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((state) => state.auth)

  const { register: reg, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (token) navigate('/shop')
    return () => dispatch(clearError())
  }, [token, navigate, dispatch])

  const onSubmit = async (data) => {
    const result = await dispatch(register(data))
    if (register.fulfilled.match(result)) {
      toast.success('Registration successful!')
      navigate('/shop')
    } else {
      toast.error(result.payload || 'Registration failed')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.promo}>
        <div className={styles.promoContent}>
          <span className={styles.promoIcon}>💊</span>
          <h2 className={styles.promoTitle}>Your medication, delivered</h2>
          <p className={styles.promoText}>Say goodbye to all your healthcare worries with us</p>
        </div>
      </div>
      <div className={styles.formSide}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Register</h1>
          <p className={styles.subtitle}>Create your franchise account</p>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.field}>
              <label>Full Name</label>
              <input {...reg('name')} placeholder="Your name" className={errors.name ? styles.inputError : styles.input} />
              {errors.name && <span className={styles.err}>{errors.name.message}</span>}
            </div>
            <div className={styles.field}>
              <label>Email Address</label>
              <input {...reg('email')} type="email" placeholder="your@email.com" className={errors.email ? styles.inputError : styles.input} />
              {errors.email && <span className={styles.err}>{errors.email.message}</span>}
            </div>
            <div className={styles.field}>
              <label>Phone Number</label>
              <input {...reg('phone')} placeholder="+1 234 567 8900" className={errors.phone ? styles.inputError : styles.input} />
              {errors.phone && <span className={styles.err}>{errors.phone.message}</span>}
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input {...reg('password')} type="password" placeholder="Min 6 characters" className={errors.password ? styles.inputError : styles.input} />
              {errors.password && <span className={styles.err}>{errors.password.message}</span>}
            </div>
            {error && <div className={styles.serverError}>{error}</div>}
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <p className={styles.switchText}>
              Already have an account? <Link to="/login" className={styles.switchLink}>Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
