import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Supabase 클라이언트 생성
    const supabase = await createClient()

    // 문의 조회
    const { data: inquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .select(
        `
        *,
        user:users(nickname),
        answers (
          *,
          admin:users(nickname)
        )
      `
      )
      .eq('id', id)
      .single()

    if (inquiryError) {
      console.error('Error fetching inquiry:', inquiryError)
      return NextResponse.json(
        { error: 'Failed to fetch inquiry' },
        { status: 500 }
      )
    }

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('Error fetching inquiry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
