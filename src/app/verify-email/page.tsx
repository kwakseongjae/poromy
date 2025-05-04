'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { Mail, Loader2, Home, RefreshCw } from 'lucide-react'

export default function VerifyEmail() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user?.email_confirmed_at) {
          router.push(
            '/login?message=이메일 인증이 완료되었습니다. 로그인해주세요.'
          )
        }
      } catch (error) {
        console.error('Error checking email verification:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkEmailVerification()
  }, [router])

  useEffect(() => {
    if (!isLoading && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    } else if (countdown === 0) {
      router.push('/')
    }
  }, [isLoading, countdown, router])

  const handleResendEmail = async () => {
    setIsResending(true)
    setError(null)
    setSuccess(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user?.email) {
        throw new Error('이메일 정보를 찾을 수 없습니다.')
      }

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '이메일 재전송에 실패했습니다.')
      }

      setSuccess('이메일 인증 링크를 재전송했습니다. 이메일을 확인해주세요.')
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 px-4 pt-32 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            이메일 인증
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-gray-500">
                인증 상태를 확인하는 중...
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-lg text-gray-600">
                이메일로 발송된 인증 링크를 확인해주세요.
              </p>
              <p className="text-sm text-gray-500">
                인증이 완료되면 자동으로 로그인 페이지로 이동합니다.
              </p>
              <div className="mt-4 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-700">
                  이메일이 도착하지 않았다면 스팸함을 확인해주세요.
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    재전송 중...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    인증 이메일 재전송
                  </>
                )}
              </button>

              <div className="mt-6">
                <button
                  onClick={() => router.push('/')}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                >
                  <Home className="h-4 w-4" />
                  홈으로 이동 ({countdown}초)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
