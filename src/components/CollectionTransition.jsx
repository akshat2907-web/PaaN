import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function CollectionTransition({ isPresent, onTransitionComplete }) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isPresent) {
      setShouldRender(true)
      const timer = setTimeout(() => {
        onTransitionComplete?.()
        setShouldRender(false)
      }, 900) // matches transition duration
      return () => clearTimeout(timer)
    }
  }, [isPresent, onTransitionComplete])

  if (!shouldRender) return null

  return (
    <motion.div
      className="collection-transition-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      <motion.div
        className="transition-fabric"
        initial={{ scaleX: 1, opacity: 0 }}
        animate={{ scaleX: 1.05, opacity: 0.15 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
      <motion.div
        className="transition-leaves"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 20, opacity: 0.1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

export default CollectionTransition
