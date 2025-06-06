'use client'

import dynamic from 'next/dynamic'
import JobList from '@/components/position/JobList'

// 홈페이지용 JobList는 성능 최적화를 위해 직접 렌더링 (dynamic import 제거)
export const DynamicJobList = JobList

export const DynamicCompanyCarousel = dynamic(
  () => import('@/components/company/CompanyCarousel'),
  {
    loading: () => (
      <div className="h-48 animate-pulse rounded-lg bg-gray-100" />
    ),
    ssr: false,
  }
)

export const DynamicHomeInquiry = dynamic(
  () =>
    import('@/components/home/HomeInquiry').then((mod) => ({
      default: mod.HomeInquiry,
    })),
  {
    loading: () => (
      <div className="h-32 animate-pulse rounded-lg bg-gray-100" />
    ),
    ssr: false,
  }
)

export const DynamicEngagementTracker = dynamic(
  () => import('@/components/analytics/EngagementTracker'),
  {
    loading: () => null,
    ssr: false,
  }
)
