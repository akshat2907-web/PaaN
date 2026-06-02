import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

function CollectionCard({ collection, index = 0 }) {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    // 5-8 second slow editorial fade (using 6.5s here)
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % 3)
    }, 6500)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.article
      className={`collection-card accent-${collection.accent}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={`/collections/${collection.slug}`}>
        <div className="collection-image" style={{ position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                background: slide === 1 
                  ? 'linear-gradient(0deg, rgba(15, 61, 34, 0.05), transparent)' 
                  : slide === 2 
                  ? 'linear-gradient(180deg, rgba(181, 148, 74, 0.08), transparent)' 
                  : 'transparent',
                zIndex: 0
              }}
            />
          </AnimatePresence>
          <span style={{ position: 'relative', zIndex: 1 }}>{collection.name}</span>
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
