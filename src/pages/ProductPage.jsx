import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  getCollectionBySlug,
  getProductById,
} from '../data/catalog.js'

function ProductPage() {
  const { productId } = useParams()
  const product = getProductById(productId)
  const collection = product ? getCollectionBySlug(product.collection) : null

  if (!product) {
    return (
      <section className="not-found">
        <p className="eyebrow">Piece not found</p>
        <h1>This piece is no longer in the edit.</h1>
        <Link className="button primary" to="/">
          Return Home
        </Link>
      </section>
    )
  }

  return (
    <section className="product-detail-page">
      <motion.div
        className={`product-detail-image textile-${product.tone}`}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      >
        <span>{product.category}</span>
      </motion.div>

      <motion.div
        className="product-detail-copy"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.52, delay: 0.08 }}
      >
        <p className="eyebrow">
          {collection ? collection.name : 'PaaN'} / {product.fabric}
        </p>
        <h1>{product.name}</h1>
        <span className="product-detail-price">{product.price}</span>

        <div className="product-detail-divider" />

        <div className="product-detail-section">
          <h2>About this piece</h2>
          <p>{product.description}</p>
        </div>

        {product.craftNote ? (
          <div className="product-detail-section">
            <h2>Craft note</h2>
            <p>{product.craftNote}</p>
          </div>
        ) : null}

        {product.occasion ? (
          <div className="product-detail-section">
            <h2>Occasion</h2>
            <p>{product.occasion}</p>
          </div>
        ) : null}

        <div className="product-detail-actions">
          <Link
            className="button secondary"
            to={collection ? `/collections/${collection.slug}` : '/'}
          >
            Back to collection
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

export default ProductPage
