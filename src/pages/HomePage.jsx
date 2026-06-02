import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard.jsx'
import CollectionsSection from '../components/sections/CollectionsSection.jsx'
import FounderSection from '../components/sections/FounderSection.jsx'
import HeroSection from '../components/sections/HeroSection.jsx'
import { products } from '../data/catalog.js'

const categoryItems = ['Sarees', 'Suits', 'Kurta Sets', 'Traditional Wear']

function HomePage() {
  const featuredProducts = products.slice(0, 6)

  return (
    <>
      <HeroSection />

      <section className="category-strip" aria-label="Featured categories">
        {categoryItems.map((item, index) => (
          <motion.span
            key={item}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            {item}
          </motion.span>
        ))}
      </section>

      <CollectionsSection />

      <section className="section product-preview-section">
        <div className="section-heading">
          <p className="eyebrow">Sample products</p>
          <h2>A preview of the PaaN catalog experience</h2>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      <section className="story-band">
        <div>
          <p className="eyebrow">Everyday elegance</p>
          <h2>Made for office mornings, family visits, pujas, and slow weekends.</h2>
        </div>
        <p>
          Phase 1 keeps the flow editorial and navigable: visitors can discover
          the brand, browse the three collection moods, and understand PaaN
          before ecommerce features are introduced.
        </p>
      </section>

      <FounderSection />
    </>
  )
}

export default HomePage
