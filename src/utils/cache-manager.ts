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

/**
 * 고성능 캐시 관리자
 * - 메모리 기반 LRU 캐시로 API 응답 캐싱
 * - 중복 요청 방지 (Request Deduplication)
 * - 백그라운드 리프레시 (Stale-While-Revalidate)
 * - 초기 로딩 성능 최적화
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiry: number
  isStale: boolean
}

interface CacheOptions {
  maxAge?: number // 캐시 유효 시간 (ms)
  staleTime?: number // 데이터가 stale로 간주되는 시간 (ms)
  maxSize?: number // 최대 캐시 크기
  revalidateOnFocus?: boolean // 포커스 시 재검증 여부
}

class PerformanceCacheManager {
  private cache = new Map<string, CacheEntry<any>>()
  private pendingRequests = new Map<string, Promise<any>>()
  private defaultOptions: Required<CacheOptions> = {
    maxAge: 1000 * 60 * 5, // 5분
    staleTime: 1000 * 60 * 2, // 2분
    maxSize: 100,
    revalidateOnFocus: true,
  }

  /**
   * 캐시된 데이터 조회
   * - 유효한 캐시가 있으면 즉시 반환
   * - stale 데이터는 백그라운드에서 업데이트
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: Partial<CacheOptions>
  ): Promise<T> {
    const opts = { ...this.defaultOptions, ...options }
    const now = Date.now()
    const cached = this.cache.get(key)

    // 유효한 캐시가 있는 경우
    if (cached && now < cached.expiry) {
      // stale 상태이면 백그라운드에서 업데이트
      if (now > cached.timestamp + opts.staleTime && !cached.isStale) {
        this.revalidateInBackground(key, fetcher, opts)
        cached.isStale = true
      }
      return cached.data
    }

    // 이미 요청 중인 경우 기존 요청 재사용 (중복 요청 방지)
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!
    }

    // 새로운 요청 생성
    const request = this.fetchAndCache(key, fetcher, opts)
    this.pendingRequests.set(key, request)

    try {
      const result = await request
      return result
    } finally {
      this.pendingRequests.delete(key)
    }
  }

  /**
   * 데이터를 페치하고 캐시에 저장
   */
  private async fetchAndCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: Required<CacheOptions>
  ): Promise<T> {
    try {
      const data = await fetcher()
      const now = Date.now()

      // 캐시 크기 제한 확인 및 정리
      if (this.cache.size >= options.maxSize) {
        this.evictOldest()
      }

      // 캐시에 저장
      this.cache.set(key, {
        data,
        timestamp: now,
        expiry: now + options.maxAge,
        isStale: false,
      })

      return data
    } catch (error) {
      // 에러 발생 시 캐시된 데이터가 있다면 반환 (장애 허용성)
      const cached = this.cache.get(key)
      if (cached) {
        console.warn(`API 오류 발생, 캐시된 데이터 사용: ${key}`, error)
        return cached.data
      }
      throw error
    }
  }

  /**
   * 백그라운드에서 데이터 재검증
   * - 사용자는 기다리지 않고 캐시된 데이터 사용
   * - 새 데이터가 준비되면 캐시 업데이트
   */
  private async revalidateInBackground<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: Required<CacheOptions>
  ): Promise<void> {
    try {
      await this.fetchAndCache(key, fetcher, options)
    } catch (error) {
      console.error(`백그라운드 재검증 실패: ${key}`, error)
    }
  }

  /**
   * 가장 오래된 캐시 항목 제거 (LRU)
   */
  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTime = Infinity

    for (const [key, entry] of this.cache) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  /**
   * 특정 키의 캐시 무효화
   */
  invalidate(key: string): void {
    this.cache.delete(key)
    this.pendingRequests.delete(key)
  }

  /**
   * 패턴에 맞는 키들 무효화
   */
  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key)
      }
    }
    for (const key of this.pendingRequests.keys()) {
      if (pattern.test(key)) {
        this.pendingRequests.delete(key)
      }
    }
  }

  /**
   * 전체 캐시 초기화
   */
  clear(): void {
    this.cache.clear()
    this.pendingRequests.clear()
  }

  /**
   * 캐시 통계 정보 반환
   */
  getStats(): {
    cacheSize: number
    pendingRequests: number
    hitRate: number
  } {
    const totalRequests = this.cache.size + this.pendingRequests.size
    const hits = this.cache.size

    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      hitRate: totalRequests > 0 ? hits / totalRequests : 0,
    }
  }

  /**
   * 만료된 캐시 항목들 정리
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache) {
      if (now > entry.expiry) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 여러 키를 병렬로 프리로드
   * - 초기 페이지 로딩 시 중요한 데이터들을 미리 캐시
   */
  async preload<T>(
    requests: Array<{
      key: string
      fetcher: () => Promise<T>
      options?: Partial<CacheOptions>
    }>
  ): Promise<Array<T | Error>> {
    const promises = requests.map(async ({ key, fetcher, options }) => {
      try {
        return await this.get(key, fetcher, options)
      } catch (error) {
        console.error(`프리로드 실패: ${key}`, error)
        return error as Error
      }
    })

    return Promise.allSettled(promises).then((results) =>
      results.map((result) =>
        result.status === 'fulfilled' ? result.value : result.reason
      )
    )
  }
}

