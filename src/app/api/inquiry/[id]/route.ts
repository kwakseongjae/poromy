import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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
