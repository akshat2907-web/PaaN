import { useEffect, useState } from 'react'
import AdminLogin from '../components/admin/AdminLogin.jsx'
import AdminProductForm from '../components/admin/AdminProductForm.jsx'
import AdminProductList from '../components/admin/AdminProductList.jsx'
import AdminSiteAssets from '../components/admin/AdminSiteAssets.jsx'
import { getAdminProfile, getSession, signOutAdmin } from '../lib/adminAuth.js'
import {
  archiveAdminProduct,
  deleteProductVariant,
  deleteAdminProductImage,
  fetchAdminProducts,
  saveAdminProduct,
  saveProductVariant,
  updateProductImageOrder,
  updateProductVariantOrder,
  uploadProductImages,
} from '../lib/productsApi.js'
import { isSupabaseConfigured } from '../lib/supabase.js'

function AdminPage() {
  const [admin, setAdmin] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [activeSection, setActiveSection] = useState('products')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  async function loadAdmin() {
    setIsLoading(true)
    setStatusMessage('')

    try {
      const session = await getSession()
      if (!session) {
        setAdmin(null)
        return
      }

      const adminProfile = await getAdminProfile()
      setAdmin(adminProfile)

      if (!adminProfile) {
        setStatusMessage('Your account is not listed as a PaaN admin.')
        return
      }

      const adminProducts = await fetchAdminProducts()
      setProducts(adminProducts)
      setSelectedProduct((current) => current || adminProducts[0] || null)
    } catch (error) {
      setStatusMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAdmin()
  }, [])

  async function refreshProducts(productId) {
    const adminProducts = await fetchAdminProducts()
    setProducts(adminProducts)
    setSelectedProduct(
      adminProducts.find((product) => product.id === productId) ||
        adminProducts[0] ||
        null,
    )
  }

  async function handleSaveProduct(product) {
    setIsSaving(true)
    setStatusMessage('')

    try {
      const savedProduct = await saveAdminProduct(product)
      await refreshProducts(savedProduct.id)
      setStatusMessage('Product saved.')
      return savedProduct
    } catch (error) {
      setStatusMessage(error.message)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  async function handleUploadImages(productId, files) {
    setIsSaving(true)

    try {
      await uploadProductImages(productId, files)
      await refreshProducts(productId)
      setStatusMessage('Images uploaded.')
    } catch (error) {
      setStatusMessage(error.message)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  async function handleArchiveProduct(productId) {
    if (!window.confirm('Archive this product?')) return

    try {
      await archiveAdminProduct(productId)
      await refreshProducts(productId)
      setStatusMessage('Product archived.')
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  async function handleDeleteImage(imageId) {
    try {
      await deleteAdminProductImage(imageId)
      await refreshProducts(selectedProduct?.id)
      setStatusMessage('Image removed.')
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  async function handleReorderImages(images) {
    if (!selectedProduct) return

    try {
      await updateProductImageOrder(images)
      await refreshProducts(selectedProduct.id)
      setStatusMessage('Image order updated.')
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  async function handleSaveVariant(variant) {
    if (!selectedProduct?.id) return null
    setIsSaving(true)

    try {
      const savedVariant = await saveProductVariant(selectedProduct.id, variant)
      await refreshProducts(selectedProduct.id)
      setStatusMessage('Variant saved.')
      return savedVariant
    } catch (error) {
      setStatusMessage(error.message)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteVariant(variantId) {
    if (!window.confirm('Delete this variant? Media will be detached from the variant.')) return

    try {
      await deleteProductVariant(variantId)
      await refreshProducts(selectedProduct?.id)
      setStatusMessage('Variant deleted.')
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  async function handleReorderVariants(variants) {
    if (!selectedProduct) return

    try {
      await updateProductVariantOrder(variants)
      await refreshProducts(selectedProduct.id)
      setStatusMessage('Variant order updated.')
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  async function handleUploadVariantMedia(variantId, files) {
    if (!selectedProduct?.id || !files?.length) return
    setIsSaving(true)

    try {
      await uploadProductImages(selectedProduct.id, files, { variantId })
      await refreshProducts(selectedProduct.id)
      setStatusMessage('Variant media uploaded.')
    } catch (error) {
      setStatusMessage(error.message)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSignOut() {
    await signOutAdmin()
    setAdmin(null)
    setProducts([])
    setSelectedProduct(null)
  }

  if (!isSupabaseConfigured) {
    return (
      <section className="admin-page admin-page-narrow">
        <p className="eyebrow">PaaN admin</p>
        <h1>Supabase is not configured.</h1>
        <p>Add the required Vite environment variables to enable admin access.</p>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="admin-page admin-page-narrow">
        <p className="eyebrow">PaaN admin</p>
        <h1>Loading admin.</h1>
      </section>
    )
  }

  if (!admin) {
    return (
      <section className="admin-page admin-page-narrow">
        <AdminLogin onSignedIn={loadAdmin} />
        {statusMessage ? <p className="admin-message">{statusMessage}</p> : null}
      </section>
    )
  }

  return (
    <section className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">PaaN admin</p>
          <h1>{activeSection === 'products' ? 'Products' : 'Website Images'}</h1>
          <p>
            Signed in as {admin.email} / {admin.role}
          </p>
        </div>
        <button className="button secondary" type="button" onClick={handleSignOut}>
          Sign out
        </button>
      </header>

      <div className="admin-tabs" aria-label="Admin sections">
        <button
          type="button"
          className={activeSection === 'products' ? 'is-active' : ''}
          onClick={() => setActiveSection('products')}
        >
          Products
        </button>
        <button
          type="button"
          className={activeSection === 'site-assets' ? 'is-active' : ''}
          onClick={() => setActiveSection('site-assets')}
        >
          Website Images
        </button>
      </div>

      {statusMessage ? <p className="admin-message">{statusMessage}</p> : null}

      {activeSection === 'products' ? (
        <div className="admin-layout">
          <AdminProductList
            products={products}
            selectedProduct={selectedProduct}
            onCreate={() => setSelectedProduct(null)}
            onEdit={setSelectedProduct}
            onArchive={handleArchiveProduct}
          />
          <AdminProductForm
            product={selectedProduct}
            onSave={handleSaveProduct}
            onUploadImages={handleUploadImages}
            onDeleteImage={handleDeleteImage}
            onReorderImages={handleReorderImages}
            onSaveVariant={handleSaveVariant}
            onDeleteVariant={handleDeleteVariant}
            onReorderVariants={handleReorderVariants}
            onUploadVariantMedia={handleUploadVariantMedia}
            isSaving={isSaving}
          />
        </div>
      ) : (
        <AdminSiteAssets onStatus={setStatusMessage} />
      )}
    </section>
  )
}

export default AdminPage