// 싱글톤 인스턴스 생성
export const cacheManager = new PerformanceCacheManager()

// 페이지 포커스 시 캐시 재검증 (선택적)
if (typeof window !== 'undefined') {
  let isVisible = true

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && !isVisible) {
      isVisible = true
      // 포커스 시 stale 데이터 재검증 로직 추가 가능
    } else if (document.visibilityState === 'hidden') {
      isVisible = false
    }
  }

  // 주기적 캐시 정리 (메모리 누수 방지)
  const cleanupInterval = setInterval(
    () => {
      cacheManager.cleanup()
    },
    1000 * 60 * 10
  ) // 10분마다 정리

  document.addEventListener('visibilitychange', handleVisibilityChange)

  // 페이지 언로드 시 정리
  window.addEventListener('beforeunload', () => {
    clearInterval(cleanupInterval)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
}

// 자주 사용되는 API 엔드포인트별 프리셋
export const apiCache = {
  /**
   * 채용공고 관련 캐시 (짧은 캐시 시간)
   */
  jobs: {
    get: <T>(key: string, fetcher: () => Promise<T>) =>
      cacheManager.get(key, fetcher, {
        maxAge: 1000 * 60 * 3, // 3분
        staleTime: 1000 * 60 * 1, // 1분
      }),
    invalidate: (pattern?: string) => {
      if (pattern) {
        cacheManager.invalidatePattern(new RegExp(pattern))
      } else {
        cacheManager.invalidatePattern(/^jobs:/)
      }
    },
  },

  /**
   * 회사 정보 캐시 (긴 캐시 시간)
   */
  companies: {
    get: <T>(key: string, fetcher: () => Promise<T>) =>
      cacheManager.get(key, fetcher, {
        maxAge: 1000 * 60 * 30, // 30분
        staleTime: 1000 * 60 * 10, // 10분
      }),
    invalidate: (pattern?: string) => {
      if (pattern) {
        cacheManager.invalidatePattern(new RegExp(pattern))
      } else {
        cacheManager.invalidatePattern(/^companies:/)
      }
    },
  },

  /**
   * 사용자 정보 캐시 (중간 캐시 시간)
   */
  user: {
    get: <T>(key: string, fetcher: () => Promise<T>) =>
      cacheManager.get(key, fetcher, {
        maxAge: 1000 * 60 * 15, // 15분
        staleTime: 1000 * 60 * 5, // 5분
      }),
    invalidate: () => cacheManager.invalidatePattern(/^user:/),
  },
}

export default cacheManager
