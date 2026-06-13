import { useEffect, useState } from 'react'
import CollectionCard from '../CollectionCard.jsx'
import { collections } from '../../data/catalog.js'
import { fetchPublishedProductsByCollection } from '../../lib/productsApi.js'

function CollectionsSection() {
  const [collectionSlides, setCollectionSlides] = useState({})

  useEffect(() => {
    let isMounted = true

    async function loadCollectionSlides() {
      try {
        const entries = await Promise.all(
          collections.map(async (collection) => {
            const products = await fetchPublishedProductsByCollection(collection.slug)
            const images = products
              .flatMap((product) => product.media || product.images || [])
              .filter((item) => (item.media_type || item.mediaType || 'image') === 'image')
              .map((item) => ({
                id: item.id || item.image_url || item.imageUrl,
                imageUrl: item.image_url || item.imageUrl,
                altText: item.alt_text || item.altText || collection.name,
              }))
              .filter((item) => item.imageUrl)

            return [collection.slug, images]
          }),
        )

        if (isMounted) setCollectionSlides(Object.fromEntries(entries))
      } catch {
        if (isMounted) setCollectionSlides({})
      }
    }

    loadCollectionSlides()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="section collections-section" id="collections">
      <div className="section-heading">
        <p className="eyebrow">Shop by mood</p>
        <h2>Collections for ordinary days, softened by craft</h2>
      </div>
      <div className="collection-grid">
        {collections.map((collection, index) => (
          <CollectionCard
            key={collection.slug}
            collection={collection}
            index={index}
            slides={collectionSlides[collection.slug] || []}
          />
        ))}
      </div>
    </section>
  )
}

export default CollectionsSection
