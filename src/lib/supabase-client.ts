import { Database } from '@/types/supabase.js'
import { createClient as createBrowserClient } from '@supabase/supabase-js'

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null =
  null

export const createBrowserSupabaseClient = () => {
  if (browserClient) return browserClient

  browserClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return browserClient
}
