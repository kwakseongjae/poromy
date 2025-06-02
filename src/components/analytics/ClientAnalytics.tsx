'use client'

import dynamic from 'next/dynamic'

// 분석 컴포넌트를 필요시에만 로드
const EngagementTracker = dynamic(() => import('./EngagementTracker'), {
  loading: () => null,
  ssr: false,
})

// 개발 환경에서는 분석 추적을 비활성화
const ClientAnalytics = () => {
  // 프로덕션 환경에서만 분석 컴포넌트 렌더링
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return <EngagementTracker />
}

export default ClientAnalytics
