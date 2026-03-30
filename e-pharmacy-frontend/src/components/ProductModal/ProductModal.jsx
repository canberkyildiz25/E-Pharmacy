import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import styles from './ProductModal.module.css'

const CATEGORIES = ['Medicine', 'Head', 'Hand', 'Dental Care', 'Skin Care', 'Eye Care', 'Vitamins & Supplements', 'Orthopedic Products', 'Baby Care']

const schema = yup.object({
  name: yup.string().required('Product name is required'),
  category: yup.string().required('Category is required'),
  stock: yup.string().required('Stock is required'),
  suppliers: yup.string().required('Suppliers is required'),
  price: yup.string().required('Price is required'),
})

function ProductModal({ product, categories, onSubmit, onClose }) {
  const isEdit = !!product
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: product || {},
  })

  useEffect(() => {
    reset(product || { name: '', category: '', stock: '', suppliers: '', price: '' })
  }, [product, reset])

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{isEdit ? 'Edit Product Data' : 'Add New Product'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label>Product Name</label>
            <input {...register('name')} placeholder="Product Name" className={errors.name ? styles.error : ''} />
            {errors.name && <span className={styles.errMsg}>{errors.name.message}</span>}
          </div>
          <div className={styles.field}>
            <label>Category</label>
            <select {...register('category')} className={errors.category ? styles.error : ''}>
              <option value="">Select category</option>
              {(categories?.length ? categories : CATEGORIES).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <span className={styles.errMsg}>{errors.category.message}</span>}
          </div>
          <div className={styles.field}>
            <label>Stock</label>
            <input {...register('stock')} placeholder="Stock quantity" className={errors.stock ? styles.error : ''} />
            {errors.stock && <span className={styles.errMsg}>{errors.stock.message}</span>}
          </div>
          <div className={styles.field}>
            <label>Suppliers</label>
            <input {...register('suppliers')} placeholder="Supplier name" className={errors.suppliers ? styles.error : ''} />
            {errors.suppliers && <span className={styles.errMsg}>{errors.suppliers.message}</span>}
          </div>
          <div className={styles.field}>
            <label>Price ($)</label>
            <input {...register('price')} placeholder="0.00" className={errors.price ? styles.error : ''} />
            {errors.price && <span className={styles.errMsg}>{errors.price.message}</span>}
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

export default ProductModal
