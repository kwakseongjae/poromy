'use client'

import { useEffect, useState, Fragment } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { decrypt, encrypt } from '@/utils/crypto'
import {
  sortedJobs as jobs,
  getAvailableJobTypes,
  getJobTypeDisplayName,
} from '@/constants/job.data'
import type { JobType } from '@/types/job'
import Image from 'next/image'
import Link from 'next/link'
import { LinkIcon } from '@/assets'
import SearchBar from '@/components/common/SearchBar'
import PromptContainer from '@/components/common/PromptContainer'
import { getProxyImageUrl } from '@/utils/image'

interface PreviewJob {
  id: string
  companyName: string
  jobTitle: string
  logoUrl: string
  conditions: string[]
  url: string
}

// Hook to detect mobile screen size
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return isMobile
}

// Helper to calculate D-day or show '상시채용'
const getDeadlineLabel = (deadline: string) => {
  if (deadline === '상시 채용') return '상시채용'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(deadline)
  end.setHours(0, 0, 0, 0)
  const diff = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diff < 0) return '마감'
  return `D-${diff}`
}

// Mobile JobList Component (inspired by company page UI)
function MobilePositionContent() {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | 'all'>('all')
  const itemsPerPage = 10

  const searchQuery = searchParams.get('query') || ''

  // Get available job types from actual data
  const availableJobTypes = getAvailableJobTypes()

  // Filter jobs based on search query and job type
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = searchQuery
      ? job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.conditions.some((condition) =>
          condition.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        job.qualifications.some((qualification) =>
          qualification.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        job.preferredQualifications.some((qualification) =>
          qualification.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true

    // Filter by job type
    if (jobTypeFilter === 'all') return matchesSearch
    return matchesSearch && job.jobType === jobTypeFilter
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

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
      <section className="mb-8">
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
      </section>

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
              const encryptedId = encrypt(job.id)
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
                          {job.conditions.map((condition, index) => (
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
                      <span className="ml-3 shrink-0 text-xs font-semibold text-gray-500">
                        {deadlineLabel}
                      </span>
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
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  currentPage === page
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-200 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

// Desktop PositionContent Component (existing)
function DesktopPositionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [previewJob, setPreviewJob] = useState<PreviewJob | null>(null)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const [promptContent, setPromptContent] = useState<string>('')

  const query = searchParams.get('query')
  const filteredJobs = query
    ? jobs.filter((job) => {
        const searchLower = query.toLowerCase()
        return (
          job.companyName.toLowerCase().includes(searchLower) ||
          job.jobTitle.toLowerCase().includes(searchLower) ||
          job.conditions.some((condition) =>
            condition.toLowerCase().includes(searchLower)
          ) ||
          job.qualifications.some((qualification) =>
            qualification.toLowerCase().includes(searchLower)
          ) ||
          job.preferredQualifications.some((qualification) =>
            qualification.toLowerCase().includes(searchLower)
          )
        )
      })
    : jobs

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
          return
        }

        const decryptedId = decrypt(encryptedId)
        const foundJob = jobs.find((job) => job.id === decryptedId)

        if (foundJob) {
          setJob(foundJob)
          setError(null)
          try {
            const prompt = await foundJob.prompt()
            setPromptContent(prompt)
          } catch (err) {
            console.error('Error fetching prompt:', err)
            setPromptContent('')
          }
        } else {
          setError('해당 채용 공고를 찾을 수 없습니다.')
          setJob(null)
          setPromptContent('')
        }
      } catch (err) {
        setError('잘못된 URL입니다.')
        console.error('Error decrypting job ID:', err)
        setJob(null)
        setPromptContent('')
      } finally {
        setLoading(false)
      }
    }

    fetchJobAndPrompt()
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

  return (
    <>
      <div className="relative flex py-8 pr-4">
        <div
          className="group sticky top-25 z-99 flex max-h-[75vh] w-60 flex-col items-start gap-2 px-4 transition-all duration-300 hover:w-1/3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            setIsVisible(false)
            setPreviewJob(null)
          }}
        >
          <div className="sticky top-0 z-10 w-full bg-white py-2">
            <SearchBar placeholder="관심있는 직무 혹은 기업을 검색해보세요" />
          </div>

          <div className="flex w-full flex-col gap-2 overflow-y-auto">
            {filteredJobs.length === 0 ? (
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
                const encryptedId = encrypt(jobItem.id)
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
              <div className="mb-6 flex items-center">
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
              <div className="mb-6">
                <h2 className="mb-2 text-lg font-semibold text-gray-900">
                  채용 링크
                </h2>
                <Link
                  href={job.url}
                  target="_blank"
                  className="inline-flex items-center rounded-full py-1 text-sm font-medium text-gray-800"
                >
                  <LinkIcon className="mr-1 h-4 w-4 flex-shrink-0" />
                  <span className="break-all">{job.url}</span>
                </Link>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-lg font-semibold text-gray-900">
                  채용 조건
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.conditions.map((condition: string, index: number) => (
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
    </>
  )
}

// Main PositionContent Component
export default function PositionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()

  // Check if there's an id parameter in the URL
  const encryptedId = searchParams.get('id')

  // Redirect to /position/[id] if mobile and id exists
  useEffect(() => {
    if (isMobile && encryptedId) {
      router.replace(`/position/${encryptedId}`)
    }
  }, [isMobile, encryptedId, router])

  // Render mobile or desktop view based on screen size
  return isMobile ? <MobilePositionContent /> : <DesktopPositionContent />
}
