'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LinkPreview from '@/components/LinkPreview'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useCreateAnswer } from '@/lib/react-query/hooks/inquiries-hooks'

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
  const [error, setError] = useState<string | null>(null)
  const { isAdmin, user } = useSupabase()
  const createAnswerMutation = useCreateAnswer()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('로그인이 필요합니다.')
      return
    }
    if (!isAdmin) {
      setError('관리자 권한이 필요합니다.')
      return
    }

    createAnswerMutation.mutate(
      {
        inquiryId,
        data: {
          content: content.trim(),
          url: url.trim() || null,
        },
      },
      {
        onSuccess: () => {
          setContent('')
          setUrl('')
          router.refresh()
        },
        onError: (err: any) => {
          setError(
            err.message || '답변 등록 중 오류가 발생했습니다.'
          )
        },
      }
    )
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
          disabled={createAnswerMutation.isPending}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        >
          {createAnswerMutation.isPending ? '등록 중...' : '답변 등록'}
        </button>
      </div>
    </form>
  )
}
