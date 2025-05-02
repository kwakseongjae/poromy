import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')

  if (token_hash && type === 'signup') {
    try {
      // 서비스 롤 키를 사용하여 Supabase 클라이언트 생성
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

      // 이메일 인증 확인
      const {
        data: { user },
        error: verifyError,
      } = await supabaseAdmin.auth.verifyOtp({
        type: 'email',
        token_hash,
      })

      if (verifyError || !user) {
        console.error('Email verification error:', verifyError)
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=이메일 인증에 실패했습니다.`
        )
      }

      // 프로필 업데이트
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          is_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Profile update error:', updateError)
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=프로필 업데이트 실패`
        )
      }

      // 업데이트 후 is_verified 상태 확인
      const { data: profile, error: checkError } = await supabaseAdmin
        .from('profiles')
        .select('is_verified')
        .eq('id', user.id)
        .single()

      if (checkError || !profile?.is_verified) {
        console.error('Profile verification failed')
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=이메일 인증이 완료되지 않았습니다.`
        )
      }

      // 세션 생성
      const {
        data: { session },
        error: sessionError,
      } = await supabaseAdmin.auth.getSession()

      if (sessionError) {
        console.error('Session creation error:', sessionError)
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=세션 생성에 실패했습니다.`
        )
      }

      // 세션 쿠키 설정
      const response = NextResponse.redirect(`${requestUrl.origin}/`)
      response.cookies.set('sb-access-token', session?.access_token || '', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
      response.cookies.set('sb-refresh-token', session?.refresh_token || '', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })

      return response
    } catch (error) {
      console.error('Error in verification process:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=인증 과정에서 오류가 발생했습니다.`
      )
    }
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/login?error=잘못된 접근입니다.`
  )
}
