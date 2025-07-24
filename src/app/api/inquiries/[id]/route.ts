import { NextRequest, NextResponse } from 'next/server'
import { createClient, getOptimizedUser } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    
    // Fetch inquiry with user info
    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .select(`
        *,
        user:profiles!user_id(
          id,
          email,
          nickname
        ),
        answers(
          *,
          admin:profiles!admin_id(
            id,
            nickname
          )
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Inquiry not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching inquiry:', error)
      return NextResponse.json(
        { error: 'Failed to fetch inquiry' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ inquiry })
  } catch (error) {
    console.error('Error in inquiry detail API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
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
    const updates: any = {}
    
    // Only allow updating specific fields
    if (body.status !== undefined) updates.status = body.status
    if (body.title !== undefined) updates.title = body.title
    if (body.content !== undefined) updates.content = body.content
    if (body.url !== undefined) updates.url = body.url
    
    // Check if user owns the inquiry or is admin
    const { data: inquiry } = await supabase
      .from('inquiries')
      .select('user_id')
      .eq('id', id)
      .single()
    
    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }
    
    // Check if user is admin
    const { data: adminData } = await supabase
      .from('administrators')
      .select('id')
      .eq('id', user.id)
      .single()
    
    const isAdmin = !!adminData
    const isOwner = inquiry.user_id === user.id
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }
    
    // Update inquiry
    const { data, error } = await supabase
      .from('inquiries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating inquiry:', error)
      return NextResponse.json(
        { error: 'Failed to update inquiry' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ inquiry: data })
  } catch (error) {
    console.error('Error in update inquiry API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}