import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCustomerAuth } from '../context/AuthContext.jsx'
import { getAdminProfile, signOutAdmin } from '../lib/adminAuth.js'

function AccountDropdown({ isOpen = false, onClose, onNavigate, onToggle }) {
  const menuRef = useRef(null)
  const [adminProfile, setAdminProfile] = useState(null)
  const { user, profile, signOut } = useCustomerAuth()
  const hasSavedCustomerDetails = Boolean(user?.email)
  const isSignedIn = hasSavedCustomerDetails || Boolean(adminProfile)

  function closeDropdown() {
    onClose?.()
    onNavigate?.()
  }

  async function handleSignOut() {
    await signOut()
    if (adminProfile) {
      await signOutAdmin()
    }
    setAdminProfile(null)
    closeDropdown()
  }

  useEffect(() => {
    let isMounted = true

    async function loadAdminStatus() {
      try {
        const adminProfile = await getAdminProfile()
        if (isMounted) setAdminProfile(adminProfile)
      } catch {
        if (isMounted) setAdminProfile(null)
      }
    }

    loadAdminStatus()

    return () => {
      isMounted = false
    }
  }, [isOpen])

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
    <div className="account-menu" ref={menuRef}>
      <button
        className="account-menu-button"
        type="button"
        aria-label="Account menu"
        aria-expanded={isOpen}
        onClick={onToggle}
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
            {isSignedIn ? (
              <>
                <div className="account-dropdown-header">
                  <p className="eyebrow">Saved profile</p>
                  <strong>
                    {profile?.full_name || profile?.email || adminProfile?.email}
                  </strong>
                </div>
                <Link to="/account" onClick={closeDropdown}>
                  Customer Details
                </Link>
                <Link to="/account#orders" onClick={closeDropdown}>
                  Enquiry Profile
                </Link>
                <Link to="/cart" onClick={closeDropdown}>
                  Cart
                </Link>
                {adminProfile ? (
                  <Link to="/admin" onClick={closeDropdown}>
                    Admin Dashboard
                  </Link>
                ) : null}
                <button type="button" onClick={handleSignOut}>
                  Clear details
                </button>
              </>
            ) : (
              <>
                <Link to="/account" onClick={closeDropdown}>
                  Customer Details
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
