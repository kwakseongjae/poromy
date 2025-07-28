import { useState, KeyboardEvent, Suspense, useEffect } from 'react'
import { useSearchQuery } from '@/hooks/useQueryParams'

interface SearchBarProps {
  placeholder?: string
  size?: 'medium' | 'large'
}

const SearchBarContent = ({
  placeholder = '검색어를 입력하세요',
  size = 'medium',
}: SearchBarProps) => {
  const [query, setQuery] = useSearchQuery()
  const [inputValue, setInputValue] = useState(query || '')

  // URL 쿼리가 변경될 때 input 값 동기화
  useEffect(() => {
    setInputValue(query || '')
  }, [query])

  const handleSearch = () => {
    const trimmedValue = inputValue.trim()
    setQuery(trimmedValue || null)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
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
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`focus:border-primary w-full rounded-lg border-2 border-gray-200 bg-white px-4 pr-10 placeholder:text-ellipsis focus:outline-none ${sizeClasses[size].input}`}
        aria-label="검색"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-gray-500 hover:text-gray-700 transition-colors"
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

// 로딩 상태 컴포넌트
const SearchBarFallback = ({
  size = 'medium',
}: {
  size?: 'medium' | 'large'
}) => {
  const sizeClasses = {
    medium: {
      container: 'max-w-md',
      input: 'py-2 text-sm h-10',
    },
    large: {
      container: 'max-w-3xl',
      input: 'py-3 text-base h-12',
    },
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${sizeClasses[size].container}`}
    >
      <div
        className={`w-full animate-pulse rounded-lg border-2 border-gray-200 bg-gray-100 ${sizeClasses[size].input}`}
      />
    </div>
  )
}

const SearchBar = (props: SearchBarProps) => {
  return (
    <Suspense fallback={<SearchBarFallback size={props.size} />}>
      <SearchBarContent {...props} />
    </Suspense>
  )
}

export default SearchBar
