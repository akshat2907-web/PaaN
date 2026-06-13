import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  getCollectionBySlug,
  getProductById,
} from '../data/catalog.js'
import { fetchPublishedProduct } from '../lib/productsApi.js'
import { getStoredCustomerDetails, hasStoredCustomerDetails } from '../context/AuthContext.jsx'

const productTypeLabels = {
  saree: 'SAREE',
  kurta_set: 'KURTA SET',
  suit: 'SUIT',
}

function normalizeProductMedia(product) {
  if (!product) return []

  const galleryMedia = product.media?.length
    ? product.media
    : product.images?.length
      ? product.images
    : product.imageUrl
      ? [{ id: `${product.id}-image`, image_url: product.imageUrl, alt_text: product.name }]
      : []

  return galleryMedia
    .map((item, index) => ({
      id: item.id || `${product.id}-media-${index}`,
      media_type: item.media_type || item.mediaType || 'image',
      image_url: item.image_url || item.imageUrl || item.url || '',
      thumbnail_url: item.thumbnail_url || item.thumbnailUrl || item.image_url || item.imageUrl || '',
      alt_text: item.alt_text || item.altText || product.name,
    }))
    .filter((item) => item.image_url)
}

function ProductPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const fallbackProduct = getProductById(productId)
  const [supabaseProduct, setSupabaseProduct] = useState(null)
  const [shouldUseFallback, setShouldUseFallback] = useState(true)
  const [isLoading, setIsLoading] = useState(!fallbackProduct)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [selectedVariantId, setSelectedVariantId] = useState('')
  const product = shouldUseFallback ? fallbackProduct : supabaseProduct
  const collection = product ? getCollectionBySlug(product.collection) : null
  const variants = product?.variants || []
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId)
  const variantMedia = selectedVariant?.media?.length
    ? normalizeProductMedia({ ...product, media: selectedVariant.media })
    : []
  const productMedia = normalizeProductMedia(product)
  const galleryMedia = variantMedia.length ? variantMedia : productMedia
  const hasMultipleMedia = galleryMedia.length > 1
  const selectedMedia = galleryMedia[selectedMediaIndex] || galleryMedia[0]
  const displayPrice = selectedVariant?.priceOverride
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: Number.isInteger(Number(selectedVariant.priceOverride)) ? 0 : 2,
      }).format(Number(selectedVariant.priceOverride))
    : product?.price
  const productTypeBadge =
    productTypeLabels[product?.product_type || product?.productType] || product?.category

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
    setSelectedMediaIndex(0)
    setSelectedVariantId('')
  }, [productId, product?.id])

  useEffect(() => {
    if (selectedMediaIndex >= galleryMedia.length) {
      setSelectedMediaIndex(0)
    }
  }, [galleryMedia.length, selectedMediaIndex])

  useEffect(() => {
    setSelectedMediaIndex(0)
  }, [selectedVariantId])

  function handleWhatsAppEnquiry() {
    const productUrl = typeof window !== 'undefined' ? window.location.href : ''
    if (!hasStoredCustomerDetails()) {
      const nextPath = `${window.location.pathname}${window.location.search}`
      navigate(`/account?next=${encodeURIComponent(nextPath)}`)
      return
    }

    const customerDetails = getStoredCustomerDetails()
    const message = [
      'Hello PaaN,',
      '',
      'I would like to enquire about this piece:',
      `Product: ${product.name}`,
      `Collection: ${collection ? collection.name : 'PaaN'}`,
      `Price: ${displayPrice}`,
      `URL: ${productUrl}`,
      '',
      'Customer details:',
      `Name: ${customerDetails.full_name}`,
      `Email: ${customerDetails.email}`,
      `Phone: ${customerDetails.phone}`,
      customerDetails.address ? `Address: ${customerDetails.address}` : '',
    ].join('\n')
    const whatsappUrl = `https://wa.me/919794493545?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
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
        className={`product-gallery ${
          hasMultipleMedia ? 'has-thumbnails' : 'is-single-image'
        }`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      >
        {hasMultipleMedia ? (
          <div className="product-gallery-thumbnails" aria-label="Product media">
            {galleryMedia.map((item, index) => (
              <button
                className={`product-gallery-thumbnail ${
                  index === selectedMediaIndex ? 'is-active' : ''
                }`}
                key={item.id || item.image_url}
                type="button"
                onClick={() => setSelectedMediaIndex(index)}
                aria-label={`View ${item.media_type} ${index + 1} of ${product.name}`}
                aria-pressed={index === selectedMediaIndex}
              >
                {item.media_type === 'video' && !item.thumbnail_url ? (
                  <video src={item.image_url} muted playsInline preload="metadata" />
                ) : (
                  <img src={item.thumbnail_url || item.image_url} alt={item.alt_text || product.name} />
                )}
                {item.media_type === 'video' ? <span>Play</span> : null}
              </button>
            ))}
          </div>
        ) : null}

        <div
          className={`product-detail-image textile-${product.tone} ${
            selectedMedia ? 'has-image' : 'is-placeholder'
          }`}
        >
          {selectedMedia?.media_type === 'video' ? (
            <video src={selectedMedia.image_url} controls playsInline preload="metadata" />
          ) : selectedMedia ? (
            <img src={selectedMedia.image_url} alt={selectedMedia.alt_text || product.name} />
          ) : null}
          <span>{productTypeBadge}</span>
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
        <span className="product-detail-price">{displayPrice}</span>

        {variants.length ? (
          <div className="product-variant-picker">
            <p className="eyebrow">Color</p>
            <div className="product-variant-options">
              {variants.map((variant) => (
                <button
                  className={variant.id === selectedVariantId ? 'is-active' : ''}
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantId(variant.id)}
                >
                  <span
                    className="product-variant-swatch"
                    style={{ background: variant.colorHex || variant.color_hex || 'var(--sage)' }}
                  />
                  <span>{variant.colorName || variant.color_name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

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
          <button className="button primary" type="button" onClick={handleWhatsAppEnquiry}>
            Enquire on WhatsApp
          </button>
          <Link
            className="button secondary"
            to={collection ? `/collections/${collection.slug}` : '/'}
          >
            Back to collection
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

export default ProductPage
