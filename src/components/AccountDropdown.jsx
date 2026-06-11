import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCustomerAuth } from '../context/AuthContext.jsx'

function AccountDropdown({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, profile, signOut } = useCustomerAuth()

  function closeDropdown() {
    setIsOpen(false)
    onNavigate?.()
  }

  async function handleSignOut() {
    await signOut()
    closeDropdown()
  }

  return (
    <div className="account-menu">
      <button
        className="account-menu-button"
        type="button"
        aria-label="Account menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        Account
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="account-dropdown"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            {user ? (
              <>
                <div className="account-dropdown-header">
                  <p className="eyebrow">Signed in</p>
                  <strong>{profile?.full_name || user.email}</strong>
                </div>
                <Link to="/account" onClick={closeDropdown}>
                  My Account
                </Link>
                <Link to="/account#orders" onClick={closeDropdown}>
                  My Orders
                </Link>
                <Link to="/cart" onClick={closeDropdown}>
                  Cart
                </Link>
                <button type="button" onClick={handleSignOut}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/account" onClick={closeDropdown}>
                  Sign in
                </Link>
                <Link to="/cart" onClick={closeDropdown}>
                  Cart
                </Link>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default AccountDropdown
