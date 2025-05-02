import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const hash = requestUrl.hash.substring(1) // Remove the # from the hash
  const params = new URLSearchParams(hash)

  // 에러 케이스 처리
  const error = params.get('error')
  if (error) {
    const errorDescription = params.get('error_description')
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${errorDescription || '이메일 인증에 실패했습니다.'}`
    )
  }

  // 성공 케이스 처리
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

      // 이미 인증된 사용자인지 확인
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('is_verified')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Profile check error:', profileError)
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=프로필 조회 실패`
        )
      }

      // 이미 인증된 경우 홈으로 리다이렉트
      if (profile?.is_verified) {
        return NextResponse.redirect(`${requestUrl.origin}/`)
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

      // 업데이트 후 is_verified 상태 다시 확인
      const { data: updatedProfile, error: checkError } = await supabaseAdmin
        .from('profiles')
        .select('is_verified')
        .eq('id', user.id)
        .single()

      if (checkError) {
        console.error('Profile check error after update:', checkError)
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=프로필 상태 확인 실패`
        )
      }

      if (updatedProfile?.is_verified) {
        console.log('Profile updated and verified successfully')
        return NextResponse.redirect(`${requestUrl.origin}/`)
      } else {
        console.error('Profile update failed - is_verified is still false')
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=이메일 인증이 완료되지 않았습니다.`
        )
      }
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
