import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=no_code`
      )
    }

    // 이메일 인증 처리
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.exchangeCodeForSession(code)

    if (authError) {
      console.error('Auth Error:', authError)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=auth_error`
      )
    }

    if (!user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=no_user`
      )
    }

    // 프로필 업데이트 (이메일 인증 완료)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_verified: true })
      .eq('id', user.id)

    if (profileError) {
      console.error('Profile Update Error:', profileError)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=profile_error`
      )
    }

    // 성공 시 로그인 페이지로 리다이렉트
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?message=email_verified`
    )
  } catch (error) {
    console.error('Callback Error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=unknown_error`
    )
  }
}
