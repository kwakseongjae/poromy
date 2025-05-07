'use client'

import { useEffect } from 'react'
import { trackEngagement } from '@/lib/gtag'

export default function EngagementTracker() {
  useEffect(() => {
    const startTime = Date.now()

    // 페이지 언마운트 시 체류 시간 추적
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000) // Convert to seconds
      if (duration > 0) {
        trackEngagement(duration)
      }
    }
  }, [])

  return null
}
