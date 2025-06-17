'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { encrypt } from '@/utils/crypto'
import { getProxyImageUrl } from '@/utils/image'
import { getDeadlineLabel, isJobNew } from '@/utils/job'
import { usePathname } from 'next/navigation'
import type { Job } from '@/types/job'

/**
 * 클라이언트 사이드 캐시 구현
 * - 메모리 캐시로 중복 API 호출 방지
 * - 홈페이지 재방문 시 빠른 로딩 제공
 */
const jobsCache = {
  data: null as Job[] | null,
  timestamp: 0,
  isLoading: false,
}

const CACHE_DURATION = 1000 * 60 * 2 // 2분 캐시 (서버 캐시보다 짧게)

export default function JobList() {
  const pathname = usePathname()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      const now = Date.now()

      // 캐시된 데이터가 있고 유효한 경우 사용
      if (
        jobsCache.data &&
        now - jobsCache.timestamp < CACHE_DURATION &&
        !jobsCache.isLoading
      ) {
        setJobs(jobsCache.data)
        setLoading(false)
        return
      }

      // 이미 로딩 중인 경우 대기
      if (jobsCache.isLoading) {
        // 로딩 상태 모니터링을 위한 폴링
        const checkLoading = () => {
          if (!jobsCache.isLoading && jobsCache.data) {
            setJobs(jobsCache.data)
            setLoading(false)
          } else if (!jobsCache.isLoading) {
            // 로딩 실패한 경우 재시도
            fetchJobs()
          } else {
            setTimeout(checkLoading, 100)
          }
        }
        setTimeout(checkLoading, 100)
        return
      }

      try {
        jobsCache.isLoading = true

        // AbortController로 컴포넌트 언마운트 시 요청 취소
        const abortController = new AbortController()

        // 메인 페이지에서는 최신 10개만 가져오기 (성능 최적화)
        const response = await fetch('/api/jobs?latest=true&limit=10', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        const jobsData = data.jobs || []

        // 캐시 업데이트
        jobsCache.data = jobsData
        jobsCache.timestamp = now

        setJobs(jobsData)
      } catch (error) {
        // AbortError는 의도적인 취소이므로 로그하지 않음
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error fetching jobs:', error)
        }

        // 에러 시에도 캐시된 데이터가 있다면 사용
        if (jobsCache.data) {
          setJobs(jobsCache.data)
        }
      } finally {
        jobsCache.isLoading = false
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // 홈페이지에서는 성능 최적화를 위해 제한된 수의 데이터 사용
  const jobsData = pathname === '/' ? jobs.slice(0, 12) : jobs

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-lg bg-gray-100"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
      {jobsData.map((job, idx) => {
        // Tailwind로 3줄만 보이게 제어
        let visibility = ''
        if (idx >= 6 && idx < 9) {
          visibility = 'hidden sm:block'
        } else if (idx >= 9) {
          visibility = 'hidden'
        }
        // Encrypt the ID for use in the URL
        const encryptedId = encrypt(String(job.id))
        const deadlineLabel = getDeadlineLabel(job.deadline)
        // 기존 utils 함수 사용
        const isNew = isJobNew(job.uploadedAt)

        return (
          <article
            key={String(job.id)}
            className={
              visibility +
              ' group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md lg:overflow-hidden'
            }
          >
            <Link
              href={`/position/${encryptedId}`}
              className="flex h-full flex-col"
              aria-label={`${job.companyName} ${job.jobTitle} 상세 정보 보기`}
            >
              {/* Mobile/Tablet Layout (below lg) */}
              <div className="flex h-full flex-col lg:hidden">
                {/* 로고 영역 */}
                <div className="flex h-30 w-full items-center justify-center overflow-hidden pt-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                    <Image
                      src={getProxyImageUrl(job.logoUrl)}
                      alt={`${job.companyName} 로고`}
                      fill
                      className="object-contain transition-transform group-hover:scale-110"
                      sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 160px"
                    />
                  </div>
                </div>

                {/* 콘텐츠 영역 - 고정 높이와 내부 flex 구조 */}
                <div className="flex min-h-0 flex-1 flex-col justify-between p-4">
                  <div className="flex-1">
                    <h3 className="group-hover:text-text-secondary mb-1 line-clamp-2 text-lg font-semibold text-gray-900">
                      {job.jobTitle}
                    </h3>
                    <div className="mb-4 inline-flex items-center text-sm text-gray-500">
                      <span>{job.companyName}</span>
                      {isNew && (
                        <>
                          <span
                            className="mx-2 inline-block h-4 w-px bg-gray-300"
                            aria-hidden="true"
                          />
                          <span
                            className="text-primary"
                            aria-label="오늘 업로드"
                          >
                            New
                          </span>
                        </>
                      )}
                    </div>
                    {/* 태그 영역 - 최대 2줄로 제한 */}
                    <div
                      className="flex flex-wrap gap-2 overflow-hidden"
                      style={{ maxHeight: '3.5rem' }}
                    >
                      {job.conditions.map((condition, index) => (
                        <span
                          key={index}
                          className="inline-flex shrink-0 items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 마감일 - 하단 고정 */}
                  <div className="mt-4 flex justify-end">
                    <span className="rounded bg-white/80 px-2 py-0.5 text-xs font-semibold text-gray-500">
                      {deadlineLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Layout (lg and above) */}
              <div className="hidden lg:flex lg:h-38 lg:flex-col lg:justify-between lg:overflow-hidden lg:p-4">
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
                    <h3 className="group-hover:text-text-secondary line-clamp-2 text-lg font-semibold text-gray-900">
                      {job.jobTitle}
                    </h3>
                    <div className="inline-flex items-center text-sm text-gray-500">
                      <span>{job.companyName}</span>
                      {isNew && (
                        <>
                          <span
                            className="mx-2 inline-block h-4 w-px bg-gray-300"
                            aria-hidden="true"
                          />
                          <span
                            className="text-primary"
                            aria-label="오늘 업로드"
                          >
                            New
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 태그 + 마감일: 같은 줄, 우측 끝 */}
                <div className="flex w-full items-center">
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
          </article>
        )
      })}
    </div>
  )
}
