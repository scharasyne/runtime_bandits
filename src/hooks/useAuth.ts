'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

// Hook for protected routes
export function useRequireAuth(redirectTo = '/auth/login') {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  return { user, loading }
}

// Hook for guest routes (redirect if authenticated)
export function useGuestRoute(redirectTo = '/dashboard') {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  return { user, loading }
}

// Hook for session persistence check
export function useSessionPersistence() {
  const [isSessionReady, setIsSessionReady] = useState(false)
  const { session, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      setIsSessionReady(true)
    }
  }, [loading])

  return {
    isSessionReady,
    hasSession: !!session,
    loading
  }
}

// Hook for checking email confirmation status
export function useEmailConfirmation() {
  const { user } = useAuth()
  
  return {
    isEmailConfirmed: user?.email_confirmed_at != null,
    needsEmailConfirmation: user && !user.email_confirmed_at,
    user
  }
}

// Hook for managing auth form states
export function useAuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuthAction = async (action: () => Promise<void>) => {
    setIsLoading(true)
    setError(null)
    try {
      await action()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    isLoading,
    error,
    handleAuthAction,
    clearError
  }
} 