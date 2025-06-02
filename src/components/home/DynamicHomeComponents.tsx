'use client'

import dynamic from 'next/dynamic'

// 동적 임포트로 컴포넌트들을 지연 로딩
export const DynamicJobList = dynamic(
  () => import('@/components/position/JobList'),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
    ),
    ssr: false,
  }
)

export const DynamicCompanyCarousel = dynamic(
  () => import('@/components/company/CompanyCarousel'),
  {
    loading: () => (
      <div className="h-48 animate-pulse rounded-lg bg-gray-200" />
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
      <div className="h-32 animate-pulse rounded-lg bg-gray-200" />
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
