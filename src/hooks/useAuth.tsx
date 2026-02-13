'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, AuthState } from '@/types'

interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<UseAuthReturn | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) throw error
      return data
    } catch {
      return null
    }
  }, [supabase])

  const refreshUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const profile = await fetchProfile(user.id)
        setState({ user: profile, isLoading: false, isAuthenticated: true })
      } else {
        setState({ user: null, isLoading: false, isAuthenticated: false })
      }
    } catch {
      setState({ user: null, isLoading: false, isAuthenticated: false })
    }
  }, [supabase, fetchProfile])

  useEffect(() => {
    refreshUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        refreshUser()
      } else if (event === 'SIGNED_OUT') {
        setState({ user: null, isLoading: false, isAuthenticated: false })
      }
    })
    return () => subscription.unsubscribe()
  }, [supabase, refreshUser])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setState({ user: null, isLoading: false, isAuthenticated: false })
  }, [supabase])

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
