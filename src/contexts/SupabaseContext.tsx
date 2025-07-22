'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { AdminServiceClient } from '@/services/admin.service.client'

type SupabaseContextType = {
  user: User | null
  loading: boolean
  isAdmin: boolean
  adminLoading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  adminLoading: true,
  signOut: async () => {},
  refreshUser: async () => {},
})

export const useSupabase = () => useContext(SupabaseContext)

export default function SupabaseProvider({
  children,
}: {
  children: ReactNode
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [adminLoading, setAdminLoading] = useState<boolean>(true)
  const router = useRouter()

  // Helper to fetch admin status using centralized AdminService
  const fetchAdminStatus = async (userId: string | undefined | null) => {
    setAdminLoading(true)

    if (!userId) {
      setIsAdmin(false)
      setAdminLoading(false)
      return
    }

    try {
      const adminStatus = await AdminServiceClient.checkAdmin(supabase, userId)
      setIsAdmin(adminStatus)
      
      // Development logging
      if (process.env.NODE_ENV === 'development') {
        console.log('Admin status updated:', {
          userId,
          isAdmin: adminStatus,
        })
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
    } finally {
      setAdminLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    
    // Get initial user state
    const getInitialUser = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()
        
        setUser(currentUser)
        
        if (currentUser) {
          fetchAdminStatus(currentUser.id)
        } else {
          setAdminLoading(false)
        }
      } catch (error) {
        console.error('Error getting initial user:', error)
        setUser(null)
        setAdminLoading(false)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      const newUser = newSession?.user || null
      setUser(newUser)
      
      if (newUser) {
        fetchAdminStatus(newUser.id)
      } else {
        setIsAdmin(false)
        setAdminLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      setIsAdmin(false)
      // Clear admin cache
      AdminServiceClient.clearCache()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    setLoading(true)
    try {
      const {
        data: { user: newUser },
      } = await supabase.auth.getUser()

      setUser(newUser || null)
      
      if (newUser) {
        await fetchAdminStatus(newUser.id)
      } else {
        setIsAdmin(false)
        setAdminLoading(false)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SupabaseContext.Provider
      value={{ user, loading, isAdmin, adminLoading, signOut, refreshUser }}
    >
      {children}
    </SupabaseContext.Provider>
  )
}