import CollectionCard from '../CollectionCard.jsx'
import { collections } from '../../data/catalog.js'

function CollectionsSection() {
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
          />
        ))}
      </div>
    </section>
  )
}

export default CollectionsSection
