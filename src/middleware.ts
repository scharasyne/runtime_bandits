import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function middleware(req: NextRequest) {
  // Temporarily allow all requests through for debugging
  console.log('Middleware: Processing request for:', req.nextUrl.pathname)
  
  let supabaseResponse = NextResponse.next({
    request: req,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: req,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // For debugging - just allow everything through
  console.log('Middleware: Allowing request through')
  return supabaseResponse

  // Original middleware logic commented out for debugging
  /*
  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Auth routes that should redirect if user is authenticated
  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password']
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/invoices', '/receipts', '/feedback']

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Handle auth callback
  if (pathname === '/auth/callback') {
    const code = req.nextUrl.searchParams.get('code')
    const type = req.nextUrl.searchParams.get('type')

    if (code) {
      await supabase.auth.exchangeCodeForSession(code)
      
      // Redirect based on type
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/auth/reset-password', req.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
  }

  return supabaseResponse
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 