'use client'

import React from 'react'
import { useRequireAuth } from '@/hooks/useAuth'
import ProfileManager from '@/components/ProfileManager'

export default function ProfilePage() {
  const { user, loading } = useRequireAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will be redirected by useRequireAuth
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and business information
          </p>
        </div>
        
        <ProfileManager />
      </div>
    </div>
  )
}
