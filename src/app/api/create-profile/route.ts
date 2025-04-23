// app/api/create-profile/route.ts
import { createAdminClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // 요청 데이터 파싱
    let requestData
    try {
      requestData = await request.json()
    } catch (e) {
      console.error('JSON 파싱 오류:', e)
      return NextResponse.json(
        { error: '잘못된 요청 형식입니다.' },
        { status: 400 }
      )
    }

    const { userId, email, nickname } = requestData

    // 데이터 유효성 검사
    if (!userId || !email) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // Supabase Admin 클라이언트 생성
    const supabaseAdmin = await createAdminClient()

    // 기존 프로필 확인 (중복 방지)
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (existingProfile) {
      console.log('프로필이 이미 존재합니다:', existingProfile)
      return NextResponse.json({
        success: true,
        message: '프로필이 이미 존재합니다.',
      })
    }

    // 프로필 생성
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: userId,
          email,
          nickname,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('프로필 생성 DB 오류:', error)
      return NextResponse.json(
        { error: `데이터베이스 오류: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('프로필이 성공적으로 생성됨:', data)
    return NextResponse.json({
      success: true,
      message: '프로필이 성공적으로 생성되었습니다.',
      profile: data,
    })
  } catch (error) {
    console.error('프로필 생성 처리 오류:', error)
    return NextResponse.json(
      { error: '프로필 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
