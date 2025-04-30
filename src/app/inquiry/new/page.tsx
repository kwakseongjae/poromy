'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { useSupabase } from '@/contexts/SupabaseContext'

export default function CreateInquiry() {
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useSupabase()
  const supabase = createBrowserSupabaseClient()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!user) {
        throw new Error('로그인이 필요합니다')
      }

      // 필수 필드 확인
      if (!title.trim() || !content.trim()) {
        throw new Error('제목과 내용을 입력해주세요')
      }

      // 문의 생성
      const { data, error: insertError } = await supabase
        .from('inquiries')
        .insert([
          {
            user_id: user.id,
            title,
            content,
            url: url.trim() || null,
          },
        ])
        .select()
        .single()

      if (insertError) throw insertError

      // 알림 이메일 발송 API 호출
      const emailResponse = await fetch('/api/email/inquiry-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inquiry: {
            id: data.id,
            title,
            content,
            url: url.trim() || null,
            userEmail: user.email,
            userNickname: user.user_metadata.nickname || '사용자',
          },
        }),
      })

      if (!emailResponse.ok) {
        console.error('이메일 발송 실패', await emailResponse.json())
      }

      // 성공 메시지 표시 및 리다이렉션
      alert(
        '문의가 성공적으로 등록되었습니다. 답변이 등록되면 이메일로 알려드립니다.'
      )
      router.push('/inquiry')
    } catch (error) {
      console.error('문의 등록 오류:', error)
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">채용공고 분석요청</h1>
      {error && (
        <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block font-medium">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border p-2"
            placeholder="채용공고의 원문제목을 입력해주세요   e.g. 프론트엔드 개발자(신입)"
            required
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block font-medium">채용공고 URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-md border p-2"
            placeholder="채용공고의 URL을 입력해주세요"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block font-medium">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-40 w-full rounded-md border p-2"
            placeholder={`분석 시 추가적으로 참고할 내용을 입력해주세요
기본적으로 입력하신 채용공고 URL에 있는 전체 내용을 참고하여 분석합니다.`}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              제출 중...
            </span>
          ) : (
            '문의 등록하기'
          )}
        </button>
      </form>
    </div>
  )
}
