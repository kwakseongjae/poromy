'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { useSupabase } from '@/contexts/SupabaseContext'
import { deleteCookie, getCookie } from '@/utils/cookie'

function LoginContent() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createBrowserSupabaseClient()
  const { user } = useSupabase()

  // returnUrl을 확인하고 리다이렉트하는 헬퍼 함수
  const handleRedirectWithReturnUrl = () => {
    const returnUrlFromCookie = getCookie('returnUrl')
    const returnUrlFromStorage = localStorage.getItem('returnUrl')

    // 쿠키와 localStorage 정리
    if (returnUrlFromCookie) {
      deleteCookie('returnUrl')
    }
    if (returnUrlFromStorage) {
      localStorage.removeItem('returnUrl')
    }

    // 우선순위: 쿠키 > localStorage > 홈
    const redirectUrl = returnUrlFromCookie || returnUrlFromStorage || '/'

    router.push(redirectUrl)
  }

  useEffect(() => {
    // URL 파라미터에서 메시지와 에러 처리
    const error = searchParams.get('error')
    const message = searchParams.get('message')

    if (error) {
      switch (error) {
        case 'no_code':
          setError('인증 코드가 없습니다.')
          break
        case 'auth_error':
          setError('인증 처리 중 오류가 발생했습니다.')
          break
        case 'no_user':
          setError('사용자를 찾을 수 없습니다.')
          break
        case 'profile_error':
          setError('프로필 업데이트 중 오류가 발생했습니다.')
          break
        case 'unknown_error':
          setError('알 수 없는 오류가 발생했습니다.')
          break
        default:
          setError('로그인 중 오류가 발생했습니다.')
      }
    }

    if (message) {
      setMessage(decodeURIComponent(message))
    }
  }, [searchParams])

  useEffect(() => {
    if (user) {
      handleRedirectWithReturnUrl()
    }
  }, [user, router])

  useEffect(() => {
    const handleEmailVerification = async () => {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      const type = params.get('type')
      const error = params.get('error')

      if (error) {
        console.error('Email verification error:', error)
        setError('이메일 인증 중 오류가 발생했습니다.')
        return
      }

      if (accessToken && refreshToken && type === 'signup') {
        try {
          // 클라이언트 사이드에서 세션 설정
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError || !data.user) {
            console.error('Session creation error:', sessionError)
            setError('세션 생성 중 오류가 발생했습니다.')
            return
          }

          // API 라우트를 통해 프로필 업데이트 (보안상 안전)
          const response = await fetch('/api/update-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: data.user.id,
              is_verified: true,
            }),
          })

          if (!response.ok) {
            throw new Error('Profile update failed')
          }

          // 성공적으로 완료되면 홈으로 리다이렉트
          setMessage('이메일 인증이 완료되었습니다!')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } catch (error) {
          console.error('Error in verification process:', error)
          setError('인증 처리 중 오류가 발생했습니다.')
        }
      }
    }

    handleEmailVerification()
  }, [router, supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      if (user) {
        // 프로필 정보 가져오기
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_verified')
          .eq('id', user.id)
          .single()

        if (profileError) {
          throw profileError
        }

        // 이메일 인증되지 않은 경우
        if (!profile?.is_verified) {
          // 로그아웃 처리
          await supabase.auth.signOut()
          setError(
            '이메일 인증이 필요합니다. 가입 시 입력한 이메일로 전송된 인증 링크를 확인해주세요.'
          )
          return
        }

        // 인증된 경우 적절한 페이지로 리다이렉트
        handleRedirectWithReturnUrl()
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <h1 className="mt-4 mb-8 text-center text-xl font-bold">Poromy 로그인</h1>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="text-text-disabled mb-2 block text-xs font-bold"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-sm font-semibold"
            placeholder="이메일을 입력해주세요."
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="text-text-disabled mb-2 block text-xs font-bold"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-sm font-semibold"
            placeholder="비밀번호를 입력해주세요."
            required
          />
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {message && <div className="mb-4 text-green-500">{message}</div>}

        <div className="mt-10">
          <button
            type="submit"
            className="w-full cursor-pointer rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
          <div className="my-2 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">또는</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <Link href="/signup">
            <button
              type="submit"
              className="w-full cursor-pointer rounded border border-gray-300 p-2 font-bold text-black hover:bg-gray-100"
            >
              이메일로 회원가입
            </button>
          </Link>
          {/* 비밀번호 재설정 기능 추후 추가 예정 */}
          {/* <div className="mt-2 flex justify-end">
            <Link href="/reset-password">
              <span className="text-sm font-semibold text-gray-500 underline hover:text-gray-700">
                비밀번호 재설정
              </span>
            </Link>
          </div> */}
        </div>
      </form>
    </div>
  )
}

function LoginLoader() {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div className="mx-auto mt-4 mb-8 h-6 w-32 animate-pulse rounded bg-gray-200"></div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200"></div>
          <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
        </div>
        <div>
          <div className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200"></div>
          <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="mt-10 space-y-2">
        <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
        <div className="my-2 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">또는</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={<LoginLoader />}>
      <LoginContent />
    </Suspense>
  )
}
