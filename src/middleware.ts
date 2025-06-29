import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // TODO: middleware admin check 로직 개선 필요
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  let isAdmin = false

  if (user && !userError) {
    try {
      // profiles 테이블에서 is_admin 확인 (더 안정적인 쿼리)
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!error && profile) {
        isAdmin = !!profile.is_admin
      }

      // 디버깅용 로그 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log('Middleware admin check:', {
          userId: user.id,
          email: user.email,
          profile,
          isAdmin,
          error,
          requestPath: request.nextUrl.pathname,
        })
      }
    } catch (dbError) {
      console.error('Database error in middleware:', dbError)
      isAdmin = false
    }
  }

  // 관리자 상태를 쿠키에 저장 (secure 설정 추가)
  response.cookies.set('is-admin', isAdmin.toString(), {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  // /admin 경로 보호
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 사용자가 없거나 admin이 아닌 경우
    if (!user || !isAdmin) {
      // 로그인하지 않은 경우 로그인 페이지로
      if (!user) {
        response.cookies.set('returnUrl', request.nextUrl.pathname, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        })
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // 로그인했지만 admin이 아닌 경우 403으로
      console.log('Access denied to admin route:', {
        path: request.nextUrl.pathname,
        userId: user.id,
        isAdmin,
      })
      return NextResponse.redirect(new URL('/403', request.url))
    }
  }

  // 로그인/회원가입 페이지 접근 시 로그인된 사용자 체크
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup')
  ) {
    if (user) {
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
    if (!user) {
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
