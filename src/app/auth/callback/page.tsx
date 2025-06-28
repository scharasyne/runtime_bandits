'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        const type = searchParams.get('type')

        // Handle errors from Supabase
        if (error) {
          setStatus('error')
          setMessage(
            errorDescription || 
            'May problema sa authentication. Pakisubukan ulit.'
          )
          return
        }

        // Handle authorization code
        if (code) {
          const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (sessionError) {
            setStatus('error')
            setMessage('Hindi ma-verify ang inyong account. Pakisubukan ulit.')
            return
          }

          if (data.session) {
            setStatus('success')
            
            // Handle different types of auth callbacks
            switch (type) {
              case 'recovery':
                setMessage('Password reset na-verify! Pwede na ninyo i-set ang bagong password.')
                setTimeout(() => {
                  router.push('/auth/reset-password')
                }, 2000)
                break
              case 'signup':
                setMessage('Email na-verify na! Welcome sa Credibee!')
                setTimeout(() => {
                  router.push('/dashboard')
                }, 2000)
                break
              default:
                setMessage('Successfully authenticated!')
                setTimeout(() => {
                  router.push('/dashboard')
                }, 2000)
                break
            }
          } else {
            setStatus('error')
            setMessage('Session hindi na-create. Pakisubukan ulit.')
          }
        } else {
          // No code parameter, might be a direct access
          setStatus('error')
          setMessage('Invalid callback URL. Pakiclick ang tamang link sa email.')
        }
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('May unexpected error. Pakisubukan ulit.')
      }
    }

    handleAuthCallback()
  }, [searchParams, router])

  const handleRetry = () => {
    router.push('/auth/login')
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 text-center shadow-xl">
        {status === 'loading' && (
          <>
            <div className="mb-6">
              <Loader2 className="h-16 w-16 text-blue-500 mx-auto animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Nag-verify ng account...
            </h1>
            <p className="text-gray-600">
              Pakihintay habang nire-redirect kayo. Huwag i-close ang browser.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Success!
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <Button
              onClick={handleGoToDashboard}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Pumunta sa Dashboard
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-6">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              May problema sa verification
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Bumalik sa Login
              </Button>
              <p className="text-sm text-gray-500">
                O mag-contact sa support: support@credibee.ph
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  )
} 