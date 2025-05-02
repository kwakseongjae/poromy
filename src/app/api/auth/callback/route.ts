import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const hash = requestUrl.hash.substring(1) // Remove the # from the hash
  const params = new URLSearchParams(hash)
  const accessToken = params.get('access_token')
  const type = params.get('type')

  if (accessToken && type === 'signup') {
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

      // access_token으로 세션 정보 가져오기
      const {
        data: { user },
        error: userError,
      } = await supabaseAdmin.auth.getUser(accessToken)

      if (userError || !user) {
        console.error('User error:', userError)
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=사용자 정보 조회 실패`
        )
      }

      console.log('Updating profile for user:', user.id)

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
    `${requestUrl.origin}/login?error=잘못된 접근입니다.`
  )
}
