import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, KeyboardEvent, useEffect } from 'react'

interface SearchBarProps {
  placeholder?: string
  size?: 'medium' | 'large'
}

const SearchBar = ({
  placeholder = '검색어를 입력하세요',
  size = 'medium',
}: SearchBarProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // 페이지 새로고침 시 URL 파라미터 초기화
    if (searchParams.get('query')) {
      router.replace(pathname)
    }
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set('query', searchQuery)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const sizeClasses = {
    medium: {
      container: 'max-w-md',
      input: 'py-2 text-sm',
      icon: 'h-5 w-5',
    },
    large: {
      container: 'max-w-3xl',
      input: 'py-3 text-base',
      icon: 'h-6 w-6',
    },
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${sizeClasses[size].container}`}
    >
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`focus:border-primary w-full rounded-lg border-2 border-gray-200 bg-white px-4 pr-10 placeholder:text-ellipsis focus:outline-none ${sizeClasses[size].input}`}
        aria-label="검색"
      />
      <button
        onClick={handleSearch}
        className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-gray-500"
        aria-label="검색"
      >
        <svg
          className={sizeClasses[size].icon}
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
