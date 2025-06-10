/**
 * 캐시 관리 유틸리티
 * 클라이언트 사이드에서 캐시 무효화 및 갱신을 처리
 */

export interface CacheInvalidationOptions {
  tags?: string[]
  paths?: string[]
  secret?: string
}

/**
 * 서버 측 캐시를 무효화하는 함수
 */
export const invalidateServerCache = async (
  options: CacheInvalidationOptions = {}
) => {
  try {
    const { tags = ['jobs'], paths = ['/'], secret } = options

    // 서버 사이드와 클라이언트 사이드 모두 지원
    const revalidationSecret =
      secret ||
      (typeof window === 'undefined'
        ? process.env.REVALIDATION_SECRET // 서버 사이드
        : process.env.NEXT_PUBLIC_REVALIDATION_SECRET) // 클라이언트 사이드

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // 클라이언트 사이드에서 호출하는 경우 인증 토큰 추가
    if (typeof window !== 'undefined') {
      const { createBrowserSupabaseClient } = await import(
        '@/lib/supabase-client'
      )
      const supabase = createBrowserSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }
    }

    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tags,
        paths,
        secret: revalidationSecret,
      }),
    })

    if (!response.ok) {
      throw new Error(`Cache invalidation failed: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Cache invalidated:', result)
    return result
  } catch (error) {
    console.error('Error invalidating cache:', error)
    throw error
  }
}

/**
 * 브라우저 캐시를 무효화하는 함수
 */
export const invalidateBrowserCache = () => {
  // Service Worker가 있다면 캐시 무효화
  if ('serviceWorker' in navigator && 'caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        if (cacheName.includes('jobs') || cacheName.includes('api')) {
          caches.delete(cacheName)
          console.log(`Browser cache deleted: ${cacheName}`)
        }
      })
    })
  }

  // 페이지 새로고침 강제 (옵션)
  // window.location.reload()
}

/**
 * 특정 API 엔드포인트의 캐시를 무효화
 */
export const invalidateApiCache = async (endpoint: string) => {
  try {
    // fetch with cache: 'no-store' to bypass cache
    await fetch(endpoint, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
    console.log(`API cache invalidated for: ${endpoint}`)
  } catch (error) {
    console.error(`Error invalidating API cache for ${endpoint}:`, error)
  }
}

/**
 * 채용공고 관련 모든 캐시를 무효화하는 통합 함수
 */
export const invalidateJobsCache = async () => {
  try {
    // 서버 캐시 무효화
    await invalidateServerCache({
      tags: ['jobs', 'jobs-all', 'jobs-search'],
      paths: ['/', '/position', '/company'],
    })

    // API 캐시 무효화
    await invalidateApiCache('/api/jobs')

    // 브라우저 캐시 무효화
    invalidateBrowserCache()

    console.log('All jobs caches invalidated successfully')
  } catch (error) {
    console.error('Error invalidating jobs cache:', error)
    throw error
  }
}

/**
 * 관리자 액션 후 자동으로 캐시를 갱신하는 훅
 */
export const useAutoRefresh = () => {
  const refreshJobsData = async () => {
    try {
      await invalidateJobsCache()

      // 페이지 자동 새로고침 (선택사항)
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Auto refresh failed:', error)
    }
  }

  return { refreshJobsData }
}
