'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createQueryClient } from '@/lib/react-query/client'

// React Query 클라이언트 설정 (optimized configuration)
function makeQueryClient() {
  return createQueryClient()
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // 서버: 항상 새로운 쿼리 클라이언트 생성
    return makeQueryClient()
  } else {
    // 브라우저: 기존 클라이언트가 없으면 새로 생성
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // 서버와 클라이언트 간의 상태 불일치를 방지하기 위해
  // 클라이언트에서만 QueryClient를 생성
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 DevTools 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  )
}