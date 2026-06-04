import { motion } from 'framer-motion'
import FounderSection from '../components/sections/FounderSection.jsx'

const values = [
  {
    title: 'Rooted craft',
    copy: 'Motifs, textures, and fabric choices that nod to Indian handwork without becoming costume-like.',
  },
  {
    title: 'Daily grace',
    copy: 'Silhouettes selected for comfort, movement, and repeat wear across ordinary routines.',
  },
  {
    title: 'Quiet occasion',
    copy: 'A restrained approach to festive dressing that stays elegant without bridal heaviness.',
  },
]

function AboutPage() {
  return (
    <>
      <section className="page-hero about-hero">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="eyebrow">About PaaN</p>
          <h1>Traditional Indian wear with a calm everyday rhythm.</h1>
          <p>
            PaaN is imagined as a wardrobe of sarees, suits, and kurta sets that
            keep heritage visible in daily life. The mood is soft, rooted, and
            feminine without leaning into bridal spectacle.
          </p>
        </motion.div>
      </section>

      <section className="section about-grid">
        <div className="about-image textile-sage">
          <span>Threads of Heritage</span>
        </div>
        <div className="about-copy">
          <p className="eyebrow">Brand direction</p>
          <h2>Inspired by the PaaN leaf, the identity balances nature and memory.</h2>
          <p>
            The cream base creates warmth and openness, the green gives the
            brand its organic signature, and muted gold adds just enough craft
            detail. The website follows the same balance: breathable layouts,
            tactile textures, and gentle motion.
          </p>
        </div>
      </section>

      <section className="section values-section">
        {values.map((value, index) => (
          <motion.article
            key={value.title}
            className="value-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.1, duration: 0.45 }}
          >
            <span>0{index + 1}</span>
            <h2>{value.title}</h2>
            <p>{value.copy}</p>
          </motion.article>
        ))}
      </section>

      <FounderSection compact />
    </>
  )
}

export default AboutPage
