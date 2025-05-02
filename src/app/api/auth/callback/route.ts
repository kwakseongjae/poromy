import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=인증 실패`)
    }

    // 이메일 인증이 완료된 경우 프로필 생성
    if (data.user.email_confirmed_at) {
      // 프로필 생성 API 호출
      const profileResponse = await fetch(
        `${requestUrl.origin}/api/create-profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: data.user.id,
            email: data.user.email,
            nickname: data.user.user_metadata.nickname || null,
            is_verified: true,
          }),
        }
      )

      if (!profileResponse.ok) {
        console.error('Profile creation failed')
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=프로필 생성 실패`
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
