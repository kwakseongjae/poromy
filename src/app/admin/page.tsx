import Link from 'next/link'

export default function AdminPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center justify-center gap-8 rounded-lg bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">어드민 페이지</h1>
        <Link
          href="/admin/add-test-users"
          className="rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
          aria-label="테스트 유저 추가 페이지로 이동"
        >
          테스트 유저 추가
        </Link>
      </div>
    </main>
  )
}
