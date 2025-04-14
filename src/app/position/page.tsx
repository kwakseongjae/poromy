'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { decrypt, encrypt } from '@/utils/crypto'
import { jobs } from '@/constants/job.data'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { LinkIcon } from '@/components/icons/LinkIcon'

interface PreviewJob {
  id: string
  companyName: string
  jobTitle: string
  logoUrl: string
  conditions: string[]
  url: string
}

export default function PositionDetail() {
  const searchParams = useSearchParams()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [previewJob, setPreviewJob] = useState<PreviewJob | null>(null)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    try {
      const encryptedId = searchParams.get('id')
      if (!encryptedId) {
        setError('잘못된 URL입니다.')
        setLoading(false)
        return
      }

      const decryptedId = decrypt(encryptedId)

      // Find job posting with decrypted ID
      const foundJob = jobs.find((job) => job.id === decryptedId)

      if (foundJob) {
        setJob(foundJob)
      } else {
        setError('채용 공고를 찾을 수 없습니다.')
      }
    } catch (err) {
      setError('잘못된 URL입니다.')
      console.error('Error decrypting job ID:', err)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isHovered) {
      timeoutId = setTimeout(() => {
        setIsVisible(true)
      }, 300)
    } else {
      setIsVisible(false)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isHovered])

  // 구조화된 데이터 생성
  const structuredData = job
    ? {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.jobTitle,
        companyName: job.companyName,
        jobLocation:
          job.conditions.find(
            (c: string) =>
              c.includes('서울') ||
              c.includes('성남') ||
              c.includes('수원') ||
              c.includes('대전') ||
              c.includes('제주') ||
              c.includes('판교')
          ) || '미지정',
        employmentType:
          job.conditions.find(
            (c: string) => c.includes('신입') || c.includes('경력')
          ) || '미지정',
        educationRequirements:
          job.conditions.find(
            (c: string) =>
              c.includes('대졸') || c.includes('석사') || c.includes('박사')
          ) || '미지정',
        url: window.location.href,
      }
    : null

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium text-gray-700">
          {error || '채용 공고를 찾을 수 없습니다.'}
        </p>
        <Link href="/" className="text-primary hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <>
      {structuredData && (
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <div className="flex py-8">
        <div
          className="group relative flex max-h-[75vh] w-60 flex-col items-start gap-2 overflow-y-auto px-4 transition-all duration-300 hover:w-1/3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            setPreviewJob(null)
          }}
        >
          {jobs.map((jobItem) => {
            const encryptedId = encrypt(jobItem.id)
            const isCurrentJob = jobItem.id === job.id

            return (
              <Link
                key={jobItem.id}
                href={`/position?id=${encryptedId}`}
                className={`flex h-12 w-full items-center gap-2 rounded-lg px-4 ${
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
                onMouseLeave={() => setPreviewJob(null)}
              >
                <Image
                  src={jobItem.logoUrl}
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
                      className={`truncate text-xs transition-all duration-300 ease-in-out ${
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
          })}

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
                    src={previewJob.logoUrl}
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
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg">
              <Image
                src={job.logoUrl}
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
              <LinkIcon className="mr-1 h-4 w-4" />
              <span>{job.url}</span>
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

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              AI 프롬프트
            </h2>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-gray-700">
                {job.companyName}의 {job.jobTitle} 포지션에 대한 AI 프롬프트를
                생성해 드립니다. 아래 버튼을 클릭하여 맞춤형 프롬프트를
                받아보세요.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="bg-primary hover:bg-primary-dark rounded-lg px-6 py-3 text-white shadow-sm transition-colors">
              AI 프롬프트 생성하기
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
