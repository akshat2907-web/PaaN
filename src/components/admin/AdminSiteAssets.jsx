import { useEffect, useState } from 'react'
import {
  fetchAdminSiteAssets,
  resetSiteAsset,
  saveSiteAsset,
  uploadSiteAssetImage,
} from '../../lib/siteAssetsApi.js'

function AdminSiteAssets({ onStatus }) {
  const [assets, setAssets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingKey, setSavingKey] = useState('')

  async function loadAssets() {
    setIsLoading(true)

    try {
      setAssets(await fetchAdminSiteAssets())
    } catch (error) {
      onStatus(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAssets()
  }, [])

  function updateAsset(assetKey, field, value) {
    setAssets((currentAssets) =>
      currentAssets.map((asset) =>
        asset.asset_key === assetKey ? { ...asset, [field]: value } : asset,
      ),
    )
  }

  async function persistAsset(asset, successMessage) {
    setSavingKey(asset.asset_key)
    onStatus('')

    try {
      const savedAsset = await saveSiteAsset(asset)
      setAssets((currentAssets) =>
        currentAssets.map((item) =>
          item.asset_key === savedAsset.asset_key ? { ...item, ...savedAsset } : item,
        ),
      )
      onStatus(successMessage)
    } catch (error) {
      onStatus(error.message)
    } finally {
      setSavingKey('')
    }
  }

  async function handleUpload(asset, file) {
    if (!file) return

    setSavingKey(asset.asset_key)
    onStatus('')

    try {
      const imageUrl = await uploadSiteAssetImage(asset.asset_key, file)
      const savedAsset = await saveSiteAsset({
        ...asset,
        image_url: imageUrl,
        alt_text: asset.alt_text || asset.label,
      })
      setAssets((currentAssets) =>
        currentAssets.map((item) =>
          item.asset_key === savedAsset.asset_key ? { ...item, ...savedAsset } : item,
        ),
      )
      onStatus('Website image updated.')
    } catch (error) {
      onStatus(error.message)
    } finally {
      setSavingKey('')
    }
  }

  async function handleReset(asset) {
    setSavingKey(asset.asset_key)
    onStatus('')

    try {
      const savedAsset = await resetSiteAsset(asset)
      setAssets((currentAssets) =>
        currentAssets.map((item) =>
          item.asset_key === savedAsset.asset_key ? { ...item, ...savedAsset } : item,
        ),
      )
      onStatus('Website image reset to fallback.')
    } catch (error) {
      onStatus(error.message)
    } finally {
      setSavingKey('')
    }
  }

  if (isLoading) {
    return (
      <section className="admin-product-form-panel">
        <p className="eyebrow">Website Images</p>
        <h2>Loading image slots.</h2>
      </section>
    )
  }

  return (
    <section className="admin-product-form-panel admin-site-assets">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Website Images</p>
          <h2>Editable image slots</h2>
        </div>
      </div>

      <div className="admin-site-assets-grid">
        {assets.map((asset) => (
          <article className="admin-site-asset-card" key={asset.asset_key}>
            <div className="admin-site-asset-preview">
              {asset.image_url ? (
                <img src={asset.image_url} alt={asset.alt_text || asset.label} />
              ) : (
                <span>Fallback</span>
              )}
            </div>

            <div className="admin-site-asset-copy">
              <strong>{asset.label}</strong>
              <small>{asset.asset_key}</small>
              <small>{asset.section}</small>
            </div>

            <label>
              Alt text
              <input
                value={asset.alt_text || ''}
                onChange={(event) =>
                  updateAsset(asset.asset_key, 'alt_text', event.target.value)
                }
              />
            </label>

            <label>
              Upload / replace image
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleUpload(asset, event.target.files?.[0])}
              />
            </label>

            <div className="admin-site-asset-actions">
              <button
                type="button"
                onClick={() => persistAsset(asset, 'Website image metadata saved.')}
                disabled={savingKey === asset.asset_key}
              >
                {savingKey === asset.asset_key ? 'Saving...' : 'Save alt text'}
              </button>
              <button
                type="button"
                onClick={() => handleReset(asset)}
                disabled={savingKey === asset.asset_key || !asset.image_url}
              >
                Reset image
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdminSiteAssets
