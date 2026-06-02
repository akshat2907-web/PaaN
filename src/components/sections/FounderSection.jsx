import { motion } from 'framer-motion'
import { founderNotes } from '../../data/catalog.js'

function FounderSection({ compact = false }) {
  return (
    <section className={compact ? 'founder-section compact' : 'founder-section'}>
      <motion.div
        className="founder-portrait"
        style={{ aspectRatio: '3 / 4' }}
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <span style={{ fontSize: '32px' }}>Threads of Heritage</span>
      </motion.div>
      <motion.div
        className="founder-copy"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
      >
        <p className="eyebrow">From the founder</p>
        <h2 style={{ lineHeight: 1.15, marginBottom: '16px' }}>Heritage should feel close enough to wear every week.</h2>
        {founderNotes.map((note) => (
          <p key={note} style={{ fontSize: '18px', color: 'var(--muted)' }}>{note}</p>
        ))}
        <p style={{ marginTop: '32px', fontFamily: 'var(--serif)', color: 'var(--green-900)', fontSize: '20px' }}>
          Where Every Thread Tells a Story.
        </p>
      </motion.div>
    </section>
  )
}

export default FounderSection
