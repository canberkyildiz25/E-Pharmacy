import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../store/slices/productsSlice'
import ProductModal from '../../components/ProductModal/ProductModal'
import styles from './ProductsPage.module.css'

function ProductsPage() {
  const dispatch = useDispatch()
  const { items, categories, loading } = useSelector((state) => state.products)
  const [nameFilter, setNameFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => { dispatch(fetchProducts()) }, [dispatch])

  const handleFilter = () => {
    dispatch(fetchProducts(nameFilter ? { name: nameFilter } : {}))
  }

  const handleAdd = async (data) => {
    await dispatch(addProduct(data))
    setModalOpen(false)
  }

  const handleEdit = async (data) => {
    await dispatch(updateProduct({ id: editingProduct._id, data }))
    setEditingProduct(null)
    setModalOpen(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await dispatch(deleteProduct(id))
    }
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  const openAdd = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Products</h2>
      <div className={styles.toolbar}>
        <div className={styles.filterRow}>
          <input
            type="text"
            placeholder="Product Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
            className={styles.filterInput}
          />
          <button className={styles.filterBtn} onClick={handleFilter}>Filter</button>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>+ Add a new product</button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product Info</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Suppliers</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className={styles.center}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="6" className={styles.center}>No products found</td></tr>
            ) : items.map((product) => (
              <tr key={product._id}>
                <td>
                  <div className={styles.productInfo}>
                    {product.photo ? (
                      <img src={product.photo} alt={product.name} className={styles.productImg} onError={e => { e.target.style.display='none' }} />
                    ) : (
                      <div className={styles.productImgPlaceholder}>💊</div>
                    )}
                    <span>{product.name}</span>
                  </div>
                </td>
                <td><span className={styles.category}>{product.category}</span></td>
                <td>{product.stock}</td>
                <td>{product.suppliers}</td>
                <td>${product.price}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEdit(product)} title="Edit">✏️</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(product._id)} title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onSubmit={editingProduct ? handleEdit : handleAdd}
          onClose={() => { setModalOpen(false); setEditingProduct(null) }}
        />
      )}
    </div>
  )
}

export default ProductsPage
