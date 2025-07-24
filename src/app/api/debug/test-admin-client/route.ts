import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    console.log('Testing admin client creation...')
    
    // Test 1: Environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('Environment check:', { hasUrl, hasServiceKey })
    
    if (!hasUrl || !hasServiceKey) {
      return NextResponse.json({ 
        error: 'Missing environment variables',
        hasUrl,
        hasServiceKey
      }, { status: 500 })
    }
    
    // Test 2: Create admin client
    const supabase = createAdminClient()
    console.log('Admin client created successfully:', !!supabase)
    
    // Test 3: Test a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    console.log('Query test:', { data, error })
    
    return NextResponse.json({ 
      success: true,
      hasClient: !!supabase,
      queryWorked: !error,
      error: error?.message || null
    })
    
  } catch (error) {
    console.error('Test admin client error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}