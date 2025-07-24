import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase-middleware'
import { getUserFromSession } from '@/lib/supabase-auth-helpers'

export async function middleware(request: NextRequest) {
  // Early return for non-protected routes
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for static files, API routes (except admin), and public paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public') ||
    (pathname.startsWith('/api') && !pathname.startsWith('/api/admin'))
  ) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Check if the path requires authentication
  const requiresAuth = pathname.startsWith('/admin')

  // Early return if no authentication needed
  if (!requiresAuth && !pathname.startsWith('/login') && !pathname.startsWith('/signup')) {
    return response
  }

  // Create Supabase client for middleware
  const supabase = createMiddlewareClient(request, response)
  
  // Performance optimization: Get session first, then extract user from JWT
  const { data: { session } } = await supabase.auth.getSession()
  const user = getUserFromSession(session)
  const userError = !session ? new Error('No session') : null
  
  let isAdmin = false
  
  // Check admin status if user is logged in
  if (user && !userError) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!profileError && profile) {
      isAdmin = !!profile.is_admin
    }
  }
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware] Path:', pathname, {
      user: user ? { id: user.id, email: user.email } : null,
      isAdmin,
      requiresAuth,
    })
  }

  // Set admin hint cookie for performance (not for security)
  if (user) {
    response.cookies.set('admin-hint', isAdmin.toString(), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })
  } else {
    response.cookies.delete('admin-hint')
  }

  // Handle /admin routes
  if (pathname.startsWith('/admin')) {
    // User not logged in - redirect to login
    if (!user) {
      response.cookies.set('returnUrl', pathname, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // User logged in but not admin - show 403
    if (!isAdmin) {
      console.log('Access denied to admin route:', {
        path: pathname,
        userId: user.id,
        isAdmin,
      })
      return NextResponse.redirect(new URL('/403', request.url))
    }

    // User is admin - allow access
    return response
  }

  // Handle login/signup pages - redirect if already logged in
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    if (user) {
      const returnUrl = request.cookies.get('returnUrl')?.value
      const redirectUrl = returnUrl || '/'
      
      // Clear returnUrl cookie
      response.cookies.delete('returnUrl')
      
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    return response
  }

  // Handle other protected routes (currently none, but keeping for future use)
  const protectedRoutes: string[] = []
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute && !user) {
    // Save current URL to return after login
    response.cookies.set('returnUrl', pathname, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next (Next.js internals)
     * 2. /api/(?!admin) (API routes except admin)
     * 3. /favicon.ico, /public (static files)
     * 4. /_static, /_vercel (deployment files)
     */
    '/((?!_next|api(?!/admin)|favicon\\.ico|public|_static|_vercel).*)',
  ],
}