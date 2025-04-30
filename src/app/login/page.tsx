'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { useSupabase } from '@/contexts/SupabaseContext'

export default function Login() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const { user, refreshSession } = useSupabase()

  useEffect(() => {
    if (user) {
      const returnUrl = new URLSearchParams(window.location.search).get(
        'returnUrl'
      )
      const referrer = document.referrer
      const isOurSite = referrer.includes(window.location.origin)

      if (isOurSite && returnUrl) {
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

    try {
      // 입력값 유효성 검사
      if (!email.trim()) {
        throw new Error('이메일을 입력해주세요.')
      }

      if (!password.trim()) {
        throw new Error('비밀번호를 입력해주세요.')
      }

      // 로그인 시도
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // 오류 메시지 사용자 친화적으로 변환
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error(
            '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.'
          )
        }
        throw error
      }

      if (!data.user) {
        throw new Error('로그인 처리 중 오류가 발생했습니다.')
      }

      // 사용자 정보 가져오기
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError && !profileError.message.includes('No rows found')) {
        console.error('프로필 정보 가져오기 오류:', profileError)
      }

      await refreshSession()

      // 이전 페이지 또는 대시보드로 리다이렉션
      const returnUrl = new URLSearchParams(window.location.search).get(
        'returnUrl'
      )
      const redirectUrl = returnUrl || '/'

      router.push(redirectUrl)
      router.refresh()
    } catch (error) {
      console.error('로그인 오류:', error)
      setError((error as Error).message)

      setPassword('')
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
        <div>
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
        {error && <div className="mt-4 text-center text-red-500">{error}</div>}

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
              이메일 회원가입
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
