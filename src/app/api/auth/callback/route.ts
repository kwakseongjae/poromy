import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=인증 실패`)
    }

    // 이메일 인증이 완료된 경우 프로필 업데이트
    if (data.session) {
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

        console.log('Updating profile for user:', data.user.id)

        // 프로필 업데이트
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            is_verified: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.user.id)

        if (updateError) {
          console.error('Profile update error:', updateError)
          return NextResponse.redirect(
            `${requestUrl.origin}/login?error=프로필 업데이트 실패`
          )
        }

        console.log('Profile updated successfully')
        return NextResponse.redirect(`${requestUrl.origin}/`)
      } catch (error) {
        console.error('Error in profile update:', error)
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=프로필 업데이트 실패`
        )
      }
    }

    return NextResponse.redirect(
      `${requestUrl.origin}/login?message=이메일 인증이 완료되었습니다. 로그인해주세요.`
    )
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/login?error=인증 코드가 없습니다.`
  )
}
