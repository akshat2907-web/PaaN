import { useEffect, useState } from 'react'

const blankProduct = {
  name: '',
  slug: '',
  collection: 'classic',
  price: '',
  fabric: '',
  color: '',
  description: '',
  craft_note: '',
  occasion: '',
  status: 'draft',
  inventory_count: 0,
  featured: false,
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function AdminProductForm({
  product,
  onSave,
  onUploadImages,
  onDeleteImage,
  onReorderImages,
  isSaving,
}) {
  const [formData, setFormData] = useState(blankProduct)
  const [imageFiles, setImageFiles] = useState([])
  const [formError, setFormError] = useState('')

  useEffect(() => {
    setFormData(
      product
        ? {
            id: product.id,
            name: product.name || '',
            slug: product.slug || '',
            collection: product.collection || 'classic',
            price: product.price || '',
            fabric: product.fabric || '',
            color: product.color || '',
            description: product.description || '',
            craft_note: product.craft_note || '',
            occasion: product.occasion || '',
            status: product.status || 'draft',
            inventory_count: product.inventory_count ?? 0,
            featured: product.featured ?? false,
          product_images: [...(product.product_images || [])].sort(
            (a, b) => a.sort_order - b.sort_order,
          ),
          }
        : blankProduct,
    )
    setImageFiles([])
    setFormError('')
  }, [product])

  function updateField(field, value) {
    if (field === 'inventory_count') {
      const nextInventory = Math.max(0, Number(value) || 0)
      setFormData((current) => ({
        ...current,
        inventory_count: nextInventory,
      }))
      return
    }

    setFormData((current) => ({
      ...current,
      [field]: value,
      ...(field === 'name' && !current.id ? { slug: slugify(value) } : {}),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (Number(formData.inventory_count) < 0) {
      setFormError('Inventory count must be zero or higher.')
      return
    }

    setFormError('')
    const savedProduct = await onSave(formData)

    if (imageFiles.length) {
      await onUploadImages(savedProduct.id, imageFiles)
      setImageFiles([])
    }
  }

  function moveImage(index, direction) {
    const nextIndex = index + direction
    const images = [...(formData.product_images || [])]

    if (nextIndex < 0 || nextIndex >= images.length) return

    const [image] = images.splice(index, 1)
    images.splice(nextIndex, 0, image)

    const reorderedImages = images.map((item, itemIndex) => ({
      ...item,
      sort_order: itemIndex,
    }))

    setFormData((current) => ({
      ...current,
      product_images: reorderedImages,
    }))
    onReorderImages?.(reorderedImages)
  }

  function setPrimaryImage(index) {
    if (index === 0) return

    const images = [...(formData.product_images || [])]
    const [image] = images.splice(index, 1)
    images.unshift(image)

    const reorderedImages = images.map((item, itemIndex) => ({
      ...item,
      sort_order: itemIndex,
    }))

    setFormData((current) => ({
      ...current,
      product_images: reorderedImages,
    }))
    onReorderImages?.(reorderedImages)
  }

  return (
    <section className="admin-product-form-panel">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">{formData.id ? 'Edit piece' : 'New piece'}</p>
          <h2>{formData.id ? formData.name : 'Add product'}</h2>
        </div>
      </div>

      <form className="admin-form admin-product-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <label>
            Name
            <input
              value={formData.name}
              onChange={(event) => updateField('name', event.target.value)}
              required
            />
          </label>
          <label>
            Slug
            <input
              value={formData.slug}
              onChange={(event) => updateField('slug', slugify(event.target.value))}
              required
            />
          </label>
          <label>
            Collection
            <select
              value={formData.collection}
              onChange={(event) => updateField('collection', event.target.value)}
            >
              <option value="classic">Classic</option>
              <option value="premium">Premium</option>
              <option value="exclusive">Exclusive</option>
            </select>
          </label>
          <label>
            Price
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(event) => updateField('price', event.target.value)}
              required
            />
          </label>
          <label>
            Fabric
            <input
              value={formData.fabric}
              onChange={(event) => updateField('fabric', event.target.value)}
            />
          </label>
          <label>
            Color
            <input
              value={formData.color}
              onChange={(event) => updateField('color', event.target.value)}
            />
          </label>
          <label>
            Status
            <select
              value={formData.status}
              onChange={(event) => updateField('status', event.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label>
            Inventory count
            <input
              type="number"
              min="0"
              step="1"
              value={formData.inventory_count}
              onChange={(event) => updateField('inventory_count', event.target.value)}
              required
            />
          </label>
          <label>
            Featured
            <select
              value={formData.featured ? 'true' : 'false'}
              onChange={(event) => updateField('featured', event.target.value === 'true')}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </label>
          <label>
            Images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => setImageFiles(Array.from(event.target.files || []))}
            />
          </label>
        </div>

        <label>
          Description
          <textarea
            value={formData.description}
            onChange={(event) => updateField('description', event.target.value)}
            rows="4"
          />
        </label>
        <label>
          Craft note
          <textarea
            value={formData.craft_note}
            onChange={(event) => updateField('craft_note', event.target.value)}
            rows="3"
          />
        </label>
        <label>
          Occasion
          <textarea
            value={formData.occasion}
            onChange={(event) => updateField('occasion', event.target.value)}
            rows="3"
          />
        </label>

        {formData.product_images?.length ? (
          <section className="admin-image-manager">
            <div className="admin-image-manager-heading">
              <div>
                <p className="eyebrow">Image manager</p>
                <h3>Product gallery</h3>
              </div>
              <span>{formData.product_images.length} images</span>
            </div>

            <div className="admin-image-grid">
              {formData.product_images.map((image, index) => (
                <article className="admin-image-card" key={image.id}>
                  <div className="admin-image-preview">
                    <img src={image.image_url} alt={image.alt_text || formData.name} />
                    {index === 0 ? <span>Primary image</span> : null}
                  </div>
                  <div className="admin-image-meta">
                    <strong>Image {index + 1}</strong>
                    <small>{image.alt_text || formData.name}</small>
                  </div>
                  <div className="admin-image-actions">
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(index)}
                      disabled={index === 0}
                    >
                      Set primary
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0}
                    >
                      Move left
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 1)}
                      disabled={index === formData.product_images.length - 1}
                    >
                      Move right
                    </button>
                    <button type="button" onClick={() => onDeleteImage(image.id)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {formError ? <p className="admin-message">{formError}</p> : null}

        <button className="button primary" type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save product'}
        </button>
      </form>
    </section>
  )
}

export default AdminProductForm
