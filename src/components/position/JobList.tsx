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

  /**
   * 로딩 상태 스켈레톤 UI
   * - 실제 컨텐츠와 유사한 레이아웃 제공
   * - 애니메이션으로 로딩 중임을 명시
   */
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="flex h-64 animate-pulse flex-col rounded-lg bg-gray-100"
          >
            {/* 이미지 영역 스켈레톤 */}
            <div className="h-32 w-full rounded-t-lg bg-gray-200" />
            {/* 컨텐츠 영역 스켈레톤 */}
            <div className="flex-1 p-4">
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
              <div className="mb-1 h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-2/3 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  /**
   * 데이터가 없는 경우의 UI
   * - 에러 상태와 빈 데이터 상태를 구분하여 처리
   */
  if (jobsData.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500">채용공고를 불러올 수 없습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            새로고침
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
      {jobsData.map((job) => {
        const encryptedId = encrypt(job.id.toString())
        const jobUrl = `/position/${encryptedId}`
        const isNew = isJobNew(job.uploadedAt)
        const deadlineLabel = getDeadlineLabel(job.deadline)

        return (
          <Link
            key={job.id}
            href={jobUrl}
            className="group relative flex h-64 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-md"
            prefetch={false} // 초기 로딩 최적화를 위해 prefetch 비활성화
          >
            {/* 새 채용공고 배지 */}
            {isNew && (
              <div className="absolute top-2 left-2 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                NEW
              </div>
            )}

            {/* 회사 로고 이미지 */}
            <div className="relative h-32 w-full overflow-hidden bg-gray-50">
              {job.logoUrl ? (
                <Image
                  src={getProxyImageUrl(job.logoUrl)}
                  alt={`${job.companyName} 로고`}
                  fill
                  className="object-contain p-2 transition-transform duration-200 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy" // 지연 로딩으로 초기 성능 향상
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-100">
                  <span className="text-sm text-gray-400">No Logo</span>
                </div>
              )}
            </div>

            {/* 채용공고 정보 */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="space-y-1">
                {/* 회사명 */}
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                  {job.companyName}
                </h3>

                {/* 직무명 */}
                <p className="line-clamp-2 text-sm text-gray-600">
                  {job.jobTitle}
                </p>

                {/* 직무 타입 */}
                <span className="inline-block rounded-sm bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  {job.jobType}
                </span>
              </div>

              {/* 마감일 */}
              {deadlineLabel && (
                <p className="mt-2 text-xs text-gray-500">{deadlineLabel}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
