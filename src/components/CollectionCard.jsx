import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

function CollectionCard({ collection, index = 0, slides = [] }) {
  const [slide, setSlide] = useState(0)
  const hasSlides = slides.length > 0

  useEffect(() => {
    if (slides.length < 2) return undefined

    const timer = setInterval(() => {
      setSlide((currentSlide) => (currentSlide + 1) % slides.length)
    }, 6500)

    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    setSlide(0)
  }, [collection.slug, slides.length])

  return (
    <motion.article
      className={`collection-card accent-${collection.accent}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={`/collections/${collection.slug}`}>
        <div className={`collection-image ${hasSlides ? 'has-slideshow' : ''}`}>
          {hasSlides ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={slides[slide]?.id || slides[slide]?.imageUrl}
                src={slides[slide]?.imageUrl}
                alt={slides[slide]?.altText || collection.name}
                initial={{ opacity: 0, scale: 1.035 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
                loading="lazy"
              />
            </AnimatePresence>
          ) : null}
          <span>{collection.name}</span>
        </div>
        <div className="collection-card-copy">
          <p>{collection.eyebrow}</p>
          <h3>{collection.headline}</h3>
          <span>Explore {collection.name}</span>
        </div>
      </Link>
    </motion.article>
  )
}

export default CollectionCard
