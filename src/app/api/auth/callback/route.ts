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
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email,
        nickname: data.user.user_metadata.nickname,
        is_verified: true,
        created_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error('Profile creation error:', profileError)
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
