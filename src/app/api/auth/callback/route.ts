import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { Database } from '@/types/supabase'

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
      return NextResponse.redirect(`${requestUrl.origin}/login?error=인증 실패`)
    }

    // 이메일 인증이 완료된 경우 프로필 업데이트
    if (data.user.email_confirmed_at) {
      try {
        const supabaseAdmin = await createAdminClient()

        // 직접 프로필 업데이트
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            is_verified: true,
          } as Database['public']['Tables']['profiles']['Update'])
          .eq('id', data.user.id)

        if (updateError) {
          console.error('Profile update error:', updateError)
          return NextResponse.redirect(
            `${requestUrl.origin}/login?error=프로필 업데이트 실패`
          )
        }
      } catch (error) {
        console.error('Error updating profile:', error)
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
