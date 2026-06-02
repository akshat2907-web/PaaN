import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-media" aria-hidden="true">
        <motion.div
          className="fabric-panel panel-large"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        />
        <motion.div
          className="fabric-panel panel-small"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>

      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p className="eyebrow">Indian ethnic wear for everyday elegance</p>
        <h1 className="hero-heading">Everyday elegance, woven with heritage.</h1>
        <p className="hero-tagline">Threads of Heritage</p>
        <p className="hero-description">
          Sarees, suits, and kurta sets with calm color, natural texture, and
          heritage detail made for the life you already live.
        </p>
        <div className="hero-actions">
          <Link className="button primary" to="/collections/classic">
            Explore Classic
          </Link>
          <Link className="button secondary" to="/about">
            Our Story
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
