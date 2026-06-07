import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function ProductCard({ product, index = 0 }) {
  return (
    <motion.article
      className="product-card product-card--interactive"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
    >
      <Link to={`/products/${product.id}`} aria-label={`View ${product.name}`}>
        <div className={`product-image textile-${product.tone}`}>
          <span>{product.category}</span>
        </div>
        <div className="product-content">
          <p>{product.fabric}</p>
          <h3>{product.name}</h3>
          <span>{product.price}</span>
        </div>
      </Link>
    </motion.article>
  )
}

export default ProductCard
