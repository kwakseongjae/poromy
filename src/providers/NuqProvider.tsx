'use client'

import { NuqsAdapter } from 'nuqs/adapters/next'
import { Suspense, ReactNode } from 'react'

interface NuqProviderProps {
  children: ReactNode
}

/**
 * nuq (Next.js URL Query) 프로바이더
 *
 * Next.js App Router와 함께 사용하기 위한 nuq 어댑터입니다.
 * URL 쿼리 파라미터를 React 상태처럼 관리할 수 있게 해줍니다.
 *
 * 주요 기능:
 * - 타입 안전한 URL 파라미터 관리
 * - 자동 URL 동기화
 * - 브라우저 히스토리 관리
 * - SSR/SSG 호환성
 */
export default function NuqProvider({ children }: NuqProviderProps) {
  return (
    <Suspense fallback={<>{children}</>}>
      <NuqsAdapter>{children}</NuqsAdapter>
    </Suspense>
  )
}
