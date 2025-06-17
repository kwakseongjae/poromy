import { NextRequest, NextResponse } from 'next/server'
import {
  getAllJobs,
  getJobsByType,
  getJobsByCompany,
  searchJobs,
  searchJobsPaginated,
  searchJobsWithOffset,
  getJobsPaginated,
  getLatestJobs,
  getJobsWithOffset,
} from '@/lib/supabase-jobs'
import type { JobType } from '@/types/job'

// 📈 성능 최적화: 캐싱 설정
export const revalidate = 180 // 3분 캐싱
// dynamic 설정 제거 - 쿼리 파라미터에 따라 자동으로 결정되도록 함

// 📊 메모리 캐시 (동일한 요청에 대한 즉시 응답)
const memoryCache = new Map<string, { data: any; timestamp: number }>()
const MEMORY_CACHE_TTL = 60 * 1000 // 1분으로 단축 (무한스크롤 개선)

// 📈 캐시 키 생성 함수
const generateCacheKey = (searchParams: URLSearchParams): string => {
  const params = new URLSearchParams(searchParams)
  params.sort() // 일관된 키 생성을 위한 정렬
  // offset 기반 무한스크롤의 경우 캐시 TTL을 더 짧게 처리
  const key = params.toString()
  if (params.has('offset')) {
    return `offset-${key}`
  }
  return key
}

// 📊 메모리 캐시 확인 함수
const getFromMemoryCache = (key: string) => {
  const cached = memoryCache.get(key)
  if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL) {
    return cached.data
  }
  return null
}

