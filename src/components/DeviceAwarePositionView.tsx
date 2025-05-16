'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { sortedJobs as jobs } from '@/constants/job.data'
import { decrypt } from '@/utils/crypto'
import Image from 'next/image'
import Link from 'next/link'
import { LinkIcon } from '@/assets'
import PromptContainer from '@/components/common/PromptContainer'
import { getProxyImageUrl } from '@/utils/image'

interface DeviceAwarePositionViewProps {
  redirectTo: string
  isMobileUA: boolean
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    // 초기 렌더링 시 안전하게 처리
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768
    }
    return false
  })

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth <= 768)
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])
  return isMobile
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

  if (!shouldRender) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    )
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
  )
}
