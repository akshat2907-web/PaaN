function AdminProductList({ products, selectedProduct, onEdit, onCreate, onArchive }) {
  return (
    <section className="admin-product-list">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2>Products</h2>
        </div>
        <button className="button secondary" type="button" onClick={onCreate}>
          Add product
        </button>
      </div>

      <div className="admin-product-table">
        {products.length ? (
          products.map((product) => (
            <article
              className={
                selectedProduct?.id === product.id
                  ? 'admin-product-row is-selected'
                  : 'admin-product-row'
              }
              key={product.id}
            >
              <button type="button" onClick={() => onEdit(product)}>
                <span>{product.name}</span>
                <small>
                  {product.collection} / {product.status}
                </small>
              </button>
              <button
                className="admin-archive-button"
                type="button"
                onClick={() => onArchive(product.id)}
                disabled={product.status === 'archived'}
              >
                {product.status === 'archived' ? 'Archived' : 'Archive'}
              </button>
            </article>
          ))
        ) : (
          <p className="admin-empty-state">No products yet.</p>
        )}
      </div>
    </section>
  )
}

export default AdminProductList
