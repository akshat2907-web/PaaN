import { useState } from 'react'

const blankVariant = {
  color_name: '',
  color_hex: '',
  price_override: '',
  inventory_count: '',
}

function sortByOrder(items = []) {
  return [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
}

function AdminVariantManager({
  product,
  onSaveVariant,
  onDeleteVariant,
  onReorderVariants,
  onUploadVariantMedia,
}) {
  const [draft, setDraft] = useState(blankVariant)
  const [editing, setEditing] = useState({})

  const variants = sortByOrder(product?.product_variants || [])
  const media = sortByOrder(product?.product_images || [])

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function updateEditing(variantId, field, value) {
    setEditing((current) => ({
      ...current,
      [variantId]: {
        ...(current[variantId] || {}),
        [field]: value,
      },
    }))
  }

  async function handleAddVariant(event) {
    event.preventDefault()
    await onSaveVariant({
      ...draft,
      sort_order: variants.length,
    })
    setDraft(blankVariant)
  }

  async function handleSaveExisting(variant) {
    await onSaveVariant({
      ...variant,
      ...(editing[variant.id] || {}),
    })
    setEditing((current) => ({ ...current, [variant.id]: {} }))
  }

  function moveVariant(index, direction) {
    const nextIndex = index + direction
    const nextVariants = [...variants]

    if (nextIndex < 0 || nextIndex >= nextVariants.length) return

    const [variant] = nextVariants.splice(index, 1)
    nextVariants.splice(nextIndex, 0, variant)

    onReorderVariants?.(
      nextVariants.map((item, itemIndex) => ({
        ...item,
        sort_order: itemIndex,
      })),
    )
  }

  if (!product?.id) {
    return (
      <section className="admin-variant-manager">
        <p className="eyebrow">Color variants</p>
        <p className="admin-empty-state">Save the product before adding color variants.</p>
      </section>
    )
  }

  return (
    <section className="admin-variant-manager">
      <div className="admin-image-manager-heading">
        <div>
          <p className="eyebrow">Color variants</p>
          <h3>Variant options</h3>
        </div>
        <span>{variants.length} variants</span>
      </div>

      <form className="admin-variant-form" onSubmit={handleAddVariant}>
        <input
          value={draft.color_name}
          onChange={(event) => updateDraft('color_name', event.target.value)}
          placeholder="Color name"
          required
        />
        <input
          type="color"
          value={draft.color_hex || '#dfe8d7'}
          onChange={(event) => updateDraft('color_hex', event.target.value)}
          aria-label="Color swatch"
        />
        <input
          type="number"
          step="0.01"
          min="0"
          value={draft.price_override}
          onChange={(event) => updateDraft('price_override', event.target.value)}
          placeholder="Price override"
        />
        <input
          type="number"
          min="0"
          step="1"
          value={draft.inventory_count}
          onChange={(event) => updateDraft('inventory_count', event.target.value)}
          placeholder="Inventory"
        />
        <button type="submit">Add variant</button>
      </form>

      <div className="admin-variant-list">
        {variants.map((variant, index) => {
          const variantMedia = media.filter((item) => item.variant_id === variant.id)
          const current = { ...variant, ...(editing[variant.id] || {}) }

          return (
            <article className="admin-variant-card" key={variant.id}>
              <div className="admin-variant-card-fields">
                <input
                  value={current.color_name || ''}
                  onChange={(event) =>
                    updateEditing(variant.id, 'color_name', event.target.value)
                  }
                />
                <input
                  type="color"
                  value={current.color_hex || '#dfe8d7'}
                  onChange={(event) =>
                    updateEditing(variant.id, 'color_hex', event.target.value)
                  }
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={current.price_override ?? ''}
                  onChange={(event) =>
                    updateEditing(variant.id, 'price_override', event.target.value)
                  }
                  placeholder="Price override"
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={current.inventory_count ?? ''}
                  onChange={(event) =>
                    updateEditing(variant.id, 'inventory_count', event.target.value)
                  }
                  placeholder="Inventory"
                />
              </div>

              <div className="admin-variant-actions">
                <button type="button" onClick={() => handleSaveExisting(variant)}>
                  Save variant
                </button>
                <button
                  type="button"
                  onClick={() => moveVariant(index, -1)}
                  disabled={index === 0}
                >
                  Move up
                </button>
                <button
                  type="button"
                  onClick={() => moveVariant(index, 1)}
                  disabled={index === variants.length - 1}
                >
                  Move down
                </button>
                <button type="button" onClick={() => onDeleteVariant(variant.id)}>
                  Delete variant
                </button>
              </div>

              <label className="admin-variant-upload">
                Variant media
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(event) =>
                    onUploadVariantMedia(variant.id, Array.from(event.target.files || []))
                  }
                />
              </label>

              {variantMedia.length ? (
                <div className="admin-variant-media">
                  {variantMedia.map((item) => (
                    <span key={item.id}>{item.media_type === 'video' ? 'Video' : 'Image'}</span>
                  ))}
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default AdminVariantManager
