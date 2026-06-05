import { AnimatePresence, motion } from 'framer-motion'

function SplashScreen({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.48, ease: [0.37, 0, 0.63, 1] }}
        >
          <svg
            className="splash-vine splash-vine-top"
            viewBox="0 0 260 260"
            aria-hidden="true"
          >
            <path
              className="splash-vine-stem"
              d="M21 177C61 165 71 121 102 99C129 80 161 83 184 59C198 44 204 27 206 12"
            />
            <path
              className="splash-vine-stem splash-vine-fine"
              d="M72 143C91 135 106 138 121 151"
            />
            <path
              className="splash-vine-leaf"
              d="M87 116C62 107 45 119 35 142C59 149 79 139 87 116Z"
            />
            <path
              className="splash-vine-leaf"
              d="M140 84C128 59 139 39 162 27C174 51 165 73 140 84Z"
            />
            <path
              className="splash-vine-leaf"
              d="M157 72C180 68 197 79 207 101C184 107 166 96 157 72Z"
            />
          </svg>
          <svg
            className="splash-vine splash-vine-bottom"
            viewBox="0 0 260 260"
            aria-hidden="true"
          >
            <path
              className="splash-vine-stem"
              d="M21 177C61 165 71 121 102 99C129 80 161 83 184 59C198 44 204 27 206 12"
            />
            <path
              className="splash-vine-stem splash-vine-fine"
              d="M72 143C91 135 106 138 121 151"
            />
            <path
              className="splash-vine-leaf"
              d="M87 116C62 107 45 119 35 142C59 149 79 139 87 116Z"
            />
            <path
              className="splash-vine-leaf"
              d="M140 84C128 59 139 39 162 27C174 51 165 73 140 84Z"
            />
            <path
              className="splash-vine-leaf"
              d="M157 72C180 68 197 79 207 101C184 107 166 96 157 72Z"
            />
          </svg>
          <motion.div
            className="splash-intro-copy"
            initial="initial"
            animate="animate"
            transition={{
              staggerChildren: 0.36,
              delayChildren: 0.12,
            }}
          >
            <motion.p
              className="splash-title"
              variants={{
                initial: { opacity: 0, y: 10 },
                animate: { opacity: [0, 1, 1, 0], y: [10, 0, 0, -4] },
              }}
              transition={{
                duration: 1.32,
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
