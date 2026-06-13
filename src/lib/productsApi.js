import { supabase } from './supabase.js'

const collectionLabels = {
  classic: 'Classic',
  premium: 'Premium',
  exclusive: 'Exclusive',
}

const productTypeLabels = {
  saree: 'SAREE',
  kurta_set: 'KURTA SET',
  suit: 'SUIT',
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function formatPrice(price) {
  const numericPrice = Number(price)
  if (!Number.isFinite(numericPrice)) return price

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: Number.isInteger(numericPrice) ? 0 : 2,
  }).format(numericPrice)
}

function toneFromProduct(product) {
  const value = `${product.color || ''} ${product.collection || ''}`.toLowerCase()

  if (value.includes('cream') || value.includes('ivory')) return 'cream'
  if (value.includes('gold') || value.includes('premium')) return 'gold'
  if (value.includes('madder') || value.includes('red') || value.includes('exclusive')) {
    return 'madder'
  }
  if (value.includes('ink') || value.includes('black')) return 'ink'
  if (value.includes('deep')) return 'deep-green'
  if (value.includes('pista')) return 'pista'
  if (value.includes('sage')) return 'sage'
  return 'leaf'
}

function sortByOrder(items = []) {
  return [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
}

function mapProductMedia(product) {
  return sortByOrder(product.product_images || []).map((item) => ({
    ...item,
    media_type: item.media_type || 'image',
    mediaType: item.media_type || 'image',
    image_url: item.image_url || '',
    imageUrl: item.image_url || '',
    thumbnail_url: item.thumbnail_url || '',
    thumbnailUrl: item.thumbnail_url || '',
    alt_text: item.alt_text || product.name,
    altText: item.alt_text || product.name,
    variant_id: item.variant_id || null,
    variantId: item.variant_id || null,
  }))
}

function mapProductVariants(product, media) {
  return sortByOrder(product.product_variants || []).map((variant) => ({
    ...variant,
    colorName: variant.color_name,
    colorHex: variant.color_hex || '',
    priceOverride: variant.price_override,
    inventoryCount: variant.inventory_count,
    media: media.filter((item) => item.variant_id === variant.id),
  }))
}

export function mapSupabaseProduct(product) {
  const media = mapProductMedia(product)
  const variants = mapProductVariants(product, media)
  const productMedia = media.filter((item) => !item.variant_id)
  const fallbackMedia = productMedia.length ? productMedia : media
  const images = fallbackMedia.filter((item) => item.media_type === 'image')
  const primaryMedia = fallbackMedia[0]
  const primaryImage = images[0] || primaryMedia

  return {
    id: product.id,
    slug: product.slug,
    collection: product.collection,
    name: product.name,
    product_type: product.product_type || '',
    productType: product.product_type || '',
    category:
      productTypeLabels[product.product_type] ||
      product.category ||
      collectionLabels[product.collection] ||
      'PaaN',
    fabric: product.fabric || 'PaaN textile',
    color: product.color || '',
    tone: toneFromProduct(product),
    price: formatPrice(product.price),
    rawPrice: product.price,
    inventory_count: product.inventory_count ?? 0,
    inventoryCount: product.inventory_count ?? 0,
    featured: product.featured ?? false,
    isInStock: (product.inventory_count ?? 0) > 0,
    description: product.description || '',
    craftNote: product.craft_note || '',
    occasion: product.occasion || '',
    status: product.status,
    imageUrl: primaryImage?.image_url || '',
    images,
    media: fallbackMedia,
    productMedia,
    variants,
  }
}

export async function fetchPublishedProductsByCollection(collection) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('collection', collection)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .order('sort_order', {
      foreignTable: 'product_images',
      ascending: true,
    })

  if (error) throw error
  return data.map(mapSupabaseProduct)
}

export async function fetchFeaturedPublishedProducts(limit = 6) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)
    .order('sort_order', {
      foreignTable: 'product_images',
      ascending: true,
    })

  if (error) throw error
  return data.map(mapSupabaseProduct)
}

