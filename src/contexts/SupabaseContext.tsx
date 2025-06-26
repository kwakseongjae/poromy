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
import { setCookie, deleteCookie } from '@/utils/cookie'

type SupabaseContextType = {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshUser: async () => {},
})

export const useSupabase = () => useContext(SupabaseContext)

export default function SupabaseProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: User | null
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const [user, setUser] = useState<User | null>(initialUser)
  const [loading, setLoading] = useState<boolean>(true)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const router = useRouter()

  // Helper to fetch is_admin from profiles table and sync with cookie
  const fetchIsAdmin = async (userId: string | undefined | null) => {
    if (!userId) {
      setIsAdmin(false)
      deleteCookie('is-admin')
      return
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching admin status:', error)
        setIsAdmin(false)
        deleteCookie('is-admin')
        return
      }

      const adminStatus = !!profile?.is_admin
      setIsAdmin(adminStatus)

      // 쿠키와 상태 동기화
      setCookie('is-admin', adminStatus.toString(), {
        path: '/',
        sameSite: 'lax',
      })

      console.log('Admin status updated:', {
        userId,
        isAdmin: adminStatus,
        profile,
      })
    } catch (error) {
      console.error('Error in fetchIsAdmin:', error)
      setIsAdmin(false)
      deleteCookie('is-admin')
    }
  }

  useEffect(() => {
    setLoading(true)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      const newUser = newSession?.user || null
      setUser(newUser)
      setLoading(false)
      if (newUser) {
        fetchIsAdmin(newUser.id)
      } else {
        setIsAdmin(false)
        deleteCookie('is-admin')
      }
    })

    // On mount, fetch isAdmin for initial user
    if (initialUser) {
      fetchIsAdmin(initialUser.id)
    }
    setLoading(false)

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, initialUser])

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setIsAdmin(false)
    deleteCookie('is-admin')
    router.push('/login')
    setLoading(false)
  }

  const refreshUser = async () => {
    setLoading(true)
    const {
      data: { user: newUser },
    } = await supabase.auth.getUser()

    setUser(newUser || null)
    if (newUser) {
      await fetchIsAdmin(newUser.id)
    } else {
      setIsAdmin(false)
      deleteCookie('is-admin')
    }
    setLoading(false)
  }

  return (
    <SupabaseContext.Provider
      value={{ user, loading, isAdmin, signOut, refreshUser }}
    >
      {children}
    </SupabaseContext.Provider>
  )
}
