'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { useSupabase } from '@/contexts/SupabaseContext'

export default function SignUp() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
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

  async function handleSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // 1. 사용자 생성 (이메일 인증 포함)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: nickname,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      })

      if (authError) {
        console.error('Auth Error:', authError)
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('회원가입 중 오류가 발생했습니다.')
      }

      // 2. 임시 프로필 생성 (이메일 인증 전)
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        nickname,
        is_verified: false, // 이메일 인증 여부
        created_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error('Profile Creation Error:', profileError)
        throw new Error('프로필 생성 실패')
      }

      // 3. 이메일 인증 안내 메시지 표시
      setSuccess('이메일 인증 링크를 발송했습니다. 이메일을 확인해주세요.')
      setEmail('')
      setPassword('')
      setNickname('')
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
        {success && <div className="mb-4 text-green-500">{success}</div>}

        <div className="mt-12">
          <button
            type="submit"
            className="w-full cursor-pointer rounded bg-blue-500 p-2 font-bold text-white hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </div>
      </form>
    </div>
  )
}
