import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="eyebrow">404</p>
      <h1>This page has slipped out of the weave.</h1>
      <p>Return to the PaaN homepage and continue exploring the prototype.</p>
      <Link className="button primary" to="/">
        Return Home
      </Link>
    </section>
  )
}

export default NotFoundPage
