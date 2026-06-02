import { motion, AnimatePresence } from 'framer-motion'

function ProductModal({ product, isOpen, onClose }) {
  if (!product) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            className="modal-panel"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className={`modal-image textile-${product.tone}`}>
                {/* This acts as a placeholder image area. Can be replaced with <img src={product.image} /> later */}
                <span>{product.category}</span>
              </div>
              
              <div className="modal-details">
                <p className="eyebrow">{product.fabric}</p>
                <h2 id="modal-title">{product.name}</h2>
                <span className="modal-price">{product.price}</span>
                
                <div className="modal-divider"></div>
                
                <div className="modal-info-block">
                  <h3>About this piece</h3>
                  <p>{product.description}</p>
                </div>

                {product.craftNote && (
                  <div className="modal-info-block">
                    <h3>Craft Note</h3>
                    <p>{product.craftNote}</p>
                  </div>
                )}
                
                {product.occasion && (
                  <div className="modal-info-block">
                    <h3>Occasion</h3>
                    <p>{product.occasion}</p>
                  </div>
                )}

                <div className="modal-actions">
                  <button className="button primary whatsapp-btn" disabled>
                    WhatsApp Enquiry Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ProductModal
