import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const leafFlow = [
  { x: '-92vw', y: '108vh', dx: '190vw', dy: '-172vh', size: 'large', tone: 'sage', rotate: -24, delay: 0 },
  { x: '-76vw', y: '98vh', dx: '178vw', dy: '-150vh', size: 'medium', tone: 'olive', rotate: 12, delay: 0.02 },
  { x: '-108vw', y: '82vh', dx: '196vw', dy: '-132vh', size: 'small', tone: 'gold', rotate: -8, delay: 0.04 },
  { x: '-64vw', y: '114vh', dx: '172vw', dy: '-182vh', size: 'medium', tone: 'sage', rotate: 22, delay: 0.06 },
  { x: '-118vw', y: '68vh', dx: '204vw', dy: '-116vh', size: 'large', tone: 'olive', rotate: -18, delay: 0.08 },
  { x: '-84vw', y: '76vh', dx: '176vw', dy: '-136vh', size: 'small', tone: 'sage', rotate: 8, delay: 0.1 },
  { x: '-54vw', y: '104vh', dx: '164vw', dy: '-166vh', size: 'medium', tone: 'gold', rotate: -12, delay: 0.12 },
  { x: '-98vw', y: '122vh', dx: '208vw', dy: '-168vh', size: 'large', tone: 'sage', rotate: 18, delay: 0.14 },
  { x: '-42vw', y: '86vh', dx: '152vw', dy: '-142vh', size: 'small', tone: 'olive', rotate: -30, delay: 0.16 },
  { x: '-124vw', y: '96vh', dx: '214vw', dy: '-160vh', size: 'medium', tone: 'gold', rotate: 26, delay: 0.18 },
  { x: '-74vw', y: '62vh', dx: '178vw', dy: '-122vh', size: 'small', tone: 'sage', rotate: -16, delay: 0.2 },
  { x: '-48vw', y: '126vh', dx: '172vw', dy: '-194vh', size: 'large', tone: 'olive', rotate: 6, delay: 0.22 },
  { x: '-112vw', y: '132vh', dx: '224vw', dy: '-198vh', size: 'medium', tone: 'sage', rotate: -22, delay: 0.24 },
  { x: '-28vw', y: '110vh', dx: '150vw', dy: '-176vh', size: 'small', tone: 'gold', rotate: 18, delay: 0.26 },
  { x: '-132vw', y: '74vh', dx: '222vw', dy: '-128vh', size: 'medium', tone: 'olive', rotate: -10, delay: 0.28 },
  { x: '-86vw', y: '142vh', dx: '202vw', dy: '-202vh', size: 'small', tone: 'sage', rotate: 28, delay: 0.3 },
  { x: '-60vw', y: '70vh', dx: '168vw', dy: '-132vh', size: 'medium', tone: 'gold', rotate: -26, delay: 0.32 },
  { x: '-116vw', y: '116vh', dx: '236vw', dy: '-180vh', size: 'large', tone: 'sage', rotate: 14, delay: 0.34 },
  { x: '-100vw', y: '92vh', dx: '210vw', dy: '-146vh', size: 'small', tone: 'olive', rotate: -4, delay: 0.36 },
  { x: '-72vw', y: '128vh', dx: '188vw', dy: '-188vh', size: 'medium', tone: 'gold', rotate: 24, delay: 0.38 },
  { x: '-138vw', y: '104vh', dx: '242vw', dy: '-160vh', size: 'small', tone: 'sage', rotate: -32, delay: 0.4 },
  { x: '-36vw', y: '96vh', dx: '160vw', dy: '-162vh', size: 'medium', tone: 'olive', rotate: 10, delay: 0.42 },
  { x: '-118vw', y: '144vh', dx: '240vw', dy: '-212vh', size: 'large', tone: 'gold', rotate: -14, delay: 0.44 },
  { x: '-52vw', y: '54vh', dx: '166vw', dy: '-118vh', size: 'small', tone: 'sage', rotate: 30, delay: 0.46 },
]

function FlowLeaf({ leaf, index, onFlowComplete }) {
  return (
    <motion.svg
      className={`transition-leaf transition-leaf-${leaf.size} transition-leaf-${leaf.tone}`}
      viewBox="0 0 120 150"
      aria-hidden="true"
      onAnimationComplete={onFlowComplete}
      initial={{
        opacity: 0,
        x: leaf.x,
        y: leaf.y,
        rotate: leaf.rotate,
        scale: 0.88,
      }}
      animate={{
        opacity: [0, 0.74, 0.78, 0],
        x: `calc(${leaf.x} + ${leaf.dx})`,
        y: `calc(${leaf.y} + ${leaf.dy})`,
        rotate: leaf.rotate + (index % 2 === 0 ? 16 : -16),
        scale: [0.88, 1, 1.04, 0.96],
      }}
      transition={{
        duration: 1.88,
        delay: leaf.delay * 0.74,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <path
        className="transition-leaf-shape"
        d="M60 138C28 108 12 75 21 47C29 20 52 9 86 13C106 43 104 75 90 101C80 119 67 132 60 138Z"
      />
      <path
        className="transition-leaf-vein"
        d="M60 136C60 103 61 64 86 14"
      />
      <path
        className="transition-leaf-vein transition-leaf-vein-soft"
        d="M61 101C45 93 34 82 25 66M64 84C80 78 91 68 101 55M62 66C49 58 40 48 33 36"
      />
    </motion.svg>
  )
}

function CollectionTransition({ isPresent, collection, onTransitionComplete }) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isPresent) {
      setShouldRender(true)
      return undefined
    }

    setShouldRender(false)
  }, [isPresent, onTransitionComplete])

  if (!shouldRender) return null

  return (
    <motion.div
      className={`collection-transition-overlay collection-transition-${collection || 'classic'}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      aria-hidden="true"
    >
      <motion.div
        className="transition-leaf-wash"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.82, 0.52, 0] }}
        transition={{ duration: 1.82, times: [0, 0.12, 0.5, 1], ease: 'easeInOut' }}
      />
      <div className="transition-leaf-field">
        {leafFlow.map((leaf, index) => (
          <FlowLeaf
            key={`${leaf.tone}-${leaf.x}-${leaf.y}`}
            leaf={leaf}
            index={index}
            onFlowComplete={
              index === leafFlow.length - 1
                ? () => {
                    onTransitionComplete?.()
                    setShouldRender(false)
                  }
                : undefined
            }
          />
        ))}
      </div>
    </motion.div>
  )
}

export default CollectionTransition
