declare module 'next-pwa' {
  import { NextConfig } from 'next'
  
  interface PWAConfig {
    dest?: string
    disable?: boolean
    register?: boolean
    skipWaiting?: boolean
    scope?: string
    sw?: string
    runtimeCaching?: any[]
    buildExcludes?: string[]
    fallbacks?: {
      document?: string
      image?: string
      audio?: string
      video?: string
      font?: string
    }
    cacheOnFrontEndNav?: boolean
    reloadOnOnline?: boolean
    dynamicStartUrl?: boolean
    dynamicStartUrlRedirect?: string
  }

  function withPWA(config: PWAConfig): (nextConfig?: NextConfig) => NextConfig
  export default withPWA
} 