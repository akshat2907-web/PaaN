import { supabase } from './supabase.js'

export async function getSession() {
  if (!supabase) return null

  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function getAdminProfile() {
  if (!supabase) return null

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) throw userError
  if (!user?.email) return null

  const { data, error } = await supabase
    .from('admins')
    .select('id, email, role')
    .eq('email', user.email)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function signInAdmin({ email, password }) {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  if (password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + '/admin',
    },
  })

  if (error) throw error
}

export async function signOutAdmin() {
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
