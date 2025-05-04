import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import VerificationEmail from '@/emails/verification'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * 현재 상황:
 * 1. Supabase의 기본 이메일 템플릿이 여전히 발송되는 문제가 있습니다.
 * 2. 이 문제를 해결하기 위해서는 Supabase 대시보드에서:
 *    - Authentication > Email Templates > "Confirm signup" 템플릿을 선택
 *    - HTML 템플릿을 빈 내용으로 설정:
 *      <!DOCTYPE html><html><head><title>Email Confirmation</title></head><body></body></html>
 * 3. 이렇게 하면 Supabase의 빈 이메일이 발송되고, 우리의 커스텀 이메일(verification.tsx)이 실제 내용을 담아 발송됩니다.
 *
 * TODO: Supabase의 이메일 발송을 완전히 비활성화하는 API 옵션이 추가되면 수정 필요
 */

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
      password: '',
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

    // Supabase의 이메일 발송 비활성화
    await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
      email_confirm: false,
    })

    // 인증 URL 생성
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?token_hash=${data.properties.hashed_token}&type=signup`

    // Resend를 사용하여 이메일 발송
    const emailData = await resend.emails.send({
      from: 'kwakseongjae <contact@poromy.ai.kr>',
      to: email,
      subject: '포로미 이메일 인증',
      react: VerificationEmail({
        verificationUrl,
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
