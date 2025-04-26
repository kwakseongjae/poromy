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
    const { data: adminData } = await supabase
      .from('administrators')
      .select('id')
      .eq('id', session.user.id)
      .single()

    isAdmin = !!adminData
  }

  // 관리자 상태를 쿠키에 저장
  response.cookies.set('is-admin', isAdmin.toString())

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
  const protectedRoutes: string[] = []
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
