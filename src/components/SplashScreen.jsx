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
              Where Every Thread Tells a Story.
            </motion.p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default SplashScreen
