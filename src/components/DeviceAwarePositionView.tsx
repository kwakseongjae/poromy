'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { sortedJobs as jobs } from '@/constants/job.data'
import { decrypt } from '@/utils/crypto'
import Image from 'next/image'
import Link from 'next/link'
import { LinkIcon, CheckIcon, CopyLinkIcon } from '@/assets'
import PromptContainer from '@/components/common/PromptContainer'
import { getProxyImageUrl } from '@/utils/image'
import { useIsMobile } from '@/hooks/useIsMobile'
import { getJobTypeDisplayName } from '@/constants/job.data'

interface DeviceAwarePositionViewProps {
  redirectTo: string
  isMobileUA: boolean
}

export default function DeviceAwarePositionView({
  redirectTo,
  isMobileUA,
}: DeviceAwarePositionViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isScreenMobile = useIsMobile()
  const [shouldRender, setShouldRender] = useState(false)
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [promptContent, setPromptContent] = useState<string>('')
  const [toastVisible, setToastVisible] = useState(false)
  const [toastActive, setToastActive] = useState(false)

  useEffect(() => {
    const isMobile = isMobileUA || isScreenMobile
    if (isMobile) {
      setShouldRender(true)
    } else {
      router.push(redirectTo)
    }
  }, [isMobileUA, isScreenMobile, router, redirectTo])

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

  // 마감일을 '5월 18일 17:00' 형태로 포맷팅하는 함수
  const formatDeadline = (deadline: string) => {
    if (deadline === '상시 채용' || deadline === '마감') return deadline
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

  return (
    <div className="w-full bg-white p-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
        aria-label="뒤로가기"
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
        뒤로가기
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
                <span className="font-semibold text-blue-600">
                  {formatDeadline(job.deadline)}
                </span>
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
