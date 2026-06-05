import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const lineEase = [0.37, 0, 0.63, 1]
const softEase = [0.22, 1, 0.36, 1]

const logoVineStem = {
  initial: { opacity: 0, pathLength: 0 },
  animate: {
    opacity: [0, 0.9, 0.9, 0],
    pathLength: [0, 1, 1, 1],
    transition: {
      duration: 1.38,
      times: [0, 0.48, 0.82, 1],
      delay: 0.52,
      ease: lineEase,
    },
  },
}

const logoVineDetail = {
  initial: { opacity: 0, pathLength: 0 },
  animate: {
    opacity: [0, 0.54, 0.54, 0],
    pathLength: [0, 1, 1, 1],
    transition: {
      duration: 1.02,
      times: [0, 0.46, 0.82, 1],
      delay: 0.72,
      ease: lineEase,
    },
  },
}

const logoLeaf = {
  initial: { opacity: 0, rotate: -5, scale: 0.78 },
  animate: (delay) => ({
    opacity: [0, 0.92, 0.92, 0],
    rotate: 0,
    scale: [0.78, 1, 1, 0.96],
    transition: {
      duration: 1,
      times: [0, 0.34, 0.82, 1],
      delay,
      ease: softEase,
    },
  }),
}

function WordmarkVine() {
  return (
    <motion.svg
      className="splash-logo-vine"
      viewBox="0 0 170 132"
      aria-hidden="true"
      initial="initial"
      animate="animate"
    >
      <motion.path
        className="splash-logo-vine-stem"
        d="M10 88C29 82 38 66 49 48C58 34 69 25 82 24C99 22 108 34 104 47C101 58 88 62 78 57"
        variants={logoVineStem}
      />
      <motion.path
        className="splash-logo-vine-stem splash-logo-vine-fine"
        d="M48 49C38 39 35 26 41 13"
        variants={logoVineDetail}
      />
      <motion.path
        className="splash-logo-vine-stem splash-logo-vine-fine"
        d="M82 24C96 12 113 11 130 22"
        variants={logoVineDetail}
      />
      <motion.path
        className="splash-logo-leaf"
        d="M43 18C25 10 10 17 3 35C21 42 37 35 43 18Z"
        custom={0.86}
        variants={logoLeaf}
      />
      <motion.path
        className="splash-logo-leaf"
        d="M126 26C139 10 158 9 168 24C154 40 137 40 126 26Z"
        custom={1.02}
        variants={logoLeaf}
      />
      <motion.path
        className="splash-logo-vein"
        d="M11 33C20 28 31 23 43 18M133 26C144 25 156 25 168 24"
        variants={logoVineDetail}
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
          transition={{ duration: 0.48, ease: lineEase }}
        >
          <motion.div className="splash-intro-copy">
            <div className="splash-wordmark">
              <motion.p
                className="splash-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -4] }}
                transition={{
                  duration: 1.72,
                  times: [0, 0.28, 0.78, 1],
                  delay: 0.18,
                  ease: lineEase,
                }}
              >
                PaaN
              </motion.p>
              <WordmarkVine />
            </div>
            <motion.p
              className="splash-tagline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -3] }}
              transition={{
                duration: 0.96,
                times: [0, 0.34, 0.72, 1],
                delay: 1.22,
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
