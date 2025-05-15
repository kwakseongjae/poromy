'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddTestUserForm() {
  const [count, setCount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

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

    setLoading(true)
    try {
      const res = await fetch('/api/admin/add-test-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: num }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(`${data.created}명의 테스트 유저가 추가되었습니다.`)
        router.refresh()
      } else {
        setError(data.error || '에러가 발생했습니다.')
      }
    } catch (err) {
      setError('에러가 발생했습니다.')
    } finally {
      setLoading(false)
    }
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
        disabled={loading}
      >
        {loading ? '추가 중...' : '테스트 유저 추가'}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
    </form>
  )
}
