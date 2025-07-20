'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// React Query 클라이언트 설정
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 5분간 fresh 상태 유지 (빈번한 refetch 방지)
        staleTime: 5 * 60 * 1000,
        // 30분간 캐시 유지
        gcTime: 30 * 60 * 1000,
        // 에러 시 3번 재시도
        retry: 3,
        // 에러 시 지수 백오프로 재시도 간격 증가
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // 창 포커스 시 자동 refetch 활성화
        refetchOnWindowFocus: true,
        // 네트워크 재연결 시 자동 refetch 활성화
        refetchOnReconnect: true,
        // 컴포넌트 마운트 시 fresh한 데이터가 아니면 refetch
        refetchOnMount: true,
      },
      mutations: {
        // 뮤테이션 에러 시 1번 재시도
        retry: 1,
        // 뮤테이션 에러 시 2초 후 재시도
        retryDelay: 2000,
      },
    },
  })
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