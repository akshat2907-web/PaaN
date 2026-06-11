import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const storageKey = 'paan-cart'

function parsePrice(value) {
  if (typeof value === 'number') return value
  if (!value) return 0

  const numericValue = Number(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(numericValue) ? numericValue : 0
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}

function normalizeProduct(product) {
  const unitPrice = parsePrice(product.rawPrice ?? product.price)
  const image = product.imageUrl || product.images?.[0]?.image_url || ''

  return {
    id: product.id,
    slug: product.slug || product.id,
    name: product.name,
    collection: product.collection,
    image,
    unitPrice,
    displayPrice: product.price || formatPrice(unitPrice),
  }
}

function readStoredCart() {
  try {
    const storedCart = window.localStorage.getItem(storageKey)
    return storedCart ? JSON.parse(storedCart) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items])

  function addItem(product, quantity = 1) {
    const cartItem = normalizeProduct(product)
    const nextQuantity = Math.max(1, Number(quantity) || 1)

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === cartItem.id)

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + nextQuantity }
            : item,
        )
      }

      return [...currentItems, { ...cartItem, quantity: nextQuantity }]
    })
  }

  function updateQuantity(productId, quantity) {
    const nextQuantity = Math.max(1, Number(quantity) || 1)

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: nextQuantity } : item,
      ),
    )
  }

  function removeItem(productId) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId))
  }

  function clearCart() {
    setItems([])
  }

  const value = useMemo(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0)
    const subtotal = items.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0,
    )

    return {
      items,
      itemCount,
      subtotal,
      formattedSubtotal: formatPrice(subtotal),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider.')
  }

  return context
}

export { formatPrice as formatCartPrice }