// 📈 메모리 캐시 저장 함수
const setMemoryCache = (key: string, data: any) => {
  // 캐시 크기 제한 (최대 50개 항목)
  if (memoryCache.size >= 50) {
    const firstKey = memoryCache.keys().next().value
    if (firstKey) {
      memoryCache.delete(firstKey)
    }
  }
  memoryCache.set(key, { data, timestamp: Date.now() })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cacheKey = generateCacheKey(searchParams)
    const isOffsetRequest = searchParams.has('offset')

    // 📊 메모리 캐시 확인 (offset 요청은 제외)
    if (!isOffsetRequest) {
      const cachedData = getFromMemoryCache(cacheKey)
      if (cachedData) {
        return NextResponse.json(cachedData, {
          headers: {
            'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=300',
            'X-Cache': 'HIT-MEMORY',
          },
        })
      }
    }

    const type = searchParams.get('type') as JobType | null
    const company = searchParams.get('company')
    const search = searchParams.get('search')
    const query = searchParams.get('query') // 검색어 (검색 기능용)
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')
    const latest = searchParams.get('latest')
    const offset = searchParams.get('offset')

    let jobs
    let totalCount
    let hasMore
    let cacheTags = ['jobs'] // 기본 캐시 태그

    // 📈 타임아웃 설정으로 응답 시간 보장
    const timeout = new Promise(
      (_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 3000) // 3초 타임아웃
    )

    let dataPromise: Promise<any>

    // 검색어가 있는 경우 검색 처리 (페이지네이션/오프셋 지원)
    if (query) {
      const searchQuery = query
      cacheTags.push('jobs-search')

      // 오프셋 기반 검색 (데스크탑 무한스크롤용)
      if (offset) {
        const offsetNum = parseInt(offset)
        const limitNum = limit ? parseInt(limit) : 20
        dataPromise = searchJobsWithOffset(
          searchQuery,
          offsetNum,
          limitNum
        ).then((result) => ({
          jobs: result.jobs,
          totalCount: result.totalCount,
          hasMore: result.hasMore,
        }))
        cacheTags.push(`jobs-search-offset-${offsetNum}`)
      }
      // 페이지 기반 검색 (모바일용)
      else if (page) {
        const pageNum = parseInt(page)
        const limitNum = limit ? parseInt(limit) : 10
        dataPromise = searchJobsPaginated(searchQuery, pageNum, limitNum).then(
          (result) => ({
            jobs: result.jobs,
            totalCount: result.totalCount,
            hasMore: result.hasMore,
          })
        )
        cacheTags.push(`jobs-search-page-${pageNum}`)
      }
      // 기본 검색 (전체 결과 - 하위 호환성)
      else {
        dataPromise = searchJobs(searchQuery).then((result) => ({
          jobs: result,
        }))
        cacheTags.push('jobs-search-all')
      }
    }
    // 최신 job 가져오기 (메인 페이지용) - 최우선 최적화
    else if (latest) {
      const limitNum = limit ? parseInt(limit) : 10
      dataPromise = getLatestJobs(limitNum).then((result) => ({ jobs: result }))
      cacheTags.push('jobs-latest')
    }
    // 기존 검색 처리 (하위 호환성)
    else if (search) {
      dataPromise = searchJobs(search).then((result) => ({ jobs: result }))
      cacheTags.push('jobs-search-legacy')
    }
    // 타입별 필터링
    else if (type) {
      dataPromise = getJobsByType(type).then((result) => ({ jobs: result }))
      cacheTags.push(`jobs-type-${type}`)
    }
    // 회사별 필터링
    else if (company) {
      dataPromise = getJobsByCompany(company).then((result) => ({
        jobs: result,
      }))
      cacheTags.push(`jobs-company-${company}`)
    }
    // 오프셋 기반 페이지네이션 처리
    else if (offset) {
      const offsetNum = parseInt(offset)
      const limitNum = limit ? parseInt(limit) : 10
      dataPromise = getJobsWithOffset(offsetNum, limitNum).then((result) => ({
        jobs: result.jobs,
        totalCount: result.totalCount,
        hasMore: result.hasMore,
      }))
      cacheTags.push(`jobs-offset-${offsetNum}`)
    }
    // 페이지네이션 처리
    else if (page) {
      const pageNum = parseInt(page)
      const limitNum = limit ? parseInt(limit) : 10
      dataPromise = getJobsPaginated(pageNum, limitNum).then((result) => ({
        jobs: result.jobs,
        totalCount: result.totalCount,
        hasMore: result.hasMore,
      }))
      cacheTags.push(`jobs-page-${pageNum}`)
    }
    // 기본값: 최신 10개 (모든 데이터를 가져오지 않도록 수정)
    else {
      const limitNum = limit ? parseInt(limit) : 10
      dataPromise = getLatestJobs(limitNum).then((result) => ({ jobs: result }))
      cacheTags.push('jobs-default')
    }

    // 📊 타임아웃과 함께 데이터 페칭
    const result = await Promise.race([dataPromise, timeout])

    if (typeof result === 'object' && 'jobs' in result) {
      jobs = result.jobs
      totalCount = result.totalCount
      hasMore = result.hasMore
    } else {
      jobs = result
    }

    const responseData: any = { jobs }
    if (totalCount !== undefined) responseData.totalCount = totalCount
    if (hasMore !== undefined) responseData.hasMore = hasMore

    // 📈 메모리 캐시에 저장 (offset 요청은 제외)
    if (!isOffsetRequest) {
      setMemoryCache(cacheKey, responseData)
    }

    // 📊 최적화된 응답 헤더 (offset 요청은 캐시 정책 다르게 설정)
    const cacheControl = isOffsetRequest
      ? 'private, no-cache, no-store, must-revalidate'
      : 'public, s-maxage=180, stale-while-revalidate=300'

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': cacheControl,
        'X-Cache': isOffsetRequest ? 'BYPASS' : 'MISS',
        'X-Cache-Tags': cacheTags.join(','),
        Vary: 'Accept-Encoding',
      },
    })
  } catch (error) {
    // 📊 에러 발생 시 빈 데이터로 응답 (서비스 안정성 보장)
    console.error('API Error (returning fallback):', error)

    const fallbackData = {
      jobs: [],
      totalCount: 0,
      hasMore: false,
      error: 'Data temporarily unavailable',
    }

    return NextResponse.json(fallbackData, {
      status: 200, // 5xx 에러 대신 200으로 응답하여 클라이언트 처리 개선
      headers: {
        'Cache-Control': 'no-cache', // 에러 응답은 캐시하지 않음
        'X-Cache': 'ERROR-FALLBACK',
      },
    })
  }
}
