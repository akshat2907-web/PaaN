import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard.jsx'
import CollectionsSection from '../components/sections/CollectionsSection.jsx'
import FounderSection from '../components/sections/FounderSection.jsx'
import HeroSection from '../components/sections/HeroSection.jsx'
import { products } from '../data/catalog.js'
import { fetchPublicSiteAssets } from '../lib/siteAssetsApi.js'

const categoryItems = ['Sarees', 'Suits', 'Kurta Sets', 'Traditional Wear']

function HomePage() {
  const featuredProducts = products.slice(0, 6)
  const [heroAssets, setHeroAssets] = useState({})

  useEffect(() => {
    let isMounted = true

    async function loadHeroAssets() {
      try {
        const assets = await fetchPublicSiteAssets([
          'home_hero_main',
          'home_hero_secondary',
        ])
        if (isMounted) setHeroAssets(assets)
      } catch {
        if (isMounted) setHeroAssets({})
      }
    }

    loadHeroAssets()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <HeroSection
        mainAsset={heroAssets.home_hero_main}
        secondaryAsset={heroAssets.home_hero_secondary}
      />

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
          <p className="eyebrow">Featured pieces</p>
          <h2>Curated pieces from across the collections</h2>
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
          Discover the brand, browse three collection moods, and find pieces
          shaped for office mornings, family visits, pujas, and slow weekends.
        </p>
      </section>

      <FounderSection />
    </>
  )
}

export default HomePage
