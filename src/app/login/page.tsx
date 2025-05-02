'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { useSupabase } from '@/contexts/SupabaseContext'
import { createClient } from '@supabase/supabase-js'

export default function Login() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createBrowserSupabaseClient()
  const { user } = useSupabase()

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
      const returnUrl = localStorage.getItem('returnUrl')
      localStorage.removeItem('returnUrl')

      if (returnUrl) {
        router.push(returnUrl)
      } else {
        router.push('/')
      }
    }
  }, [user, router])

  useEffect(() => {
    const handleEmailVerification = async () => {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')
      const type = params.get('type')
      const error = params.get('error')

      if (error) {
        console.error('Email verification error:', error)
        return
      }

      if (accessToken && type === 'signup') {
        try {
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
            return
          }

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
            return
          }

          // 업데이트 후 is_verified 상태 확인
          const { data: profile, error: checkError } = await supabaseAdmin
            .from('profiles')
            .select('is_verified')
            .eq('id', user.id)
            .single()

          if (checkError || !profile?.is_verified) {
            console.error('Profile verification failed')
            return
          }

          // 세션 생성
          const { error: sessionError } = await supabaseAdmin.auth.setSession({
            access_token: accessToken,
            refresh_token: params.get('refresh_token') || '',
          })

          if (sessionError) {
            console.error('Session creation error:', sessionError)
            return
          }

          // 모든 것이 성공적으로 완료되면 홈으로 리다이렉트
          router.push('/')
        } catch (error) {
          console.error('Error in verification process:', error)
        }
      }
    }

    handleEmailVerification()
  }, [router])

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

        // 인증된 경우 홈으로 리다이렉트
        router.push('/')
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
