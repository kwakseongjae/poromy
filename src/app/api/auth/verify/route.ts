import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import VerificationEmail from '@/emails/verification'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: '이메일이 필요합니다.' },
        { status: 400 }
      )
    }

    // Supabase 관리자 클라이언트 생성
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // 이메일 인증 토큰 생성
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password: '', // 빈 비밀번호로 설정
      options: {
        redirectTo: 'https://poromy.ai.kr/auth/callback',
      },
    })

    if (error) {
      console.error('토큰 생성 오류:', error)
      return NextResponse.json(
        { error: '인증 이메일 발송에 실패했습니다.' },
        { status: 500 }
      )
    }

    // Resend를 사용하여 이메일 발송
    const emailData = await resend.emails.send({
      from: 'kwakseongjae <contact@poromy.ai.kr>',
      to: email,
      subject: '포로미 이메일 인증',
      react: VerificationEmail({
        verificationUrl: data.properties.action_link,
        token: data.properties.hashed_token,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      }),
    })

    if (!emailData) {
      console.error('이메일 발송 실패:', emailData)
      return NextResponse.json(
        { error: '인증 이메일 발송에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('서버 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
