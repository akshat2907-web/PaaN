import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const lineEase = [0.37, 0, 0.63, 1]
const softEase = [0.22, 1, 0.36, 1]

const leafVariants = {
  initial: ({ rotate }) => ({ opacity: 0, y: 6, rotate: rotate - 4, scale: 0.82 }),
  animate: ({ delay, rotate }) => ({
    opacity: [0, 0.92, 0.92, 0],
    y: [6, 0, 0, -2],
    rotate,
    scale: [0.82, 1, 1, 0.96],
    transition: {
      duration: 1.08,
      times: [0, 0.34, 0.8, 1],
      delay,
      ease: softEase,
    },
  }),
}

const stemVariants = {
  initial: { opacity: 0, pathLength: 0 },
  animate: {
    opacity: [0, 0.68, 0.68, 0],
    pathLength: [0, 1, 1, 1],
    transition: {
      duration: 1.08,
      times: [0, 0.38, 0.82, 1],
      delay: 0.42,
      ease: lineEase,
    },
  },
}

function WordmarkLeaves() {
  return (
    <motion.svg
      className="splash-logo-leaves"
      viewBox="0 0 118 100"
      aria-hidden="true"
      initial="initial"
      animate="animate"
    >
      <motion.path
        className="splash-logo-stem splash-logo-stem-lower"
        d="M18 80C34 67 51 59 72 55"
        variants={stemVariants}
      />
      <motion.path
        className="splash-logo-stem splash-logo-stem-upper"
        d="M18 80C30 59 48 42 70 30"
        variants={stemVariants}
      />
      <motion.path
        className="splash-logo-leaf splash-logo-leaf-lower"
        d="M70 56C88 34 111 39 116 62C103 88 80 85 70 56Z"
        custom={{ delay: 0.76, rotate: 45 }}
        variants={leafVariants}
      />
      <motion.path
        className="splash-logo-leaf splash-logo-leaf-upper"
        d="M69 31C69 6 91 1 110 16C111 43 88 52 69 31Z"
        custom={{ delay: 0.9, rotate: 125 }}
        variants={leafVariants}
      />
      <motion.path
        className="splash-logo-leaf-vein"
        d="M78 57C91 58 104 60 116 62M76 31C86 24 98 19 110 16"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{
          opacity: [0, 0.46, 0.46, 0],
          pathLength: [0, 1, 1, 1],
        }}
        transition={{
          duration: 0.96,
          times: [0, 0.4, 0.82, 1],
          delay: 1.02,
          ease: lineEase,
        }}
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

    const timer = window.setTimeout(() => setShouldRender(false), 900)
    return () => window.clearTimeout(timer)
  }, [isVisible])

  return (
    <AnimatePresence>
      {shouldRender ? (
        <motion.div
          className="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.48, ease: lineEase }}
        >
          <motion.div className="splash-intro-copy">
            <div className="splash-wordmark">
              <motion.p
                className="splash-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -4] }}
                transition={{
                  duration: 1.7,
                  times: [0, 0.28, 0.78, 1],
                  delay: 0.12,
                  ease: lineEase,
                }}
              >
                PaaN
              </motion.p>
              <WordmarkLeaves />
            </div>
            <motion.p
              className="splash-tagline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -3] }}
              transition={{
                duration: 0.96,
                times: [0, 0.34, 0.72, 1],
                delay: 1.12,
                ease: lineEase,
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
