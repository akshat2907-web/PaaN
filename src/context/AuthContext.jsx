import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

async function upsertCustomerProfile(user) {
  if (!supabase || !user?.id || !user?.email) return null

  const { data, error } = await supabase
    .from('customer_profiles')
    .upsert(
      {
        id: user.id,
        email: user.email,
      },
      { onConflict: 'id' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

async function fetchCustomerProfile(userId) {
  if (!supabase || !userId) return null

  const { data, error } = await supabase
    .from('customer_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const user = session?.user || null

  async function loadProfile(nextSession) {
    setSession(nextSession)

    if (!nextSession?.user) {
      setProfile(null)
      return
    }

    try {
      const nextProfile =
        (await fetchCustomerProfile(nextSession.user.id)) ||
        (await upsertCustomerProfile(nextSession.user))
      setProfile(nextProfile)
    } catch {
      setProfile(null)
    }
  }

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false)
      return undefined
    }

    let isMounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      loadProfile(data.session).finally(() => {
        if (isMounted) setIsAuthLoading(false)
      })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      loadProfile(nextSession)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function sendMagicLink(email) {
    if (!supabase) throw new Error('Supabase is not configured.')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    })

    if (error) throw error
  }

  async function saveProfile(updates) {
    if (!supabase || !user) throw new Error('Sign in before saving your profile.')

    const { data, error } = await supabase
      .from('customer_profiles')
      .update({
        full_name: updates.full_name || null,
        phone: updates.phone || null,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    setProfile(data)
    return data
  }

  async function signOut() {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setSession(null)
    setProfile(null)
  }

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      isAuthLoading,
      sendMagicLink,
      saveProfile,
      signOut,
    }),
    [session, user, profile, isAuthLoading],
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
