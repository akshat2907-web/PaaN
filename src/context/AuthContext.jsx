import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const customerDetailsKey = 'paan-customer-details'

const blankCustomerDetails = {
  full_name: '',
  email: '',
  phone: '',
  address: '',
}

function readCustomerDetails() {
  if (typeof window === 'undefined') return blankCustomerDetails

  try {
    const storedDetails = window.localStorage.getItem(customerDetailsKey)
    return storedDetails
      ? { ...blankCustomerDetails, ...JSON.parse(storedDetails) }
      : blankCustomerDetails
  } catch {
    return blankCustomerDetails
  }
}

function hasRequiredCustomerDetails(details) {
  return Boolean(details?.full_name?.trim() && details?.email?.trim() && details?.phone?.trim())
}

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(blankCustomerDetails)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const hasCustomerDetails = hasRequiredCustomerDetails(profile)
  const user = hasCustomerDetails ? { email: profile.email } : null

  useEffect(() => {
    setProfile(readCustomerDetails())
    setIsAuthLoading(false)
  }, [])

  async function saveProfile(updates) {
    const nextProfile = {
      ...blankCustomerDetails,
      ...profile,
      ...updates,
    }

    window.localStorage.setItem(customerDetailsKey, JSON.stringify(nextProfile))
    setProfile(nextProfile)
    return nextProfile
  }

  async function signOut() {
    window.localStorage.removeItem(customerDetailsKey)
    setProfile(blankCustomerDetails)
  }

  const value = useMemo(
    () => ({
      session: null,
      user,
      profile,
      isAuthLoading,
      hasCustomerDetails,
      saveProfile,
      signOut,
    }),
    [user, profile, isAuthLoading, hasCustomerDetails],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useCustomerAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useCustomerAuth must be used inside AuthProvider.')
  }

  return context
}

export function getStoredCustomerDetails() {
  return readCustomerDetails()
}

export function hasStoredCustomerDetails() {
  return hasRequiredCustomerDetails(readCustomerDetails())
}
