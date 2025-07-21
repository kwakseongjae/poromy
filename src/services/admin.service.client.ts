import { SupabaseClient, User } from '@supabase/supabase-js'

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
 * Client-side Admin Service
 * For use in React components and client-side code
 */
export class AdminServiceClient {
  /**
   * Check if a user is an admin (client-side)
   */
  static async checkAdmin(
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
      console.error('AdminServiceClient error:', error)
      return false
    }
  }

  /**
   * Clear admin cache for a user
   */
  static clearCache(userId?: string): void {
    AdminCache.clear(userId)
  }
}