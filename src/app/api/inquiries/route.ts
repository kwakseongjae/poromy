import { NextRequest, NextResponse } from 'next/server'
import { createClient, getOptimizedUser } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    
    // Get query parameters
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const status = searchParams.get('status') || 'all'
    const userId = searchParams.get('userId')
    
    // Build query
    let query = supabase
      .from('inquiries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching inquiries:', error)
      return NextResponse.json(
        { error: 'Failed to fetch inquiries' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      inquiries: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Error in inquiries API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication - Performance optimized
    const user = await getOptimizedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Get request body
    const body = await request.json()
    const { title, content, url } = body
    
    // Validate required fields
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: '제목과 내용을 입력해주세요' },
        { status: 400 }
      )
    }
    
    // Create inquiry
    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          url: url?.trim() || null,
          status: 'pending',
        },
      ])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating inquiry:', error)
      return NextResponse.json(
        { error: 'Failed to create inquiry' },
        { status: 500 }
      )
    }
    
    // Send notification email
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/inquiry-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inquiry: {
            id: data.id,
            title,
            content,
            url: url?.trim() || null,
            userEmail: user.email,
            userNickname: user.user_metadata?.nickname || '사용자',
          },
        }),
      })
      
      if (!emailResponse.ok) {
        console.error('Failed to send notification email', await emailResponse.json())
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError)
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({ inquiry: data })
  } catch (error) {
    console.error('Error in create inquiry API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}