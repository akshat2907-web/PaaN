import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const heroCopyVariants = {
  initial: {},
  animate: {
    transition: {
      delayChildren: 0.94,
      staggerChildren: 0.08,
    },
  },
}

const heroTextVariants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.64, ease: [0.22, 1, 0.36, 1] },
  },
}

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-media" aria-hidden="true">
        <motion.div
          className="fabric-panel panel-large"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.82, delay: 0.82, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="fabric-panel panel-small"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.82, delay: 0.94, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <motion.div
        className="hero-copy"
        variants={heroCopyVariants}
        initial="initial"
        animate="animate"
      >
        <motion.p className="eyebrow" variants={heroTextVariants}>
          Indian ethnic wear for everyday elegance
        </motion.p>
        <motion.h1 className="hero-heading" variants={heroTextVariants}>
          Everyday elegance, woven with heritage.
        </motion.h1>
        <motion.p className="hero-tagline" variants={heroTextVariants}>
          Threads of Heritage
        </motion.p>
        <motion.p className="hero-description" variants={heroTextVariants}>
          Sarees, suits, and kurta sets with calm color, natural texture, and
          heritage detail made for the life you already live.
        </motion.p>
        <motion.div className="hero-actions" variants={heroTextVariants}>
          <Link className="button primary" to="/collections/classic">
            Explore Classic
          </Link>
          <Link className="button secondary" to="/about">
            Our Story
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection
