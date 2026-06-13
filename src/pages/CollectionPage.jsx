import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from '../components/ProductCard.jsx'
import {
  getCollectionBySlug,
  getProductsByCollection,
} from '../data/catalog.js'
import { fetchPublishedProductsByCollection } from '../lib/productsApi.js'

const collectionFeaturePills = {
  classic: ['Breathable cottons', 'Everyday drape', 'Handpicked weaves'],
  premium: ['Refined textures', 'Festive elegance', 'Elevated craft'],
  exclusive: ['Limited pieces', 'Collector stories', 'Rare weaves'],
}

function CollectionPage() {
  const { slug } = useParams()
  const collection = getCollectionBySlug(slug)
  const [supabaseProducts, setSupabaseProducts] = useState([])
  const [shouldUseFallback, setShouldUseFallback] = useState(true)
  const [heroSlide, setHeroSlide] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      if (!collection) return

      try {
        const products = await fetchPublishedProductsByCollection(collection.slug)
        if (!isMounted) return

        setSupabaseProducts(products)
        setShouldUseFallback(products.length === 0)
      } catch {
        if (!isMounted) return
        setSupabaseProducts([])
        setShouldUseFallback(true)
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [collection])

  const heroImages = supabaseProducts
    .flatMap((product) => product.media || product.productMedia || product.images || [])
    .filter((item) => (item.media_type || item.mediaType || 'image') === 'image')
    .map((item) => ({
      id: item.id || item.image_url || item.imageUrl,
      imageUrl: item.image_url || item.imageUrl,
      altText: item.alt_text || item.altText || collection?.name || 'PaaN collection',
    }))
    .filter((item) => item.imageUrl)
  const hasHeroImages = heroImages.length > 0
  const featurePills = collectionFeaturePills[collection?.slug] || []

  useEffect(() => {
    setHeroSlide(0)
  }, [collection?.slug, heroImages.length])

  useEffect(() => {
    if (heroImages.length < 2) return undefined

    const timer = setInterval(() => {
      setHeroSlide((currentSlide) => (currentSlide + 1) % heroImages.length)
    }, 6200)

    return () => clearInterval(timer)
  }, [heroImages.length])

  if (!collection) {
    return (
      <section className="not-found">
        <p className="eyebrow">Collection not found</p>
        <h1>This collection is still being woven.</h1>
        <Link className="button primary" to="/">
          Return Home
        </Link>
      </section>
    )
  }

  const collectionProducts = shouldUseFallback
    ? getProductsByCollection(collection.slug)
    : supabaseProducts

  return (
    <>
      <section className={`collection-page-hero accent-${collection.accent}`}>
        <motion.div
          className="collection-hero-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="eyebrow">{collection.eyebrow}</p>
          <h1>{collection.name}</h1>
          <p>{collection.longDescription}</p>
          <div className="collection-hero-pills" aria-label={`${collection.name} features`}>
            {featurePills.map((pill) => (
              <span key={pill}>{pill}</span>
            ))}
          </div>
        </motion.div>
        <motion.div
          className={`collection-hero-image ${hasHeroImages ? 'has-slideshow' : ''}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {hasHeroImages ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={heroImages[heroSlide]?.id || heroImages[heroSlide]?.imageUrl}
                src={heroImages[heroSlide]?.imageUrl}
                alt={heroImages[heroSlide]?.altText || collection.name}
                initial={{ opacity: 0, scale: 1.035 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                loading="lazy"
              />
            </AnimatePresence>
          ) : (
            <span>{collection.mood}</span>
          )}
        </motion.div>
      </section>

      <section className="section collection-intro">
        <div>
          <p className="eyebrow">Collection note</p>
          <h2>{collection.headline}</h2>
        </div>
        <p>{collection.description}</p>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">In this collection</p>
          <h2>{collection.name} pieces</h2>
        </div>
        <div className="product-grid">
          {collectionProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index} 
            />
          ))}
        </div>
      </section>

      <section className="styling-note">
        <p className="eyebrow">How it feels</p>
        <h2>
          Pieces chosen for ease, craft, and quiet presence — made to browse
          slowly and return to often.
        </h2>
      </section>

    </>
  )
}

export default CollectionPage
