'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { useSupabase } from '@/contexts/SupabaseContext'

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

    if (message === 'email_verified') {
      setMessage('이메일 인증이 완료되었습니다. 로그인해주세요.')
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

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data.user) {
        throw new Error('로그인에 실패했습니다.')
      }

      // 사용자 프로필 확인
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        throw new Error('프로필 정보를 확인할 수 없습니다.')
      }

      if (!data.user.email_confirmed_at) {
        throw new Error(
          '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.'
        )
      }

      // 성공 시 리다이렉트
      const returnUrl = localStorage.getItem('returnUrl')
      localStorage.removeItem('returnUrl')

      if (returnUrl) {
        router.push(returnUrl)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      setError((error as Error).message)
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
