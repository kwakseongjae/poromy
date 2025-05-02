'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'

export default function VerifyEmail() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    const checkEmailVerification = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email_confirmed_at) {
        router.push(
          '/login?message=이메일 인증이 완료되었습니다. 로그인해주세요.'
        )
      }
    }

    checkEmailVerification()
  }, [router])

  return (
    <div className="mx-auto mt-16 max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <h1 className="mt-4 mb-8 text-center text-xl font-bold">이메일 인증</h1>
      <div className="text-center">
        <p className="mb-4">이메일로 발송된 인증 링크를 확인해주세요.</p>
        <p className="text-sm text-gray-500">
          인증이 완료되면 자동으로 로그인 페이지로 이동합니다.
        </p>
      </div>
    </div>
  )
}
