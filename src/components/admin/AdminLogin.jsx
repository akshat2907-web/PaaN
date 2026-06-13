import { useState } from 'react'
import { signInAdmin } from '../../lib/adminAuth.js'

function AdminLogin({ onSignedIn }) {
  const [email, setEmail] = useState('dragonwarrior2907@gmail.com')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      await signInAdmin({ email, password })
      setMessage('Signed in.')
      onSignedIn?.()
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="admin-auth-panel">
      <p className="eyebrow">PaaN admin</p>
      <h1>Product management</h1>
      <p>
        Sign in with your Supabase admin email and password.
      </p>

      <form className="admin-form" onSubmit={handleSubmit}>
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
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button className="button primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {message ? <p className="admin-message">{message}</p> : null}
    </section>
  )
}

export default AdminLogin
