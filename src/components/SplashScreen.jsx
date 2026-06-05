import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const vineStem = {
  initial: { opacity: 0.32, pathLength: 0 },
  animate: {
    opacity: 0.86,
    pathLength: 1,
    transition: { duration: 0.92, delay: 0.08, ease: [0.37, 0, 0.63, 1] },
  },
}

const vineDetail = {
  initial: { opacity: 0, pathLength: 0 },
  animate: {
    opacity: 0.62,
    pathLength: 1,
    transition: { duration: 0.72, delay: 0.36, ease: [0.37, 0, 0.63, 1] },
  },
}

const vineLeaf = {
  initial: { opacity: 0, rotate: -4, scale: 0.78 },
  animate: (index) => ({
    opacity: 0.92,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.48,
      delay: 0.52 + index * 0.13,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

function BotanicalVine({ className }) {
  return (
    <motion.svg
      className={`splash-vine ${className}`}
      viewBox="0 0 320 320"
      aria-hidden="true"
      initial="initial"
      animate="animate"
    >
      <motion.path
        className="splash-vine-stem splash-vine-stem-main"
        d="M26 246C70 232 77 184 112 151C143 122 180 118 213 85C238 60 249 32 252 12"
        variants={vineStem}
      />
      <motion.path
        className="splash-vine-stem splash-vine-stem-main"
        d="M58 210C92 205 111 219 132 244"
        variants={vineDetail}
      />
      <motion.path
        className="splash-vine-stem splash-vine-fine"
        d="M111 153C126 133 126 111 115 91"
        variants={vineDetail}
      />
      <motion.path
        className="splash-vine-stem splash-vine-fine"
        d="M178 115C203 113 222 126 237 151"
        variants={vineDetail}
      />
      <motion.path
        className="splash-vine-stem splash-vine-fine"
        d="M216 82C204 63 205 43 219 22"
        variants={vineDetail}
      />
      <motion.path
        className="splash-vine-leaf"
        d="M92 159C58 144 36 158 23 190C58 199 84 187 92 159Z"
        custom={0}
        variants={vineLeaf}
      />
      <motion.path
        className="splash-vine-leaf splash-vine-leaf-small"
        d="M124 132C105 105 113 78 142 60C159 91 151 118 124 132Z"
        custom={1}
        variants={vineLeaf}
      />
      <motion.path
        className="splash-vine-leaf"
        d="M180 108C203 84 233 87 257 109C233 132 203 132 180 108Z"
        custom={2}
        variants={vineLeaf}
      />
      <motion.path
        className="splash-vine-leaf splash-vine-leaf-small"
        d="M218 76C204 48 214 25 242 10C256 39 247 64 218 76Z"
        custom={3}
        variants={vineLeaf}
      />
      <motion.path
        className="splash-vine-vein"
        d="M36 185C53 177 70 170 91 159M132 123C134 104 137 84 142 60M194 106C213 108 235 109 257 109M226 68C232 49 237 29 242 10"
        variants={vineDetail}
      />
    </motion.svg>
  )
}

function SplashScreen({ isVisible }) {
  const [shouldRender, setShouldRender] = useState(isVisible)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      return undefined
    }

    const timer = window.setTimeout(() => setShouldRender(false), 600)
    return () => window.clearTimeout(timer)
  }, [isVisible])

  return (
    <AnimatePresence>
      {shouldRender ? (
        <motion.div
          className="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.48, ease: [0.37, 0, 0.63, 1] }}
        >
          <BotanicalVine className="splash-vine-top" />
          <BotanicalVine className="splash-vine-bottom" />
          <motion.div
            className="splash-intro-copy"
            initial="initial"
            animate="animate"
            transition={{
              staggerChildren: 0.32,
              delayChildren: 0.88,
            }}
          >
            <motion.p
              className="splash-title"
              variants={{
                initial: { opacity: 0, y: 10 },
                animate: { opacity: [0, 1, 1, 0], y: [10, 0, 0, -4] },
              }}
              transition={{
                duration: 1.42,
                times: [0, 0.32, 0.78, 1],
                ease: [0.37, 0, 0.63, 1],
              }}
            >
              PaaN
            </motion.p>
            <motion.p
              className="splash-tagline"
              variants={{
                initial: { opacity: 0, y: 8 },
                animate: { opacity: [0, 1, 1, 0], y: [8, 0, 0, -3] },
              }}
              transition={{
                duration: 0.96,
                times: [0, 0.34, 0.72, 1],
                ease: [0.37, 0, 0.63, 1],
              }}
            >
              Stories of Luxury, Shaped on the Loom.
            </motion.p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default SplashScreen
