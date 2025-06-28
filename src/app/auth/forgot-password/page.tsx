'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useGuestRoute, useAuthForm } from '@/hooks/useAuth'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth'

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false)
  const { resetPassword } = useAuth()
  const { isLoading, error, handleAuthAction } = useAuthForm()

  // Redirect if already authenticated
  useGuestRoute()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await handleAuthAction(async () => {
      await resetPassword(data.email)
      setEmailSent(true)
    })
  }

  // Show success message if email sent
  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="p-6 text-center shadow-xl">
            <div className="mb-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email na-send na!
            </h1>
            <p className="text-gray-600 mb-6">
              Nag-send na kami ng password reset link sa{' '}
              <span className="font-medium">{getValues('email')}</span>. 
              Pakicheck ang inyong email at i-click ang link para ma-reset ang inyong password.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="w-full"
              >
                I-send ulit ang email
              </Button>
              <Link href="/auth/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Bumalik sa Login
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Hindi pa nakatanggap ng email? Pakicheck ang spam folder ninyo.
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/auth/login"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Bumalik sa Login
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nakalimutan ang Password?
          </h1>
          <p className="text-gray-600">
            Ipasok ang inyong email address para ma-reset ang password
          </p>
        </div>

        <Card className="p-6 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    May problema sa pag-send ng email
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="juan@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Nag-send...</span>
                </div>
              ) : (
                'I-send ang Reset Link'
              )}
            </Button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Naalala na ang password?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Mag-login dito
              </Link>
            </p>
          </div>
        </Card>

        {/* Additional Help */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Kailangan ng tulong?
          </h3>
          <p className="text-sm text-blue-700">
            Kung hindi ninyo nakakareceive ang reset email, pakicontact ang aming support team 
            sa <span className="font-medium">support@credibee.ph</span>
          </p>
        </div>
      </div>
    </div>
  )
} 