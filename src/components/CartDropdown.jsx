import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { formatCartPrice, useCart } from '../context/CartContext.jsx'

function CartDropdown({ isOpen = false, onClose, onNavigate, onToggle }) {
  const menuRef = useRef(null)
  const { items, itemCount, formattedSubtotal, updateQuantity, removeItem } = useCart()

  function closeDropdown() {
    onClose?.()
    onNavigate?.()
  }

  useEffect(() => {
    if (!isOpen) return undefined

    function handleDocumentMouseDown(event) {
      if (menuRef.current?.contains(event.target)) return
      onClose?.()
    }

    function handleDocumentKeyDown(event) {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    document.addEventListener('mousedown', handleDocumentMouseDown)
    document.addEventListener('keydown', handleDocumentKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown)
      document.removeEventListener('keydown', handleDocumentKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <div className="cart-menu" ref={menuRef}>
      <button
        className="cart-menu-button"
        type="button"
        aria-label={`Cart with ${itemCount} items`}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.5 8.5h9l-.55 10.2a2 2 0 0 1-2 1.9h-4.9a2 2 0 0 1-2-1.9L6.5 8.5Z" />
          <path d="M9 8.5a3 3 0 0 1 6 0" />
        </svg>
        <span>{itemCount}</span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="cart-dropdown"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className="cart-dropdown-header">
              <p className="eyebrow">Cart</p>
              <strong>{formattedSubtotal}</strong>
            </div>

            {items.length ? (
              <>
                <div className="cart-dropdown-list">
                  {items.map((item) => (
                    <article className="cart-dropdown-item" key={item.id}>
                      <div className="cart-item-image">
                        {item.image ? <img src={item.image} alt={item.name} /> : null}
                      </div>
                      <div>
                        <Link to={`/products/${item.slug}`} onClick={closeDropdown}>
                          {item.name}
                        </Link>
                        <small>
                          Qty {item.quantity} / {formatCartPrice(item.unitPrice * item.quantity)}
                        </small>
                        <div className="cart-inline-actions">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                          <button type="button" onClick={() => removeItem(item.id)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <Link className="button primary cart-view-button" to="/cart" onClick={closeDropdown}>
                  View Cart
                </Link>
              </>
            ) : (
              <div className="cart-empty">
                <p>Your cart is waiting for its first piece.</p>
                <Link className="button secondary" to="/collections/classic" onClick={closeDropdown}>
                  Browse pieces
                </Link>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default CartDropdown
