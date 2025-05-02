import { createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { Database } from '@/types/supabase'

export async function POST(request: Request) {
  try {
    const { userId, is_verified } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const supabaseAdmin = await createAdminClient()

    // 프로필 업데이트
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        is_verified: is_verified || null,
        updated_at: new Date().toISOString(),
      } as Database['public']['Tables']['profiles']['Update'])
      .eq('id', userId)

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json(
        { error: '프로필 업데이트 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
