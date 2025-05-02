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

    // 이메일 인증이 완료된 경우 프로필 업데이트
    if (data.user.email_confirmed_at) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', data.user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
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
