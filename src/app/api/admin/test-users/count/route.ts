import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { AdminService } from '@/services/admin.service'

export async function GET(request: Request) {
  try {
    // Check admin authorization
    const adminCheck = await AdminService.requireAdmin(request as any)
    if (adminCheck.error) {
      return adminCheck.error
    }

    // Get test user count (test users have @test.test email domain)
    const supabase = await createClient()
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .like('email', '%@test.test')

    if (error) {
      console.error('Error fetching test user count:', error)
      return NextResponse.json(
        { error: 'Failed to fetch test user count' },
        { status: 500 }
      )
    }

    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    console.error('Error in test user count API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}