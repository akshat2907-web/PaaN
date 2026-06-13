import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCustomerAuth } from '../context/AuthContext.jsx'

function AccountPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, saveProfile } = useCustomerAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const nextPath = new URLSearchParams(location.search).get('next')

  useEffect(() => {
    setFullName(profile?.full_name || '')
    setEmail(profile?.email || '')
    setPhone(profile?.phone || '')
    setAddress(profile?.address || '')
  }, [profile])

  async function handleSaveProfile(event) {
    event.preventDefault()
    setIsSaving(true)
    setStatusMessage('')

    try {
      await saveProfile({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      })
      setStatusMessage('Details saved.')

      if (nextPath?.startsWith('/')) {
        navigate(nextPath)
      }
    } catch (error) {
      setStatusMessage(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="account-page">
      <header className="account-header">
        <div>
          <p className="eyebrow">Customer details</p>
          <h1>Your PaaN enquiry profile</h1>
          <p>Save your contact details once so enquiries can include them gracefully.</p>
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
            Full name
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Phone
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </label>
          <label>
            Address <span>Optional</span>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows="4"
            />
          </label>

          <button className="button primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save details'}
          </button>
          {statusMessage ? <p className="account-message">{statusMessage}</p> : null}
        </motion.form>

        <aside className="account-panel account-orders-placeholder" id="orders">
          <p className="eyebrow">Enquiry profile</p>
          <h2>No password or customer login yet.</h2>
          <p>
            These details stay on this device and are used only to prefill your
            product enquiries for now.
          </p>
        </aside>
      </div>
    </section>
  )
}

export default AccountPage