export async function fetchPublishedProduct(identifier) {
  if (!supabase) return null

  const filters = [`slug.eq.${identifier}`]
  if (uuidPattern.test(identifier)) {
    filters.push(`id.eq.${identifier}`)
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('status', 'published')
    .or(filters.join(','))
    .maybeSingle()

  if (error) throw error
  return data ? mapSupabaseProduct(data) : null
}

export async function fetchAdminProducts() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateProductImageOrder(images) {
  if (!supabase) throw new Error('Supabase is not configured.')

  for (const [index, image] of images.entries()) {
    const { error } = await supabase
      .from('product_images')
      .update({ sort_order: index })
      .eq('id', image.id)

    if (error) throw error
  }
}

export async function updateProductVariantOrder(variants) {
  if (!supabase) throw new Error('Supabase is not configured.')

  for (const [index, variant] of variants.entries()) {
    const { error } = await supabase
      .from('product_variants')
      .update({ sort_order: index })
      .eq('id', variant.id)

    if (error) throw error
  }
}

export async function saveProductVariant(productId, variant) {
  if (!supabase) throw new Error('Supabase is not configured.')

  const payload = {
    product_id: productId,
    color_name: variant.color_name || variant.colorName,
    color_hex: variant.color_hex || null,
    price_override: variant.price_override === '' ? null : Number(variant.price_override),
    inventory_count:
      variant.inventory_count === '' || variant.inventory_count == null
        ? null
        : Math.max(0, Number(variant.inventory_count) || 0),
    sort_order: Number(variant.sort_order) || 0,
  }

  const query = variant.id
    ? supabase.from('product_variants').update(payload).eq('id', variant.id).select().single()
    : supabase.from('product_variants').insert(payload).select().single()

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function deleteProductVariant(variantId) {
  if (!supabase) throw new Error('Supabase is not configured.')

  const { error } = await supabase.from('product_variants').delete().eq('id', variantId)
  if (error) throw error
}

export async function saveAdminProduct(product) {
  if (!supabase) throw new Error('Supabase is not configured.')

  const payload = {
    name: product.name,
    slug: product.slug,
    collection: product.collection,
    product_type: product.product_type || 'saree',
    price: Number(product.price),
    fabric: product.fabric || null,
    color: product.color || null,
    description: product.description || null,
    craft_note: product.craft_note || null,
    occasion: product.occasion || null,
    status: product.status,
    inventory_count: Math.max(0, Number(product.inventory_count) || 0),
    featured: Boolean(product.featured),
  }

  const query = product.id
    ? supabase.from('products').update(payload).eq('id', product.id).select().single()
    : supabase.from('products').insert(payload).select().single()

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function archiveAdminProduct(productId) {
  if (!supabase) throw new Error('Supabase is not configured.')

  const { error } = await supabase
    .from('products')
    .update({ status: 'archived' })
    .eq('id', productId)

  if (error) throw error
}

export async function deleteAdminProductImage(imageId) {
  if (!supabase) throw new Error('Supabase is not configured.')

  const { error } = await supabase.from('product_images').delete().eq('id', imageId)
  if (error) throw error
}

export async function uploadProductImages(productId, files, options = {}) {
  if (!supabase) throw new Error('Supabase is not configured.')
  if (!files?.length) return []

  const uploadedImages = []
  const { variantId = null } = options

  for (const [index, file] of Array.from(files).entries()) {
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')
    const basePath = variantId
      ? `products/${productId}/variants/${variantId}`
      : `products/${productId}/media`
    const path = `${basePath}/${Date.now()}-${index}-${safeName}`
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image'

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file)

    if (uploadError) throw uploadError

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(path)

    uploadedImages.push({
      product_id: productId,
      variant_id: variantId,
      media_type: mediaType,
      image_url: publicUrlData.publicUrl,
      alt_text: file.name.replace(/\.[^.]+$/, ''),
      sort_order: index,
    })
  }

  const { data, error } = await supabase
    .from('product_images')
    .insert(uploadedImages)
    .select()

  if (error) throw error
  return data
}
