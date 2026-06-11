import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  getCollectionBySlug,
  getProductById,
} from '../data/catalog.js'
import { fetchPublishedProduct } from '../lib/productsApi.js'
import { useCart } from '../context/CartContext.jsx'

function ProductPage() {
  const { productId } = useParams()
  const { addItem } = useCart()
  const [cartMessage, setCartMessage] = useState('')
  const fallbackProduct = getProductById(productId)
  const [supabaseProduct, setSupabaseProduct] = useState(null)
  const [shouldUseFallback, setShouldUseFallback] = useState(true)
  const [isLoading, setIsLoading] = useState(!fallbackProduct)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const product = shouldUseFallback ? fallbackProduct : supabaseProduct
  const collection = product ? getCollectionBySlug(product.collection) : null
  const productImages = product?.images?.length
    ? product.images
    : product?.imageUrl
      ? [{ id: `${product.id}-image`, image_url: product.imageUrl, alt_text: product.name }]
      : []
  const selectedImage = productImages[selectedImageIndex] || productImages[0]

  useEffect(() => {
    let isMounted = true

    async function loadProduct() {
      setIsLoading(!fallbackProduct)

      try {
        const productData = await fetchPublishedProduct(productId)
        if (!isMounted) return

        setSupabaseProduct(productData)
        setShouldUseFallback(!productData)
        setIsLoading(false)
      } catch {
        if (!isMounted) return
        setSupabaseProduct(null)
        setShouldUseFallback(true)
        setIsLoading(false)
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [fallbackProduct, productId])

  useEffect(() => {
    setSelectedImageIndex(0)
    setCartMessage('')
  }, [productId, product?.id])

  function handleAddToCart() {
    addItem(product)
    setCartMessage('Added to cart.')
  }

  if (!product && isLoading) {
    return (
      <section className="not-found">
        <p className="eyebrow">Loading piece</p>
        <h1>Preparing the edit.</h1>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="not-found">
        <p className="eyebrow">Piece not found</p>
        <h1>This piece is no longer in the edit.</h1>
        <Link className="button primary" to="/">
          Return Home
        </Link>
      </section>
    )
  }

  return (
    <section className="product-detail-page">
      <motion.div
        className="product-gallery"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      >
        {productImages.length > 1 ? (
          <div className="product-gallery-thumbnails" aria-label="Product images">
            {productImages.map((image, index) => (
              <button
                className={`product-gallery-thumbnail ${
                  index === selectedImageIndex ? 'is-active' : ''
                }`}
                key={image.id || image.image_url}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                aria-label={`View image ${index + 1} of ${product.name}`}
                aria-pressed={index === selectedImageIndex}
              >
                <img src={image.image_url} alt={image.alt_text || product.name} />
              </button>
            ))}
          </div>
        ) : null}

        <div className={`product-detail-image textile-${product.tone}`}>
          {selectedImage ? (
            <img src={selectedImage.image_url} alt={selectedImage.alt_text || product.name} />
          ) : null}
          <span>{product.category}</span>
        </div>
      </motion.div>

      <motion.div
        className="product-detail-copy"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.52, delay: 0.08 }}
      >
        <p className="eyebrow">
          {collection ? collection.name : 'PaaN'} / {product.fabric}
        </p>
        <h1>{product.name}</h1>
        <span className="product-detail-price">{product.price}</span>

        <div className="product-detail-divider" />

        <div className="product-detail-section">
          <h2>About this piece</h2>
          <p>{product.description}</p>
        </div>

        {product.craftNote ? (
          <div className="product-detail-section">
            <h2>Craft note</h2>
            <p>{product.craftNote}</p>
          </div>
        ) : null}

        {product.occasion ? (
          <div className="product-detail-section">
            <h2>Occasion</h2>
            <p>{product.occasion}</p>
          </div>
        ) : null}

        <div className="product-detail-actions">
          <button className="button primary" type="button" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <Link
            className="button secondary"
            to={collection ? `/collections/${collection.slug}` : '/'}
          >
            Back to collection
          </Link>
        </div>
        {cartMessage ? <p className="product-cart-message">{cartMessage}</p> : null}
      </motion.div>
    </section>
  )
}

export default ProductPage
