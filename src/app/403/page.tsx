import Link from 'next/link'

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">403</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">
          접근 권한이 없습니다
        </h2>
        <p className="mt-2 text-gray-600">
          이 페이지에 접근할 수 있는 권한이 없습니다.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  )
}