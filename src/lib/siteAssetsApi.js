import { supabase } from './supabase.js'

export const siteAssetSlots = [
  { asset_key: 'home_hero_main', label: 'Homepage hero main image', section: 'homepage', sort_order: 10 },
  { asset_key: 'home_hero_secondary', label: 'Homepage hero secondary image', section: 'homepage', sort_order: 20 },
  { asset_key: 'about_main', label: 'About page main image', section: 'about', sort_order: 10 },
  { asset_key: 'about_founder_1', label: 'Founder image 1', section: 'about', sort_order: 20 },
  { asset_key: 'about_founder_2', label: 'Founder image 2', section: 'about', sort_order: 30 },
  { asset_key: 'footer_brand_image', label: 'Footer brand image', section: 'footer', sort_order: 10 },
]

function sortAssets(assets) {
  return [...assets].sort((a, b) => {
    if ((a.section || '') !== (b.section || '')) {
      return (a.section || '').localeCompare(b.section || '')
    }

    return (a.sort_order ?? 0) - (b.sort_order ?? 0)
  })
}

function mergeWithSlots(assets = []) {
  const assetsByKey = Object.fromEntries(assets.map((asset) => [asset.asset_key, asset]))

  return sortAssets(
    siteAssetSlots.map((slot) => ({
      id: '',
      asset_type: 'image',
      image_url: '',
      alt_text: '',
      created_at: '',
      updated_at: '',
      ...slot,
      ...(assetsByKey[slot.asset_key] || {}),
    })),
  )
}

export async function fetchAdminSiteAssets() {
  if (!supabase) return mergeWithSlots([])

  const { data, error } = await supabase
    .from('site_assets')
    .select('*')
    .order('section', { ascending: true })
    .order('sort_order', { ascending: true })

  if (error) throw error
  return mergeWithSlots(data)
}

export async function fetchPublicSiteAssets(assetKeys = []) {
  if (!supabase) return {}

  let query = supabase.from('site_assets').select('*')

  if (assetKeys.length) {
    query = query.in('asset_key', assetKeys)
  }

  const { data, error } = await query
  if (error) throw error

  return Object.fromEntries((data || []).map((asset) => [asset.asset_key, asset]))
}

export async function saveSiteAsset(asset) {
  if (!supabase) throw new Error('Supabase is not configured.')

  const payload = {
    asset_key: asset.asset_key,
    label: asset.label,
    asset_type: asset.asset_type || 'image',
    image_url: asset.image_url || null,
    alt_text: asset.alt_text || null,
    section: asset.section || null,
    sort_order: Number(asset.sort_order) || 0,
  }

  const { data, error } = await supabase
    .from('site_assets')
    .upsert(payload, { onConflict: 'asset_key' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function resetSiteAsset(asset) {
  return saveSiteAsset({
    ...asset,
    image_url: '',
    alt_text: asset.alt_text || '',
  })
}

export async function uploadSiteAssetImage(assetKey, file) {
  if (!supabase) throw new Error('Supabase is not configured.')
  if (!file) throw new Error('Choose an image to upload.')

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')
  const path = `${assetKey}/${Date.now()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from('site-assets')
    .upload(path, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('site-assets').getPublicUrl(path)
  return data.publicUrl
}
