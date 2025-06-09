'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { useSupabase } from '@/contexts/SupabaseContext'

export default function SignUp() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [nickname, setNickname] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const { user } = useSupabase()

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

  // 비밀번호 일치 여부 확인
  const isPasswordMatch = password === passwordConfirm
  const isFormValid =
    email && password && passwordConfirm && nickname && isPasswordMatch

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // 비밀번호 확인 검증
    if (!isPasswordMatch) {
      setError('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    try {
      // 1. 사용자 생성 (이메일 인증 포함)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: nickname,
          },
          emailRedirectTo: 'https://poromy.ai.kr/auth/callback',
        },
      })

      if (authError) {
        console.error('Auth Error:', authError)
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('회원가입 중 오류가 발생했습니다.')
      }

      // 프로필 생성 API 호출
      const profileResponse = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authData.user.id,
          email: email,
          nickname: nickname,
          is_verified: false,
        }),
      })

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json()
        throw new Error(
          errorData.error || '프로필 생성 중 오류가 발생했습니다.'
        )
      }

      // 2. 이메일 인증 안내 메시지 표시
      setSuccess('이메일 인증 링크를 발송했습니다. 이메일을 확인해주세요.')
      setEmail('')
      setPassword('')
      setPasswordConfirm('')
      setNickname('')

      // 3. 이메일 인증 페이지로 리다이렉트
      router.push('/verify-email')
    } catch (error) {
      console.error('회원가입 오류:', error)
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <h1 className="mt-4 mb-8 text-center text-xl font-bold">
        Poromy 회원가입
      </h1>
      <form onSubmit={handleSignUp}>
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
        <div className="mb-4">
          <label
            htmlFor="passwordConfirm"
            className="text-text-disabled mb-2 block text-xs font-bold"
          >
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className={`w-full rounded border p-2 text-sm font-semibold ${
              passwordConfirm && !isPasswordMatch
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            placeholder="비밀번호를 다시 입력해주세요."
            required
            aria-describedby={
              passwordConfirm && !isPasswordMatch
                ? 'password-mismatch-error'
                : undefined
            }
          />
          {passwordConfirm && !isPasswordMatch && (
            <p
              id="password-mismatch-error"
              className="mt-1 text-xs text-red-500"
              role="alert"
              aria-live="polite"
            >
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="nickname"
            className="text-text-disabled mb-2 block text-xs font-bold"
          >
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-sm font-semibold"
            placeholder="닉네임을 입력해주세요."
            maxLength={20}
            required
          />
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}

        <div className="mt-12">
          <button
            type="submit"
            className={`w-full rounded p-2 font-bold text-white transition-colors ${
              isFormValid && !loading
                ? 'cursor-pointer bg-blue-500 hover:bg-blue-600'
                : 'cursor-not-allowed bg-gray-400'
            }`}
            disabled={loading || !isFormValid}
            aria-label={
              !isFormValid ? '모든 필드를 올바르게 입력해주세요' : '회원가입'
            }
          >
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </div>
      </form>
    </div>
  )
}
