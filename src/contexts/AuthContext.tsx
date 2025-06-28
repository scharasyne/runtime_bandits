'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { User as UserProfile } from '@/types/database'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Create user profile after registration
  const createUserProfile = async (user: User, additionalData?: Partial<UserProfile>) => {
    try {
      const profileData = {
        id: user.id,
        email: user.email!,
        first_name: additionalData?.first_name || null,
        last_name: additionalData?.last_name || null,
        business_name: additionalData?.business_name || null,
        phone: additionalData?.phone || null,
        avatar_url: additionalData?.avatar_url || null,
      }

      const { data, error } = await supabase
        .from('users')
        .insert([profileData])
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  }

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // User profile will be fetched in the auth state change listener
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData?.first_name || null,
            last_name: userData?.last_name || null,
            business_name: userData?.business_name || null,
            phone: userData?.phone || null,
          },
        },
      })

      if (error) throw error

      // If user is confirmed immediately, create profile
      if (data.user && !data.user.email_confirmed_at) {
        // Email confirmation required - profile will be created after confirmation
        console.log('Email confirmation required')
      }
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setUserProfile(null)
      setSession(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      })

      if (error) throw error
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  }

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    if (!user) throw new Error('No user logged in')

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      setUserProfile(data)
      return data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  // Refresh session function
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error

      if (data.session) {
        setSession(data.session)
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
      throw error
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // Fetch user profile
          const profile = await fetchUserProfile(session.user.id)
          
          if (!profile) {
            // Create profile if it doesn't exist (for new users)
            try {
              const newProfile = await createUserProfile(session.user)
              setUserProfile(newProfile)
            } catch (error) {
              console.error('Error creating user profile:', error)
            }
          } else {
            setUserProfile(profile)
          }
        } else {
          setUserProfile(null)
        }

        setLoading(false)
      }
    )

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session)
        setUser(session.user)
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    userProfile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 