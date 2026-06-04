import { motion } from 'framer-motion'

function ProductCard({ product, index = 0, onClick }) {
  const isInteractive = typeof onClick === 'function'

  return (
    <motion.article
      className={`product-card${isInteractive ? ' product-card--interactive' : ''}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      <div className={`product-image textile-${product.tone}`}>
        <span>{product.category}</span>
      </div>
      <div className="product-content">
        <p>{product.fabric}</p>
        <h3>{product.name}</h3>
        <span>{product.price}</span>
      </div>
    </motion.article>
  )
}

export default ProductCard
