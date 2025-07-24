import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase-server'
import { AdminService } from '@/services/admin.service'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    
    // Fetch answers for the inquiry
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('inquiry_id', id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching answers:', error)
      return NextResponse.json(
        { error: 'Failed to fetch answers' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ answers: data || [] })
  } catch (error) {
    console.error('Error in answers API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: inquiryId } = await context.params
    
    // Check admin authorization
    const adminCheck = await AdminService.requireAdmin(request)
    if (adminCheck.error) {
      return adminCheck.error
    }
    
    const { user } = adminCheck
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }
    
    // Get request body
    const body = await request.json()
    const { content, url } = body
    
    // Validate required fields
    if (!content?.trim()) {
      return NextResponse.json(
        { error: '답변 내용을 입력해주세요' },
        { status: 400 }
      )
    }
    
    const supabase = createAdminClient()
    
    // Create answer
    const { data: answer, error: answerError } = await supabase
      .from('answers')
      .insert({
        inquiry_id: inquiryId,
        admin_id: user.id,
        content: content.trim(),
        url: url?.trim() || null,
      })
      .select()
      .single()
    
    if (answerError) {
      console.error('Error creating answer:', answerError)
      return NextResponse.json(
        { error: 'Failed to create answer' },
        { status: 500 }
      )
    }
    
    // Update inquiry status to 'answered'
    const { error: updateError } = await supabase
      .from('inquiries')
      .update({ status: 'answered' })
      .eq('id', inquiryId)
      .eq('status', 'pending') // Only update if it's still pending
    
    if (updateError) {
      console.error('Error updating inquiry status:', updateError)
      // Don't fail the request, answer was created successfully
    }
    
    // Get inquiry details for email notification
    const { data: inquiry } = await supabase
      .from('inquiries')
      .select('title, user_id')
      .eq('id', inquiryId)
      .single()
    
    if (inquiry) {
      // Get user details
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, nickname')
        .eq('id', inquiry.user_id)
        .single()
      
      if (profile?.email) {
        // Send notification email
        try {
          const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/answer-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inquiry: {
                id: inquiryId,
                title: inquiry.title,
                userNickname: profile.nickname || '사용자',
              },
              answer: {
                content,
                url: url || null,
              },
              userEmail: profile.email,
            }),
          })
          
          if (!emailResponse.ok) {
            console.error('Failed to send notification email', await emailResponse.json())
          }
        } catch (emailError) {
          console.error('Email notification error:', emailError)
          // Don't fail the request if email fails
        }
      }
    }
    
    return NextResponse.json({ answer })
  } catch (error) {
    console.error('Error in create answer API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}