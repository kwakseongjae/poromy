import { Session, User } from '@supabase/supabase-js'
import { jwtDecode } from 'jwt-decode'

interface JWTClaims {
  sub: string // user id
  email?: string
  phone?: string
  role?: string
  aud?: string
  exp?: number
  iat?: number
  session_id?: string
  is_anonymous?: boolean
  aal?: string
  amr?: Array<{ method: string; timestamp: number }>
  app_metadata?: Record<string, any>
  user_metadata?: Record<string, any>
}

/**
 * Extract user claims from JWT without making a network call
 * This is much faster than calling getUser() as it avoids a round trip to the server
 * 
 * Use this when you only need basic user info (id, email, etc.)
 * Use getUser() when you need to validate the token or get fresh user data
 */
export function getUserFromSession(session: Session | null): User | null {
  if (!session?.access_token) return null

  try {
    const claims = jwtDecode<JWTClaims>(session.access_token)
    
    // Check if token is expired
    if (claims.exp && claims.exp * 1000 < Date.now()) {
      return null
    }

    // Construct a User object from JWT claims
    const user: User = {
      id: claims.sub,
      email: claims.email,
      phone: claims.phone,
      role: claims.role,
      aud: claims.aud || 'authenticated',
      created_at: new Date(claims.iat! * 1000).toISOString(),
      updated_at: new Date(claims.iat! * 1000).toISOString(),
      app_metadata: claims.app_metadata || {},
      user_metadata: claims.user_metadata || {},
      // Add other standard User fields with defaults
      email_confirmed_at: claims.email ? new Date().toISOString() : undefined,
      phone_confirmed_at: claims.phone ? new Date().toISOString() : undefined,
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      identities: [],
      factors: [],
      is_anonymous: claims.is_anonymous || false,
    } as User

    return user
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

/**
 * Get claims directly from JWT without making a network call
 * Useful for checking specific claims like custom roles, permissions, etc.
 */
export function getClaims(session: Session | null): JWTClaims | null {
  if (!session?.access_token) return null

  try {
    const claims = jwtDecode<JWTClaims>(session.access_token)
    
    // Check if token is expired
    if (claims.exp && claims.exp * 1000 < Date.now()) {
      return null
    }

    return claims
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

/**
 * Check if we should use cached user data or fetch fresh data
 * Returns true if we should call getUser(), false if we can use cached data
 */
export function shouldRefreshUser(session: Session | null, lastFetchTime?: number): boolean {
  if (!session) return false
  
  // If no last fetch time, we should fetch
  if (!lastFetchTime) return true
  
  // Refresh if it's been more than 5 minutes
  const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes
  return Date.now() - lastFetchTime > REFRESH_INTERVAL
}

/**
 * Performance-optimized auth check that uses JWT claims when possible
 * Falls back to getUser() only when necessary
 */
export async function getOptimizedUser(
  session: Session | null,
  forceRefresh: boolean = false
): Promise<{ user: User | null; fromCache: boolean }> {
  // If no session, return null
  if (!session) {
    return { user: null, fromCache: false }
  }

  // If not forcing refresh, try to get user from JWT
  if (!forceRefresh) {
    const cachedUser = getUserFromSession(session)
    if (cachedUser) {
      return { user: cachedUser, fromCache: true }
    }
  }

  // If we get here, we need to fetch fresh data
  // This should be handled by the calling function using getUser()
  return { user: null, fromCache: false }
}