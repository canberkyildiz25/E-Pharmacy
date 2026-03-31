import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import styles from './SupplierModal.module.css'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
  suppliers: yup.string().required('Company is required'),
  date: yup.string().required('Delivery date is required'),
  amount: yup.string().required('Amount is required'),
  status: yup.string().required('Status is required'),
})

function SupplierModal({ supplier, onSubmit, onClose }) {
  const isEdit = !!supplier
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: supplier || {},
  })

  useEffect(() => {
    reset(supplier || { name: '', address: '', suppliers: '', date: '', amount: '', status: 'Active' })
  }, [supplier, reset])

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{isEdit ? 'Edit Supplier Data' : 'Add New Supplier'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label>Supplier Name</label>
            <input {...register('name')} placeholder="Supplier Name" className={errors.name ? styles.error : ''} />
            {errors.name && <span className={styles.errMsg}>{errors.name.message}</span>}
          </div>
          <div className={styles.field}>
            <label>Address</label>
            <input {...register('address')} placeholder="Address" className={errors.address ? styles.error : ''} />
            {errors.address && <span className={styles.errMsg}>{errors.address.message}</span>}
          </div>
          <div className={styles.field}>
            <label>Company</label>
            <input {...register('suppliers')} placeholder="Company Name" className={errors.suppliers ? styles.error : ''} />
            {errors.suppliers && <span className={styles.errMsg}>{errors.suppliers.message}</span>}
          </div>
          <div className={styles.field}>
            <label>Delivery Date</label>
            <input {...register('date')} placeholder="e.g. September 19, 2023" className={errors.date ? styles.error : ''} />
            {errors.date && <span className={styles.errMsg}>{errors.date.message}</span>}
          </div>
          <div className={styles.field}>
            <label>Amount</label>
            <input {...register('amount')} placeholder="৳ 0.00" className={errors.amount ? styles.error : ''} />
            {errors.amount && <span className={styles.errMsg}>{errors.amount.message}</span>}
          </div>
          <div className={styles.field}>
            <label>Status</label>
            <select {...register('status')} className={errors.status ? styles.error : ''}>
              <option value="Active">Active</option>
              <option value="Deactive">Deactive</option>
            </select>
            {errors.status && <span className={styles.errMsg}>{errors.status.message}</span>}
          </div>
          <div className={styles.btnRow}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>{isEdit ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SupplierModal
