import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCustomerAuth } from '../context/AuthContext.jsx'
import { isSupabaseConfigured } from '../lib/supabase.js'

function AccountPage() {
  const { user, profile, isAuthLoading, sendMagicLink, saveProfile } = useCustomerAuth()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setFullName(profile?.full_name || '')
    setPhone(profile?.phone || '')
  }, [profile])

  async function handleMagicLink(event) {
    event.preventDefault()
    setIsSaving(true)
    setStatusMessage('')

    try {
      await sendMagicLink(email)
      setStatusMessage('Magic link sent. Check your email to sign in.')
    } catch (error) {
      setStatusMessage(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSaveProfile(event) {
    event.preventDefault()
    setIsSaving(true)
    setStatusMessage('')

    try {
      await saveProfile({ full_name: fullName, phone })
      setStatusMessage('Profile saved.')
    } catch (error) {
      setStatusMessage(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <section className="account-page account-page-narrow">
        <p className="eyebrow">Account</p>
        <h1>Customer sign in is not configured.</h1>
        <p>Add the Supabase environment variables to enable account access.</p>
      </section>
    )
  }

  if (isAuthLoading) {
    return (
      <section className="account-page account-page-narrow">
        <p className="eyebrow">Account</p>
        <h1>Loading your account.</h1>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="account-page account-page-narrow">
        <motion.div
          className="account-panel"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="eyebrow">Customer account</p>
          <h1>Sign in with a magic link.</h1>
          <p>No password needed. We will send a secure link to your email.</p>

          <form className="account-form" onSubmit={handleMagicLink}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <button className="button primary" type="submit" disabled={isSaving}>
              {isSaving ? 'Sending...' : 'Send magic link'}
            </button>
          </form>

          {statusMessage ? <p className="account-message">{statusMessage}</p> : null}
        </motion.div>
      </section>
    )
  }

  return (
    <section className="account-page">
      <header className="account-header">
        <div>
          <p className="eyebrow">My Account</p>
          <h1>Your PaaN account</h1>
          <p>{user.email}</p>
        </div>
        <Link className="button secondary" to="/cart">
          View Cart
        </Link>
      </header>

      <div className="account-layout">
        <motion.form
          className="account-panel account-form"
          onSubmit={handleSaveProfile}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <p className="eyebrow">Profile</p>
            <h2>Contact details</h2>
          </div>

          <label>
            Email
            <input value={user.email || ''} disabled />
          </label>
          <label>
            Full name
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>
          <label>
            Phone
            <input value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <button className="button primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save profile'}
          </button>
          {statusMessage ? <p className="account-message">{statusMessage}</p> : null}
        </motion.form>

        <aside className="account-panel account-orders-placeholder" id="orders">
          <p className="eyebrow">My Orders</p>
          <h2>Orders are coming later.</h2>
          <p>
            Checkout and order history are intentionally not part of this phase.
            This space is reserved for your future purchases.
          </p>
        </aside>
      </div>
    </section>
  )
}

export default AccountPage
