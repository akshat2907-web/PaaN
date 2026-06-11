import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatCartPrice, useCart } from '../context/CartContext.jsx'

function CartPage() {
  const { items, formattedSubtotal, updateQuantity, removeItem, clearCart } = useCart()

  if (!items.length) {
    return (
      <section className="cart-page cart-page-empty">
        <p className="eyebrow">Cart</p>
        <h1>Your cart is empty.</h1>
        <p>Explore the collections and add the pieces you would like to revisit.</p>
        <Link className="button primary" to="/collections/classic">
          Browse pieces
        </Link>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <header className="cart-page-header">
        <div>
          <p className="eyebrow">Cart</p>
          <h1>Your selected pieces</h1>
        </div>
        <button className="button secondary" type="button" onClick={clearCart}>
          Clear cart
        </button>
      </header>

      <div className="cart-page-layout">
        <div className="cart-page-list">
          {items.map((item, index) => (
            <motion.article
              className="cart-page-item"
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, delay: index * 0.04 }}
            >
              <Link className="cart-page-image" to={`/products/${item.slug}`}>
                {item.image ? <img src={item.image} alt={item.name} /> : null}
              </Link>

              <div className="cart-page-copy">
                <Link to={`/products/${item.slug}`}>
                  <h2>{item.name}</h2>
                </Link>
                <p>{item.displayPrice}</p>
                <div className="cart-quantity-control">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-page-line-total">
                <strong>{formatCartPrice(item.unitPrice * item.quantity)}</strong>
                <button type="button" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <aside className="cart-summary">
          <p className="eyebrow">Subtotal</p>
          <strong>{formattedSubtotal}</strong>
          <p>Checkout will arrive in a later phase. For now, this keeps your edit close.</p>
          <Link className="button secondary" to="/collections/classic">
            Continue browsing
          </Link>
        </aside>
      </div>
    </section>
  )
}

export default CartPage
