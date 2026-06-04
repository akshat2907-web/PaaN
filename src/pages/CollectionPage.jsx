import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard.jsx'
import {
  getCollectionBySlug,
  getProductsByCollection,
} from '../data/catalog.js'
import ProductModal from '../components/ProductModal.jsx'

function CollectionPage() {
  const { slug } = useParams()
  const collection = getCollectionBySlug(slug)
  const [selectedProduct, setSelectedProduct] = useState(null)

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

  const collectionProducts = getProductsByCollection(collection.slug)

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
          <span>{collection.heroNote}</span>
        </motion.div>
        <motion.div
          className="collection-hero-image"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span>{collection.mood}</span>
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
              onClick={() => setSelectedProduct(product)}
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

      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </>
  )
}

export default CollectionPage
