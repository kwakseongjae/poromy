'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import LinkPreview from '@/components/LinkPreview'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AnswerFormProps {
  inquiryId: string
  userEmail: string
  inquiryTitle: string
  userNickname: string
}

export default function AnswerForm({
  inquiryId,
  userEmail,
  inquiryTitle,
  userNickname,
}: AnswerFormProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // 클라이언트 사이드에서 관리자 권한 확인
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        setIsAdmin(profile?.is_admin || false)
        console.log('AnswerForm - User ID:', user.id)
        console.log('AnswerForm - Is Admin:', profile?.is_admin)
      }
    }
    checkAdmin()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, nickname')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) {
        throw new Error('관리자 권한이 필요합니다.')
      }

      // 답변 등록
      const { error: insertError } = await supabase.from('answers').insert({
        inquiry_id: inquiryId,
        admin_id: user.id,
        content,
        url: url || null,
      })

      if (insertError) throw insertError

      // 이메일 발송 API 호출
      const emailResponse = await fetch('/api/email/answer-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inquiry: {
            id: inquiryId,
            title: inquiryTitle,
            userNickname,
          },
          answer: {
            content,
            url: url || null,
          },
          userEmail,
        }),
      })

      if (!emailResponse.ok) {
        console.error('이메일 발송 실패:', await emailResponse.json())
        // 이메일 발송 실패는 답변 등록을 막지 않음
      }

      // 성공 시 폼 초기화 및 페이지 새로고침
      setContent('')
      setUrl('')
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '답변 등록 중 오류가 발생했습니다.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          답변 내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="답변 내용을 입력해주세요"
          required
          className="mt-1 block w-full resize-none rounded-md border border-gray-300 p-2 shadow-sm transition-colors duration-200 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          rows={4}
        />
      </div>

      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700"
        >
          분석 결과 링크
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm transition-colors duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="분석 결과 링크를 입력해주세요"
        />
      </div>

      {url && (
        <div className="mt-2">
          <LinkPreview url={url} />
        </div>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? '등록 중...' : '답변 등록'}
        </button>
      </div>
    </form>
  )
}
