'use client'

import {
  useEffect,
  useState,
  Fragment,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { decrypt, encrypt } from '@/utils/crypto'
import type { JobType, Job } from '@/types/job'
import Image from 'next/image'
import Link from 'next/link'
import { CheckIcon, CopyLinkIcon, LinkIcon, ChevronIcon } from '@/assets'
import SearchBar from '@/components/common/SearchBar'
import PromptContainer from '@/components/common/PromptContainer'
import { getProxyImageUrl } from '@/utils/image'

interface PreviewJob {
  id: number
  companyName: string
  jobTitle: string
  logoUrl: string
  conditions: string[]
  url: string
}

// 마감일을 '5월 18일 17:00' 형태로 포맷팅하는 함수
const formatDeadline = (deadline: string) => {
  if (deadline === '상시 채용' || deadline === '마감') return deadline
  // YYYY-MM-DD 또는 YYYY-MM-DD HH:mm 형태 지원
  const dateMatch = deadline.match(
    /(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/
  )
  if (!dateMatch) return deadline
  const [, , month, day, hour, minute] = dateMatch
  const monthNum = Number(month)
  const dayNum = Number(day)
  let result = `${monthNum}월 ${dayNum}일`
  if (hour && minute) {
    result += ` ${hour}:${minute}`
  }
  return result
}

// Helper to calculate D-day or show '상시채용'
const getDeadlineLabel = (deadline: string) => {
  if (deadline === '상시 채용') return '상시채용'
  const now = new Date()
  const end = new Date(deadline)

  if (now > end) return '마감'

  // 날짜가 오늘이고, 아직 마감 시간이 안 지났으면 D-0
  const isSameDay =
    now.getFullYear() === end.getFullYear() &&
    now.getMonth() === end.getMonth() &&
    now.getDate() === end.getDate()

  if (isSameDay) return 'D-0'

  // 미래면 D-n
  const todayMidnight = new Date(now)
  todayMidnight.setHours(0, 0, 0, 0)
  const endMidnight = new Date(end)
  endMidnight.setHours(0, 0, 0, 0)
  const diff = Math.ceil(
    (endMidnight.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24)
  )
  return `D-${diff}`
}

// Get available job types from jobs data
const getAvailableJobTypes = (jobs: Job[]): JobType[] => {
  return Array.from(new Set(jobs.map((job) => job.jobType))) as JobType[]
}

// Get job type display name
const getJobTypeDisplayName = (jobType: JobType): string => {
  return jobType
}

// 일반적인 게시판 스타일 페이지네이션을 위한 헬퍼 함수
const getBoardStylePagination = (currentPage: number, totalPages: number) => {
  const pageSize = 5 // 한 번에 보여줄 페이지 번호 개수
  const pageGroup = Math.floor((currentPage - 1) / pageSize) // 현재 페이지가 속한 그룹 (0부터 시작)
  const startPage = pageGroup * pageSize + 1 // 그룹의 시작 페이지
  const endPage = Math.min(startPage + pageSize - 1, totalPages) // 그룹의 끝 페이지

  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  const hasPrev = currentPage > 1 // 첫 페이지가 아닌지
  const hasNext = currentPage < totalPages // 마지막 페이지가 아닌지

  return {
    pages,
    hasPrev,
    hasNext,
    prevPage: currentPage - 1, // 이전 페이지
    nextPage: currentPage + 1, // 다음 페이지
  }
}

// Mobile JobList Component (inspired by company page UI)
function MobilePositionContent() {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | 'all'>('all')
  const [jobs, setJobs] = useState<Job[]>([])
  const [availableJobTypes, setAvailableJobTypes] = useState<JobType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const itemsPerPage = 10

  const searchQuery = searchParams.get('query') || ''

  // Fetch jobs from server with pagination
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)

        let response

        // 검색 쿼리가 있는 경우 검색 API 사용 (페이지네이션 지원)
        if (searchQuery) {
          response = await fetch(
            `/api/jobs?query=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=${itemsPerPage}`,
            {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache',
              },
            }
          )
        }
        // 필터가 있는 경우 전체 데이터 가져오기 (클라이언트 사이드 필터링)
        else if (jobTypeFilter !== 'all') {
          response = await fetch('/api/jobs', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          })
        }
        // 기본 페이지네이션
        else {
          response = await fetch(
            `/api/jobs?page=${currentPage}&limit=${itemsPerPage}`,
            {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache',
              },
            }
          )
        }

        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }

        const data = await response.json()
        setJobs(data.jobs || [])
        setTotalCount(data.totalCount || data.jobs?.length || 0)
        setHasMore(data.hasMore || false)

        // Extract unique job types from the jobs
        const jobTypes = Array.from(
          new Set(data.jobs?.map((job: Job) => job.jobType) || [])
        ) as JobType[]
        setAvailableJobTypes(jobTypes)
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setJobs([])
        setAvailableJobTypes([])
        setTotalCount(0)
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [currentPage, searchQuery, jobTypeFilter])

  // Filter jobs based on job type (only for job type filter, search is handled server-side)
  const filteredJobs =
    jobTypeFilter !== 'all'
      ? jobs.filter((job) => job.jobType === jobTypeFilter)
      : jobs

  // Calculate pagination for filtered results
  const totalPages = searchQuery
    ? Math.ceil(totalCount / itemsPerPage) // 검색 시 서버에서 받은 totalCount 사용
    : jobTypeFilter !== 'all'
      ? Math.ceil(filteredJobs.length / itemsPerPage) // 필터링 시 클라이언트 사이드 계산
      : Math.ceil(totalCount / itemsPerPage) // 기본 서버 페이지네이션

  const currentJobs = searchQuery
    ? jobs // 검색 시 서버에서 이미 페이지네이션된 결과
    : jobTypeFilter !== 'all'
      ? filteredJobs.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        ) // 필터링 시 클라이언트 사이드 페이지네이션
      : filteredJobs // 기본 서버 페이지네이션

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [jobTypeFilter, searchQuery])

  const encryptedId = searchParams.get('id')

  if (encryptedId) {
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-screen items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Section */}
      <section className="mb-6">
        <h1 className="mb-6 text-center text-3xl font-bold">
          원하는 채용 공고를 찾아보세요
        </h1>
        <div className="mx-auto flex justify-center">
          <SearchBar
            placeholder="기업명, 직무, 키워드 등을 검색해보세요"
            size="large"
          />
        </div>
      </section>

      {/* Filter Section */}
      {/* <section className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setJobTypeFilter('all')}
            className={`rounded-full px-4 py-2 text-sm ${
              jobTypeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
            aria-label="모든 채용공고 보기"
          >
            전체
          </button>
          {availableJobTypes.map((jobType) => (
            <button
              key={jobType}
              onClick={() => setJobTypeFilter(jobType)}
              className={`rounded-full px-4 py-2 text-sm ${
                jobTypeFilter === jobType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
              aria-label={`${getJobTypeDisplayName(jobType)} 보기`}
            >
              {getJobTypeDisplayName(jobType)}
            </button>
          ))}
        </div>
      </section> */}

      {/* Job Grid */}
      <section className="mb-8">
        {currentJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-gray-600">
              {searchQuery
                ? `'${searchQuery}'에 대한 검색 결과가 없습니다.`
                : '아직 등록된 채용공고가 없습니다.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {currentJobs.map((job) => {
              const encryptedId = encrypt(String(job.id))
              const deadlineLabel = getDeadlineLabel(job.deadline)

              // Check if job is new (uploaded within 24 hours)
              const uploadedAtDate = new Date(job.uploadedAt)
              const now = new Date()
              const diffMs = now.getTime() - uploadedAtDate.getTime()
              const isNew = diffMs >= 0 && diffMs < 24 * 60 * 60 * 1000

              return (
                <Link
                  key={job.id}
                  href={`/position/${encryptedId}`}
                  className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:border-blue-500 hover:shadow-lg"
                >
                  <div className="p-4">
                    <div className="mb-4 flex items-start">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                        <Image
                          src={getProxyImageUrl(job.logoUrl)}
                          alt={`${job.companyName} 로고`}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="ml-4 min-w-0 flex-1 overflow-hidden">
                        <h2 className="line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                          {job.jobTitle}
                        </h2>
                        <div className="inline-flex items-center text-sm text-gray-500">
                          <span>{job.companyName}</span>
                          {isNew && (
                            <>
                              <span
                                className="mx-2 inline-block h-4 w-px bg-gray-300"
                                aria-hidden="true"
                              />
                              <span
                                className="text-blue-600"
                                aria-label="오늘 업로드"
                              >
                                New
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tags and Deadline */}
                    <div className="flex w-full items-center justify-between">
                      <div className="relative flex-1 overflow-hidden">
                        <div className="flex gap-2 overflow-hidden">
                          {job.conditions.slice(1).map((condition, index) => (
                            <span
                              key={index}
                              className="inline-flex shrink-0 items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                        {/* Gradient fade-out effect */}
                        <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent" />
                      </div>
                      {deadlineLabel === '마감' ? (
                        <span
                          className="ml-3 shrink-0 text-xs font-semibold text-orange-500"
                          aria-label="마감"
                        >
                          마감
                        </span>
                      ) : (
                        <span className="ml-3 shrink-0 text-xs font-semibold text-gray-500">
                          {deadlineLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="flex justify-center">
          <div className="flex items-center gap-2">
            {(() => {
              const pagination = getBoardStylePagination(
                currentPage,
                totalPages
              )

              return (
                <>
                  {/* 이전 그룹 버튼 */}
                  <button
                    onClick={() => handlePageChange(pagination.prevPage)}
                    disabled={!pagination.hasPrev}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                    aria-label="이전 페이지 그룹"
                  >
                    <ChevronIcon
                      className="h-5 w-5 rotate-270"
                      fill="#6B7280"
                    />
                  </button>

                  {/* 페이지 번호 버튼들 */}
                  {pagination.pages.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`h-12 w-12 rounded font-medium transition-colors ${
                        currentPage === page
                          ? 'border border-blue-500 bg-blue-500 text-white'
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-label={`${page}페이지`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}

                  {/* 다음 그룹 버튼 */}
                  <button
                    onClick={() => handlePageChange(pagination.nextPage)}
                    disabled={!pagination.hasNext}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                    aria-label="다음 페이지 그룹"
                  >
                    <ChevronIcon className="h-5 w-5 rotate-90" fill="#6B7280" />
                  </button>
                </>
              )
            })()}
          </div>
        </section>
      )}
    </div>
  )
}

function DesktopPositionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const targetJobRef = useRef<HTMLAnchorElement>(null)
  const loadingRequestRef = useRef<boolean>(false) // 중복 요청 방지용 ref

  const [jobs, setJobs] = useState<Job[]>([])
  const [jobsLoading, setJobsLoading] = useState<boolean>(true)
  const [job, setJob] = useState<Job | null>(null)
  const [promptContent, setPromptContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [hasScrolledToTarget, setHasScrolledToTarget] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [previewJob, setPreviewJob] = useState<PreviewJob | null>(null)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [toastVisible, setToastVisible] = useState<boolean>(false)
  const [toastActive, setToastActive] = useState<boolean>(false)

  // Fetch jobs from server with pagination for infinite scroll
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true)
        setLoadingMore(false) // 로딩 상태 초기화
        setHasMore(true) // 초기화

        let response

        // 검색 쿼리가 있는 경우 검색 API 사용 (오프셋 기반)
        if (query) {
          response = await fetch(
            `/api/jobs?query=${encodeURIComponent(query)}&offset=0&limit=20`,
            {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache',
              },
            }
          )
        }
        // 검색 쿼리가 없는 경우 offset 기반으로 20개 시작
        else {
          response = await fetch('/api/jobs?offset=0&limit=20', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          })
        }

        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }

        const data = await response.json()
        setJobs(data.jobs || [])
        setHasMore(data.hasMore || false)
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setJobs([])
        setHasMore(false)
      } finally {
        setJobsLoading(false)
      }
    }

    fetchJobs()
  }, [query])

  // Load more jobs for infinite scroll
  const loadMoreJobs = useCallback(async () => {
    // 더 강력한 중복 요청 방지 - ref를 사용한 추가 체크
    if (loadingMore || !hasMore || loadingRequestRef.current) {
      return
    }

    try {
      loadingRequestRef.current = true
      setLoadingMore(true)

      // 현재 jobs 배열 길이를 기반으로 offset 계산
      const currentOffset = jobs.length

      let response

      // 검색 쿼리가 있는 경우 검색 API 사용
      if (query) {
        response = await fetch(
          `/api/jobs?query=${encodeURIComponent(query)}&offset=${currentOffset}&limit=20`,
          {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          }
        )
      }
      // 기본 무한스크롤
      else {
        response = await fetch(`/api/jobs?offset=${currentOffset}&limit=20`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
      }

      if (!response.ok) {
        throw new Error('Failed to fetch more jobs')
      }

      const data = await response.json()

      // 중복 제거 로직 - 기존 jobs의 id와 비교하여 중복 제거
      const existingIds = new Set(jobs.map((job) => job.id))
      const newJobs = (data.jobs || []).filter(
        (job: any) => !existingIds.has(job.id)
      )

      // 새로운 jobs가 없으면 hasMore를 false로 설정
      if (newJobs.length === 0) {
        setHasMore(false)
        return
      }

      setJobs((prevJobs) => {
        // 이중 체크: prevJobs 기준으로 한번 더 중복 제거
        const prevIds = new Set(prevJobs.map((job) => job.id))
        const finalNewJobs = newJobs.filter((job: any) => !prevIds.has(job.id))

        // 중복이 제거된 후에도 새로운 jobs가 없으면 그대로 반환
        if (finalNewJobs.length === 0) {
          return prevJobs
        }

        return [...prevJobs, ...finalNewJobs]
      })

      setHasMore(data.hasMore || false)
    } catch (err) {
      console.error('Error loading more jobs:', err)
    } finally {
      loadingRequestRef.current = false
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, query, jobs.length])

  // Handle scroll for infinite scroll
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return // 무한스크롤 활성화 (검색 시에도 동작)

    let scrollTimeout: NodeJS.Timeout | null = null

    const handleScroll = () => {
      // 디바운싱으로 스크롤 이벤트 제한
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }

      scrollTimeout = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = container
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100

        // loadingMore 상태와 hasMore 상태를 현재 값으로 체크
        if (isNearBottom && hasMore && !loadingMore) {
          loadMoreJobs()
        }
      }, 100) // 100ms 디바운싱
    }

    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [hasMore, loadingMore, loadMoreJobs]) // query 의존성 제거 (검색 시에도 무한스크롤 동작)

  // 검색 시에는 서버에서 이미 필터링된 결과를 받아오므로 클라이언트 필터링 불필요
  const filteredJobs = jobs

  useEffect(() => {
    const fetchJobAndPrompt = async () => {
      try {
        const encryptedId = searchParams.get('id')
        if (!encryptedId) {
          setError(
            '채용 공고를 선택하면\n채용 공고 분석 프롬프트를 확인할 수 있습니다.'
          )
          setLoading(false)
          setJob(null)
          setPromptContent('')
          setHasScrolledToTarget(false)
          return
        }

        const decryptedId = decrypt(encryptedId)

        // Fetch specific job from API
        const response = await fetch(`/api/jobs/${decryptedId}`)
        if (!response.ok) {
          throw new Error('Job not found')
        }

        const { job: foundJob } = await response.json()

        if (foundJob) {
          setJob(foundJob)
          setError(null)
          setPromptContent(foundJob.prompt || '')
        } else {
          setError('해당 채용 공고를 찾을 수 없습니다.')
          setJob(null)
          setPromptContent('')
        }
      } catch (err) {
        setError('잘못된 URL입니다.')
        console.error('Error fetching job:', err)
        setJob(null)
        setPromptContent('')
      } finally {
        setLoading(false)
      }
    }

    fetchJobAndPrompt()
  }, [searchParams])

  // Set initial scroll position before paint
  useLayoutEffect(() => {
    const encryptedId = searchParams.get('id')
    if (!encryptedId || !scrollContainerRef.current || hasScrolledToTarget) {
      return
    }

    try {
      const decryptedId = decrypt(encryptedId)

      // If we have the target job element, use it for precise positioning
      if (!loading && job && targetJobRef.current) {
        const container = scrollContainerRef.current
        const target = targetJobRef.current

        // Get the previous sibling element (item above the selected one)
        const previousItem = target.previousElementSibling as HTMLElement

        if (previousItem) {
          // Scroll to show the previous item at the top
          container.scrollTop = previousItem.offsetTop
        } else {
          // If there's no previous item (selected is first), just show it at the top
          container.scrollTop = 0
        }
      } else {
        // Fallback: calculate position based on actual DOM elements
        const jobIndex = filteredJobs.findIndex(
          (j) => j.id === Number(decryptedId)
        )

        if (jobIndex !== -1) {
          // Get all job item elements in the container
          const container = scrollContainerRef.current
          const jobElements = container.querySelectorAll('a[href*="/position"]')

          if (jobElements.length > 0) {
            // If we have actual elements, use their real positions
            const targetIndex = Math.min(jobIndex, jobElements.length - 1)
            const targetElement = jobElements[targetIndex] as HTMLElement

            // Show the previous item at the top (if exists)
            if (targetIndex > 0) {
              const previousElement = jobElements[
                targetIndex - 1
              ] as HTMLElement
              container.scrollTop = previousElement.offsetTop
            } else {
              container.scrollTop = 0
            }
          } else {
            // Last resort: use measured height of a single item if available
            // Wait a bit for elements to render, then measure
            requestAnimationFrame(() => {
              const jobElements = container.querySelectorAll(
                'a[href*="/position"]'
              )
              if (jobElements.length > 0) {
                const firstElement = jobElements[0] as HTMLElement
                const itemHeight = firstElement.offsetHeight
                const computedStyle = window.getComputedStyle(firstElement)
                const marginBottom = parseInt(computedStyle.marginBottom) || 0
                const totalItemHeight = itemHeight + marginBottom + 8 // 8px gap from CSS

                // Calculate scroll position based on measured height
                const scrollPosition =
                  jobIndex > 0 ? (jobIndex - 1) * totalItemHeight : 0
                container.scrollTop = scrollPosition

                // Mark as scrolled after measurement
                setHasScrolledToTarget(true)
              }
            })
            return // Exit early to let requestAnimationFrame handle it
          }
        }
      }

      // Mark that we've scrolled to prevent future automatic scrolls
      setHasScrolledToTarget(true)
    } catch (err) {
      console.error('Error setting initial scroll:', err)
    }
  }, [loading, job, filteredJobs, searchParams, hasScrolledToTarget])

  // Only reset scroll state on initial mount, not when searchParams change
  useEffect(() => {
    // This effect only runs once on mount
    const encryptedId = searchParams.get('id')

    // If there's no id on initial mount, mark as already scrolled
    // This prevents scrolling when user clicks items after entering /position without id
    setHasScrolledToTarget(!encryptedId)
  }, []) // Empty dependency array - only runs on mount

  // Handle URL changes - if id is removed, prevent future scrolling
  useEffect(() => {
    const encryptedId = searchParams.get('id')

    // If id is removed (user clicked selected item to deselect),
    // mark as scrolled to prevent scrolling when selecting new items
    if (!encryptedId) {
      setHasScrolledToTarget(true)
    }
  }, [searchParams])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isHovered) {
      timeoutId = setTimeout(() => {
        setIsVisible(true)
      }, 200)
    } else {
      setIsVisible(false)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isHovered])

  // 복사 버튼 클릭 핸들러
  const handleCopyLink = async () => {
    // 현재 포지션의 URL 복사
    const encryptedId = searchParams.get('id')
    let url = ''
    if (encryptedId) {
      url = `${process.env.NEXT_PUBLIC_APP_URL}/position/${encryptedId}`
    } else {
      url = `${process.env.NEXT_PUBLIC_APP_URL}/position`
    }
    try {
      await navigator.clipboard.writeText(url)
      setToastVisible(true)
      setToastActive(true)
      setTimeout(() => {
        setToastActive(false)
        setTimeout(() => setToastVisible(false), 300)
      }, 2000)
    } catch (err) {
      console.error('Error copying link:', err)
    }
  }

  return (
    <>
      <div className="relative flex py-8 pr-4">
        <div
          className="group sticky top-25 z-99 flex max-h-[75vh] w-60 flex-col items-start px-4 pt-2 transition-all duration-300 hover:w-1/3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            setIsVisible(false)
            setPreviewJob(null)
          }}
        >
          <div className="sticky top-0 z-10 w-full bg-white pb-2">
            <SearchBar placeholder="관심있는 직무 혹은 기업을 검색해보세요" />
          </div>

          <div
            ref={scrollContainerRef}
            className="flex w-full flex-col gap-2 overflow-y-auto pt-2"
          >
            {jobsLoading ? (
              <div className="flex h-64 w-full items-center justify-center">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex h-64 w-full flex-col items-center justify-center gap-2">
                <p className="text-center text-sm whitespace-pre-line text-gray-500">
                  <span className="text-[#252525]">
                    일치하는 검색결과가 없습니다
                  </span>
                  <br />
                  이런 검색어는 어떠신가요?
                </p>
                <div className="mt-4 flex items-center gap-2">
                  {['개발', '신입', '대졸'].map((suggestion, index) => (
                    <Fragment key={suggestion}>
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(
                            searchParams.toString()
                          )
                          params.set('query', suggestion)
                          router.push(`/position?${params.toString()}`)
                        }}
                        className="text-primary cursor-pointer text-sm"
                        aria-label={`${suggestion} 검색`}
                      >
                        {suggestion}
                      </button>
                      {index < 2 && <div className="h-3 w-px bg-gray-200" />}
                    </Fragment>
                  ))}
                </div>
              </div>
            ) : (
              filteredJobs.map((jobItem) => {
                const encryptedId = encrypt(String(jobItem.id))
                const isCurrentJob = job?.id === jobItem.id

                const params = new URLSearchParams(searchParams.toString())
                if (isCurrentJob) {
                  params.delete('id')
                } else {
                  params.set('id', encryptedId)
                }

                return (
                  <Link
                    key={jobItem.id}
                    ref={isCurrentJob ? targetJobRef : undefined}
                    href={`/position?${params.toString()}`}
                    className={`flex min-h-12 w-full items-center gap-2 rounded-lg px-4 ${
                      isCurrentJob
                        ? 'bg-primary hover:bg-primary-hover text-white'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      setPreviewPosition({
                        x: rect.right + 10,
                        y: rect.top,
                      })

                      setPreviewJob(jobItem)
                    }}
                    onMouseLeave={() => {
                      setPreviewJob(null)
                    }}
                    onClick={() => {
                      setPreviewJob(null)
                    }}
                  >
                    <Image
                      src={getProxyImageUrl(jobItem.logoUrl)}
                      alt={jobItem.companyName}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-lg border border-gray-200"
                    />

                    <div className="flex w-full flex-col items-start overflow-hidden">
                      <span className="truncate text-sm font-medium">
                        {jobItem.companyName}
                      </span>
                      {isHovered && (
                        <span
                          className={`truncate text-xs transition-all duration-200 ease-in-out ${
                            isCurrentJob ? 'text-white/80' : 'text-gray-500'
                          } ${
                            isVisible
                              ? 'w-auto max-w-full opacity-100'
                              : 'w-0 max-w-0 overflow-hidden opacity-0'
                          }`}
                        >
                          {jobItem.jobTitle}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })
            )}

            {/* Loading indicator for infinite scroll */}
            {loadingMore && (
              <div className="flex w-full items-center justify-center py-4">
                <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
              </div>
            )}
          </div>

          {previewJob && (
            <div
              className="fixed z-50 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
              style={{
                left: `${previewPosition.x}px`,
                top: `${previewPosition.y}px`,
              }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                  <Image
                    src={getProxyImageUrl(previewJob.logoUrl)}
                    alt={previewJob.companyName}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {previewJob.companyName}
                  </h3>
                  <p className="text-sm text-gray-600">{previewJob.jobTitle}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {previewJob.conditions.slice(0, 3).map((condition, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                  >
                    {condition}
                  </span>
                ))}
                {previewJob.conditions.length > 3 && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    +{previewJob.conditions.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="relative w-3/4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="flex min-h-[75vh] w-full items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
            </div>
          ) : error || !job ? (
            <div className="flex min-h-[75vh] w-full flex-col items-center justify-center gap-4">
              <p className="text-center font-medium whitespace-pre-line text-gray-600">
                {error || '채용 공고를 찾을 수 없습니다.'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex w-full items-center justify-between">
                {/* Left: Logo + Company/Position */}
                <div className="flex items-center">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                    <Image
                      src={getProxyImageUrl(job.logoUrl)}
                      alt={`${job.companyName} 로고`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {job.jobTitle}
                    </h1>
                    <p className="text-lg text-gray-600">{job.companyName}</p>
                  </div>
                </div>
                {/* Right: CopyLinkIcon */}
                <div
                  className="flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#7db6fa] transition-colors hover:bg-[#6395ee]"
                  tabIndex={0}
                  aria-label="채용공고 링크 복사"
                  role="button"
                  onClick={handleCopyLink}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleCopyLink()
                    }
                  }}
                >
                  <CopyLinkIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="mb-6 flex w-fit min-w-60 flex-col gap-2 rounded-lg bg-gray-50 px-6 py-4">
                <div className="flex items-center">
                  <span className="w-20 text-sm font-medium text-gray-400">
                    직군
                  </span>
                  <span className="font-semibold text-gray-900">
                    {getJobTypeDisplayName(job.jobType)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-sm font-medium text-gray-400">
                    직무
                  </span>
                  <span className="font-semibold text-gray-900">
                    {job.conditions[0]}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-sm font-medium text-gray-400">
                    마감일
                  </span>
                  {(() => {
                    const deadlineLabel = getDeadlineLabel(job.deadline)
                    if (deadlineLabel === '마감') {
                      return (
                        <span
                          className="font-semibold text-orange-500"
                          aria-label="마감"
                        >
                          마감
                        </span>
                      )
                    }
                    return (
                      <span className="font-semibold text-blue-600">
                        {deadlineLabel}
                      </span>
                    )
                  })()}
                </div>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                  tabIndex={0}
                  aria-label="지원하기"
                >
                  <CheckIcon className="h-4 w-4" />
                  지원하기
                </a>
              </div>
              <div>
                <div className="mb-6">
                  <h2 className="mb-2 text-lg font-semibold text-gray-900">
                    채용 조건
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.conditions
                      .slice(1)
                      .map((condition: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
                        >
                          {condition}
                        </span>
                      ))}
                  </div>
                </div>
                {job.positionDescription && (
                  <div className="mb-6">
                    <h2 className="mb-2 text-lg font-semibold text-gray-900">
                      포지션 소개
                    </h2>
                    <p className="whitespace-pre-line text-gray-700">
                      {job.positionDescription}
                    </p>
                  </div>
                )}
                {job.mainTask && (
                  <div className="mb-6">
                    <h2 className="mb-2 text-lg font-semibold text-gray-900">
                      주요 업무
                    </h2>
                    <p className="whitespace-pre-line text-gray-700">
                      {job.mainTask}
                    </p>
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="mb-2 text-lg font-semibold text-gray-900">
                    지원 자격
                  </h2>
                  <ul className="list-inside list-disc space-y-2 text-gray-700">
                    {job.qualifications.map(
                      (qualification: string, index: number) => (
                        <li key={index}>{qualification}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="mb-6">
                  <h2 className="mb-2 text-lg font-semibold text-gray-900">
                    우대 사항
                  </h2>
                  <ul className="list-inside list-disc space-y-2 text-gray-700">
                    {job.preferredQualifications.map(
                      (qualification: string, index: number) => (
                        <li key={index}>{qualification}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <PromptContainer
                  type="position"
                  title="AI 프롬프트"
                  description={`${job.companyName}의 ${job.jobTitle} 포지션에 대한 AI 프롬프트입니다.\nCopy 버튼을 클릭하여 프롬프트를 복사한 후 ChatGPT, Claude 등 AI 솔루션에 붙여넣어 학습시키세요.`}
                  prompt={promptContent}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {/* Toast/Modal: 링크 복사됨 */}
      {toastVisible && (
        <div
          className={`fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center rounded-lg bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-lg transition-all ${toastActive ? 'animate-toast-in' : 'animate-toast-out'}`}
          role="status"
          aria-live="polite"
        >
          링크가 복사되었습니다
        </div>
      )}
    </>
  )
}

// Main PositionContent Component
export default function PositionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  // Check if there's an id parameter in the URL
  const encryptedId = searchParams.get('id')

  // Determine if device is mobile after hydration
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Redirect to /position/[id] if mobile and id exists
  useEffect(() => {
    if (isMobile === true && encryptedId) {
      router.replace(`/position/${encryptedId}`)
    }
  }, [isMobile, encryptedId, router])

  // Show loading screen during hydration to prevent mismatch
  if (isMobile === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-screen items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  // Render mobile or desktop view based on screen size
  return isMobile ? <MobilePositionContent /> : <DesktopPositionContent />
}
