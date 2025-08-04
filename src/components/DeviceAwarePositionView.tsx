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
import { useJob } from '@/lib/react-query/hooks/jobs-hooks'
import { useViewTracking } from '@/hooks/useViewTracking'

interface DeviceAwarePositionViewProps {
  redirectTo: string
  isMobileUA: boolean
  serverTime?: string
}

export default function DeviceAwarePositionView({
  redirectTo,
  isMobileUA,
  serverTime,
}: DeviceAwarePositionViewProps) {
  const router = useRouter()
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const [shouldRender, setShouldRender] = useState(isMobileUA)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastActive, setToastActive] = useState(false)
  const [jobId, setJobId] = useState<number | null>(null)
  const { trackView } = useViewTracking()
  
  // React Query를 사용한 job 데이터 페칭
  const { 
    data: job, 
    isLoading: loading, 
    error,
    isError
  } = useJob(jobId ? String(jobId) : '', !!jobId)
  
  const jobData = job?.job || job
  const promptContent = jobData?.prompt || ''

  // 디바이스 타입에 따른 렌더링 제어
  useEffect(() => {
    const shouldShowMobile = isMobileUA || isMobile
    setShouldRender(shouldShowMobile)
    
    if (!shouldShowMobile) {
      // Extract jobId from current URL path for desktop redirect tracking
      try {
        const currentPath = window.location.pathname
        const pathSegments = currentPath.split('/')
        const encryptedIdFromPath = pathSegments[pathSegments.length - 1] // Get last segment
        
        if (encryptedIdFromPath && encryptedIdFromPath !== 'position') {
          const decryptedId = decrypt(encryptedIdFromPath)
          const parsedJobId = parseInt(decryptedId, 10)
          
          if (!isNaN(parsedJobId)) {
            trackView(parsedJobId)
          }
        }
      } catch (err) {
        console.error('Error extracting job ID for desktop redirect tracking:', err)
      }
      
      router.replace(redirectTo)
    }
  }, [isMobileUA, isMobile, router, redirectTo, trackView])

  // 🚀 스크롤 제어: 페이지 진입 시 상단으로 이동
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }

    scrollToTop()
    
    const timeoutIds = [
      setTimeout(scrollToTop, 50),
      setTimeout(scrollToTop, 100),
      setTimeout(scrollToTop, 200),
    ]

    const handleVisibilityChange = () => {
      if (!document.hidden) scrollToTop()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      timeoutIds.forEach(clearTimeout)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // ID 파싱 및 설정
  useEffect(() => {
    if (shouldRender) {
      try {
        const url = new URL(redirectTo, window.location.origin)
        const encryptedId = url.searchParams.get('id')

        if (!encryptedId) return

        const decryptedId = decrypt(encryptedId)
        const parsedJobId = parseInt(decryptedId, 10)

        if (!isNaN(parsedJobId)) {
          setJobId(parsedJobId)
        }
      } catch (err) {
        console.error('Error parsing job ID:', err)
      }
    }
  }, [shouldRender, redirectTo])
  
  // 데이터 로딩 완료 후 스크롤 위치 조정 및 뷰 트래킹
  useEffect(() => {
    if (!loading && job && jobId) {
      // Track view when job data is loaded (for direct URL access)
      trackView(jobId)
      
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }, 50)
    }
  }, [loading, job, jobId, trackView])

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

  // Show loading during hydration or redirect
  if (isMobile === null || !shouldRender) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    )
  }

  // Helper to calculate D-day (서버 시간 기준)
  const getDeadlineLabel = (deadline: string) => {
    if (deadline === '상시 채용') return '상시채용'
    
    const now = serverTime ? new Date(serverTime) : new Date()
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

  const getJobTypeDisplayName = (jobType: JobType): string => jobType

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
      ) : isError || !job ? (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
          <p className="text-center font-medium whitespace-pre-line text-gray-600">
            {isError && error instanceof Error ? error.message : '채용 공고를 찾을 수 없습니다.'}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Image
                  src={getProxyImageUrl(jobData.logoUrl)}
                  alt={`${jobData.companyName} 로고`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {jobData.jobTitle}
                </h1>
                <p className="text-lg text-gray-600">{jobData.companyName}</p>
              </div>
            </div>
          </div>

          {/* 모바일 채용정보 박스 */}
          <div className="mb-6 flex w-full items-start justify-between md:hidden">
            <div className="flex w-fit min-w-60 flex-col gap-2 rounded-lg bg-gray-50 px-6 py-4">
              <div className="flex items-center">
                <span className="w-20 text-sm font-medium text-gray-400">직군</span>
                <span className="font-semibold text-gray-900">
                  {getJobTypeDisplayName(jobData.jobType)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-20 text-sm font-medium text-gray-400">직무</span>
                <span className="font-semibold text-gray-900">
                  {jobData.conditions[0]}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-20 text-sm font-medium text-gray-400">마감일</span>
                {(() => {
                  const deadlineLabel = getDeadlineLabel(jobData.deadline)
                  if (deadlineLabel === '마감') {
                    return (
                      <span className="font-semibold text-orange-500" aria-label="마감">
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
                href={jobData.url}
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
            <h2 className="mb-2 text-lg font-semibold text-gray-900">채용 조건</h2>
            <div className="flex flex-wrap gap-2">
              {jobData.conditions
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

          {jobData.positionDescription && (
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-semibold text-gray-900">포지션 소개</h2>
              <p className="whitespace-pre-line text-gray-700">
                {jobData.positionDescription}
              </p>
            </div>
          )}

          {jobData.mainTask && (
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-semibold text-gray-900">주요 업무</h2>
              <p className="whitespace-pre-line text-gray-700">
                {jobData.mainTask}
              </p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">지원 자격</h2>
            <ul className="list-inside list-disc space-y-2 text-gray-700">
              {jobData.qualifications.map((qualification: string, index: number) => (
                <li key={index}>{qualification}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">우대 사항</h2>
            <ul className="list-inside list-disc space-y-2 text-gray-700">
              {jobData.preferredQualifications.map((qualification: string, index: number) => (
                <li key={index}>{qualification}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <PromptContainer
              type="position"
              title="AI 프롬프트"
              description={`${jobData.companyName}의 ${jobData.jobTitle} 포지션에 대한 AI 프롬프트입니다.\nCopy 버튼을 클릭하여 프롬프트를 복사한 후 ChatGPT, Claude 등 AI 솔루션에 붙여넣어 학습시키세요.`}
              prompt={promptContent}
            />
          </div>

          {/* Toast: 링크 복사됨 */}
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