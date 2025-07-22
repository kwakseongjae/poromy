'use client'

import Link from 'next/link'
import Image from 'next/image'
import { encrypt } from '@/utils/crypto'
import { getProxyImageUrl } from '@/utils/image'
import { getDeadlineLabel, isJobNew } from '@/utils/job'
import { usePathname } from 'next/navigation'
import { useLatestJobs } from '@/lib/react-query/hooks/jobs-hooks'
import type { Job } from '@/types/job'

export default function JobList() {
  const pathname = usePathname()
  
  // React Query를 사용한 데이터 페칭
  const { 
    data: jobs = [], 
    isLoading: loading, 
    error 
  } = useLatestJobs(10)

  // 에러 처리 (필요시 사용자에게 알림)
  if (error) {
    console.error('Error fetching jobs:', error)
  }

  // 홈페이지에서는 성능 최적화를 위해 제한된 수의 데이터 사용
  const jobsArray = Array.isArray(jobs) ? jobs : (jobs?.jobs || [])
  const jobsData = pathname === '/' ? jobsArray.slice(0, 12) : jobsArray

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
                      {job.conditions.map((condition: string, index: number) => (
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
                      {job.conditions.map((condition: string, index: number) => (
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
