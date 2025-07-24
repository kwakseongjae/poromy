import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase-server'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'

export async function GET() {
  try {
    // Test server client
    const serverClient = await createClient()
    const serverTest = await serverClient.from('profiles').select('count').limit(1)
    
    // Test admin client
    const adminClient = createAdminClient()
    const adminTest = await adminClient.from('profiles').select('count').limit(1)
    
    return NextResponse.json({
      success: true,
      tests: {
        serverClient: {
          success: !serverTest.error,
          error: serverTest.error?.message || null
        },
        adminClient: {
          success: !adminTest.error,
          error: adminTest.error?.message || null
        }
      }
    })
  } catch (error) {
    console.error('Supabase test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}