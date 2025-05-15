import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  let isAdmin = false
  if (session?.user) {
    // profiles 테이블에서 is_admin 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    isAdmin = !!profile?.is_admin
  }

  // 관리자 상태를 쿠키에 저장
  response.cookies.set('is-admin', isAdmin.toString())

  // /admin 보호: is_admin이 true가 아니면 접근 불가
  if (request.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
    // 403 페이지로 리다이렉트
    return NextResponse.redirect(new URL('/403', request.url))
  }

  // 로그인/회원가입 페이지 접근 시 로그인된 사용자 체크
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup')
  ) {
    if (session) {
      const returnUrl = request.cookies.get('returnUrl')?.value
      const redirectUrl = returnUrl || '/'

      // returnUrl 쿠키 삭제
      response.cookies.delete('returnUrl')

      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    return response
  }

  // 보호된 라우트 체크
  const protectedRoutes: string[] = ['/inquiry/new']
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!session) {
      // 현재 URL을 returnUrl로 저장
      response.cookies.set({
        name: 'returnUrl',
        value: request.nextUrl.pathname,
        path: '/',
      })

      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
