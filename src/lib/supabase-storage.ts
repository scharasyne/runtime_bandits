import { supabase } from './supabase'

// Storage bucket names
export const STORAGE_BUCKETS = {
  avatars: 'avatars',
  receipts: 'receipts',
  documents: 'documents',
} as const

// File upload helper
export const uploadFile = async (
  bucket: keyof typeof STORAGE_BUCKETS,
  file: File,
  path?: string
): Promise<{ url: string; error?: string }> => {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = path ? `${path}/${fileName}` : fileName

    // Upload file
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .getPublicUrl(data.path)

    return { url: urlData.publicUrl }
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return { url: '', error: error.message }
  }
}

// Delete file helper
export const deleteFile = async (
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .remove([path])

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting file:', error)
    return { success: false, error: error.message }
  }
}

// Get file URL helper
export const getFileUrl = (
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string
): string => {
  const { data } = supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .getPublicUrl(path)

  return data.publicUrl
}

// Validate file helper
export const validateFile = (
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
  } = {}
): { valid: boolean; error?: string } => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/*'] } = options

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size ay hindi dapat lumampas sa ${Math.round(maxSize / 1024 / 1024)}MB`
    }
  }

  // Check file type
  const isValidType = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -1))
    }
    return file.type === type
  })

  if (!isValidType) {
    return {
      valid: false,
      error: `Hindi supported ang file type na ito. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  return { valid: true }
} 