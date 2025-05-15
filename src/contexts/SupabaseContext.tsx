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
import { Session, User } from '@supabase/supabase-js'

type SupabaseContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshSession: async () => {},
})

export const useSupabase = () => useContext(SupabaseContext)

export default function SupabaseProvider({
  children,
  initialSession,
}: {
  children: ReactNode
  initialSession: Session | null
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const [session, setSession] = useState<Session | null>(initialSession)
  const [user, setUser] = useState<User | null>(initialSession?.user || null)
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
      setSession(newSession)
      setUser(newSession?.user || null)
      setLoading(false)
      if (newSession?.user) {
        fetchIsAdmin(newSession.user.id)
      } else {
        setIsAdmin(false)
      }
      router.refresh()
    })

    // On mount, fetch isAdmin for initial session
    if (initialSession?.user) {
      fetchIsAdmin(initialSession.user.id)
    }

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setIsAdmin(false)
    router.push('/login')
    setLoading(false)
  }

  const refreshSession = async () => {
    setLoading(true)
    const {
      data: { session: newSession },
    } = await supabase.auth.getSession()
    setSession(newSession)
    setUser(newSession?.user || null)
    if (newSession?.user) {
      await fetchIsAdmin(newSession.user.id)
    } else {
      setIsAdmin(false)
    }
    setLoading(false)
  }

  return (
    <SupabaseContext.Provider
      value={{ user, session, loading, isAdmin, signOut, refreshSession }}
    >
      {children}
    </SupabaseContext.Provider>
  )
}
