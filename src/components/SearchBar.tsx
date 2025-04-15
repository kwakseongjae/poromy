import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, KeyboardEvent, useEffect } from 'react'

const SearchBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const query = searchParams.get('query')
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery.trim()) {
      params.set('query', searchQuery)
    } else {
      params.delete('query')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="relative w-full max-w-md overflow-hidden">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`관심있는 직무 혹은 기업을 검색해보세요`}
        className="focus:border-primary w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 pr-10 text-sm placeholder:text-ellipsis focus:outline-none"
        aria-label="검색"
      />
      <button
        onClick={handleSearch}
        className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-gray-500"
        aria-label="검색"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  )
}

export default SearchBar
