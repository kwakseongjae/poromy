'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { decrypt } from '@/utils/crypto'
import type { JobType } from '@/types/job'
import Image from 'next/image'
import { CheckIcon, CopyLinkIcon } from '@/assets'
import PromptContainer from '@/components/common/PromptContainer'
import { getProxyImageUrl } from '@/utils/image'
import { useMediaQuery } from 'react-responsive'

interface DeviceAwarePositionViewProps {
  redirectTo: string
  isMobileUA: boolean
}

export default function DeviceAwarePositionView({
  redirectTo,
  isMobileUA,
}: DeviceAwarePositionViewProps) {
  const router = useRouter()
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const [shouldRender, setShouldRender] = useState(false)
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [promptContent, setPromptContent] = useState<string>('')
  const [toastVisible, setToastVisible] = useState(false)
  const [toastActive, setToastActive] = useState(false)

  // 🚀 강화된 스크롤 제어: 페이지 진입 시 항상 상단으로 이동
  useEffect(() => {
    const handleScrollToTop = () => {
      // 즉시 스크롤을 상단으로 이동
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

      // 브라우저 호환성을 위한 대체 방법
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0)
      }

      // document.body와 document.documentElement 모두 제어
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }

    // 컴포넌트 마운트 즉시 실행
    handleScrollToTop()

    // 페이지 로드 완료 후에도 실행
    const timeoutIds = [
      setTimeout(handleScrollToTop, 50),
      setTimeout(handleScrollToTop, 100),
      setTimeout(handleScrollToTop, 200),
    ]

    // 페이지 가시성 변경 시에도 실행 (모바일에서 탭 전환 등)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleScrollToTop()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // cleanup
    return () => {
      timeoutIds.forEach(clearTimeout)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (isMobileUA || isMobile) {
      setShouldRender(true)
    } else {
      router.replace(redirectTo)
    }
  }, [isMobileUA, isMobile, router, redirectTo])

  useEffect(() => {
    const fetchJobAndPrompt = async () => {
      try {
        // URL에서 ID 추출 (redirectTo에서 id 파라미터 추출)
        const url = new URL(redirectTo, window.location.origin)
        const encryptedId = url.searchParams.get('id')

        if (!encryptedId) {
          setError('채용 공고를 찾을 수 없습니다.')
          setLoading(false)
          return
        }

        const decryptedId = decrypt(encryptedId)
        const jobId = parseInt(decryptedId, 10)

        if (isNaN(jobId)) {
          throw new Error('Invalid job ID')
        }

        // Fetch specific job from API
        const response = await fetch(`/api/jobs/${jobId}`)
        if (!response.ok) {
          throw new Error('Job not found')
        }

        const data = await response.json()
        const foundJob = data.job

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
        // 🚀 데이터 로딩 완료 후에도 스크롤 위치 확인
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        }, 50)
      }
    }

    if (shouldRender) {
      fetchJobAndPrompt()
    }
  }, [shouldRender, redirectTo])

  // 링크 복사 핸들러
  const handleCopyLink = async () => {
    if (!job) return
    try {
      await navigator.clipboard.writeText(window.location.href)
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

  if (!shouldRender) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    )
  }

  // Helper to calculate D-day or show '상시채용'
  const getDeadlineLabel = (deadline: string) => {
    if (deadline === '상시 채용') return '상시채용'
    const now = new Date()
    const end = new Date(deadline)

    if (now > end) return '마감'

    const isSameDay =
      now.getFullYear() === end.getFullYear() &&
      now.getMonth() === end.getMonth() &&
      now.getDate() === end.getDate()

    if (isSameDay) return 'D-0'

    const todayMidnight = new Date(now)
    todayMidnight.setHours(0, 0, 0, 0)
    const endMidnight = new Date(end)
    endMidnight.setHours(0, 0, 0, 0)
    const diff = Math.ceil(
      (endMidnight.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24)
    )
    return `D-${diff}`
  }

  // Get job type display name
  const getJobTypeDisplayName = (jobType: JobType): string => {
    return jobType
  }

  return (
    <div className="w-full bg-white p-4">
      <button
        type="button"
        onClick={() => router.push('/position')}
        className="mb-4 flex cursor-pointer items-center gap-2 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
        aria-label="목록으로 가기"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          strokeWidth={2}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        목록으로 가기
      </button>
      {loading ? (
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      ) : error || !job ? (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
          <p className="text-center font-medium whitespace-pre-line text-gray-600">
            {error || '채용 공고를 찾을 수 없습니다.'}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
          </div>
          {/* 모바일 채용정보 박스 */}
          <div className="mb-6 flex w-full items-start justify-between md:hidden">
            <div className="flex w-fit min-w-60 flex-col gap-2 rounded-lg bg-gray-50 px-6 py-4">
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
            <div
              className="ml-4 flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#7db6fa] transition-colors hover:bg-[#6395ee]"
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

          {/* 채용정보 요약란 */}
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

          <div className="mb-6">
            <PromptContainer
              type="position"
              title="AI 프롬프트"
              description={`${job.companyName}의 ${job.jobTitle} 포지션에 대한 AI 프롬프트입니다.\nCopy 버튼을 클릭하여 프롬프트를 복사한 후 ChatGPT, Claude 등 AI 솔루션에 붙여넣어 학습시키세요.`}
              prompt={promptContent}
            />
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
      )}
    </div>
  )
}
