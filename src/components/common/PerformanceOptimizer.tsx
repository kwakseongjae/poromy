'use client'

import { memo, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// 크리티컬하지 않은 컴포넌트들을 지연 로딩
const LazyAnalytics = dynamic(
  () => import('@/components/analytics/ClientAnalytics'),
  {
    loading: () => null,
    ssr: false,
  }
)

const LazyNotification = dynamic(
  () =>
    import('@/components/common/NotificationMessage').then((mod) => ({
      default: mod.NotificationMessage,
    })),
  {
    loading: () => null,
    ssr: false,
  }
)

interface PerformanceOptimizerProps {
  children: React.ReactNode
  enableAnalytics?: boolean
  enableNotifications?: boolean
  notificationMessage?: string
}

const PerformanceOptimizer = memo(
  ({
    children,
    enableAnalytics = true,
    enableNotifications = true,
    notificationMessage = '',
  }: PerformanceOptimizerProps) => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
      // 하이드레이션 완료 후에만 지연 로딩 컴포넌트들을 렌더링
      setIsClient(true)
    }, [])

    return (
      <>
        {children}
        {isClient && (
          <>
            {enableAnalytics && <LazyAnalytics />}
            {enableNotifications && notificationMessage && (
              <LazyNotification message={notificationMessage} />
            )}
          </>
        )}
      </>
    )
  }
)

PerformanceOptimizer.displayName = 'PerformanceOptimizer'

export default PerformanceOptimizer
