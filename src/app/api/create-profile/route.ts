// app/api/create-profile/route.ts
import { createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId, email, nickname, is_verified } = await request.json()

    if (!userId || !email) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const supabaseAdmin = await createAdminClient()

    // 프로필 생성
    const { error } = await supabaseAdmin.from('profiles').insert({
      id: userId,
      email,
      nickname,
      is_verified: is_verified || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Profile creation error:', error)
      return NextResponse.json(
        { error: '프로필 생성 중 오류가 발생했습니다.' },
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
