import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { collections } from '../data/catalog.js'
import BrandLogo from './BrandLogo.jsx'

const navItems = [
  { label: 'Home', to: '/' },
  ...collections.map((collection) => ({
    label: collection.name,
    to: `/collections/${collection.slug}`,
  })),
  { label: 'About', to: '/about' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link className="brand-lockup" to="/" onClick={closeMenu}>
          <BrandLogo variant="nav" />
        </Link>

        <div className="desktop-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-link is-active' : 'nav-link'
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span />
          <span />
        </button>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  isActive ? 'mobile-nav-link is-active' : 'mobile-nav-link'
                }
                to={item.to}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
