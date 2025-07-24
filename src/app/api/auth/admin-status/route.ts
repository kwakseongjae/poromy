import { NextResponse } from 'next/server'
import { createClient, getOptimizedUser } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check authentication - Performance optimized
    const user = await getOptimizedUser()
    if (!user) {
      return NextResponse.json({ isAdmin: false })
    }
    
    // Check if user is admin
    const { data, error } = await supabase
      .from('administrators')
      .select('id')
      .eq('id', user.id)
      .single()
    
    if (error || !data) {
      return NextResponse.json({ isAdmin: false })
    }
    
    return NextResponse.json({ isAdmin: true })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false })
  }
}