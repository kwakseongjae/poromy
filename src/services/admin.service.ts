import { createClient, getOptimizedUser } from '@/lib/supabase-server'
import { SupabaseClient, User } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// In-memory cache with TTL
interface CacheEntry {
  isAdmin: boolean
  expires: number
}

class AdminCache {
  private static cache = new Map<string, CacheEntry>()
  private static readonly TTL = 5 * 60 * 1000 // 5 minutes

  static get(userId: string): boolean | null {
    const entry = this.cache.get(userId)
    if (!entry) return null
    
    if (entry.expires < Date.now()) {
      this.cache.delete(userId)
      return null
    }
    
    return entry.isAdmin
  }

  static set(userId: string, isAdmin: boolean): void {
    this.cache.set(userId, {
      isAdmin,
      expires: Date.now() + this.TTL
    })
  }

  static clear(userId?: string): void {
    if (userId) {
      this.cache.delete(userId)
    } else {
      this.cache.clear()
    }
  }
}

/**
 * Centralized Admin Service
 * Single source of truth for admin authentication
 */
export class AdminService {
  /**
   * Check if a user is an admin (server-side)
   */
  static async checkAdminServer(userId: string): Promise<boolean> {
    if (!userId) return false

    // Check cache first
    const cached = AdminCache.get(userId)
    if (cached !== null) {
      return cached
    }

    try {
      const supabase = await createClient()
      
      // Single source of truth: profiles.is_admin
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single()

      if (error || !profile) {
        console.error('Admin check error:', error)
        return false
      }

      const isAdmin = !!profile.is_admin
      
      // Cache the result
      AdminCache.set(userId, isAdmin)
      
      return isAdmin
    } catch (error) {
      console.error('AdminService error:', error)
      return false
    }
  }

  /**
   * Check if a user is an admin (client-side)
   */
  static async checkAdminClient(
    supabase: SupabaseClient,
    userId: string
  ): Promise<boolean> {
    if (!userId) return false

    // Check cache first
    const cached = AdminCache.get(userId)
    if (cached !== null) {
      return cached
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single()

      if (error || !profile) {
        console.error('Admin check error:', error)
        return false
      }

      const isAdmin = !!profile.is_admin
      
      // Cache the result
      AdminCache.set(userId, isAdmin)
      
      return isAdmin
    } catch (error) {
      console.error('AdminService error:', error)
      return false
    }
  }

  /**
   * Get current user and check if admin (server-side)
   * Performance optimized: uses JWT claims when possible
   */
  static async getCurrentAdminServer(forceRefresh: boolean = false): Promise<{
    user: User | null
    isAdmin: boolean
  }> {
    try {
      // Use optimized user retrieval that checks JWT first
      const user = await getOptimizedUser(forceRefresh)
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[AdminService.getCurrentAdminServer] Auth check:', {
          user: user ? { id: user.id, email: user.email } : null,
          optimized: !forceRefresh,
        })
      }
      
      if (!user) {
        return { user: null, isAdmin: false }
      }

      const isAdmin = await this.checkAdminServer(user.id)
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[AdminService.getCurrentAdminServer] Admin check result:', {
          userId: user.id,
          isAdmin,
        })
      }
      
      return { user, isAdmin }
    } catch (error) {
      console.error('getCurrentAdminServer error:', error)
      return { user: null, isAdmin: false }
    }
  }

  /**
   * Require admin access for API routes
   * Usage: const adminCheck = await AdminService.requireAdmin(request)
   *        if (adminCheck.error) return adminCheck.error
   */
  static async requireAdmin(request: NextRequest): Promise<{
    user?: User
    isAdmin?: boolean
    error?: NextResponse
  }> {
    try {
      const { user, isAdmin } = await this.getCurrentAdminServer()
      
      if (!user) {
        return {
          error: NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          )
        }
      }

      if (!isAdmin) {
        return {
          error: NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          )
        }
      }

      return { user, isAdmin }
    } catch (error) {
      console.error('requireAdmin error:', error)
      return {
        error: NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        )
      }
    }
  }

  /**
   * Clear admin cache for a user
   */
  static clearCache(userId?: string): void {
    AdminCache.clear(userId)
  }
}

// Error types for better error handling
export class AdminAuthError extends Error {
  constructor(
    message: string,
    public code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'INTERNAL_ERROR'
  ) {
    super(message)
    this.name = 'AdminAuthError'
  }
}