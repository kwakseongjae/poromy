'use client'

import { useState } from 'react'
import { useAddTestUsers } from '@/lib/react-query/hooks/admin-hooks'

export default function AddTestUserForm() {
  const [count, setCount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const addTestUsersMutation = useAddTestUsers()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const num = Number(count)
    if (
      !/^[0-9]+$/.test(count) ||
      !Number.isInteger(num) ||
      num < 1 ||
      num > 50
    ) {
      setError('1~50 사이의 숫자를 입력하세요.')
      return
    }

    addTestUsersMutation.mutate(
      { count: num },
      {
        onSuccess: (data) => {
          if (data.error) {
            // 부분 성공인 경우
            setSuccess(`${data.created}명의 테스트 유저가 추가되었습니다.`)
            setError(`일부 실패: ${data.error}`)
          } else {
            // 완전 성공인 경우
            setSuccess(`${data.created}명의 테스트 유저가 추가되었습니다.`)
          }
          setCount('')
        },
        onError: (err: any) => {
          // API 에러 처리 개선
          const errorMessage = err.response?.data?.error || err.message || '에러가 발생했습니다.'
          setError(errorMessage)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span>추가할 테스트 유저 수</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={count}
          onChange={(e) => setCount(e.target.value.replace(/[^0-9]/g, ''))}
          className="rounded border px-3 py-2"
          placeholder="1~50"
          autoComplete="off"
        />
      </label>
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        disabled={addTestUsersMutation.isPending}
      >
        {addTestUsersMutation.isPending ? '추가 중...' : '테스트 유저 추가'}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
    </form>
  )
}
