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

  // Helper to fetch is_admin from profiles table
  const fetchIsAdmin = async (userId: string | undefined | null) => {
    if (!userId) {
      setIsAdmin(false)
      return
    }
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()
    setIsAdmin(!!profile?.is_admin)
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
