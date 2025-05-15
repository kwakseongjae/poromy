import Link from 'next/link'

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-gray-200 bg-white/90 p-10 shadow-xl">
        <div className="flex flex-col items-center gap-2">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-10 w-10 text-red-500"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1
            className="text-5xl font-extrabold tracking-tight text-red-600"
            aria-label="403 Forbidden"
          >
            403
          </h1>
        </div>
        <p className="text-center text-lg text-gray-700" aria-live="polite">
          접근이 거부되었습니다.
          <br className="sm:hidden" /> (Forbidden)
        </p>
        <Link
          href="/"
          className="mt-2 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
          aria-label="홈으로 돌아가기"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  )
}
