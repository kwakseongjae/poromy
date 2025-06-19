import { NextRequest, NextResponse } from 'next/server'
import { getJobById } from '@/lib/supabase-jobs'

// 🚀 성능 최적화: 적절한 캐싱 설정 (개별 job은 자주 변경되지 않음)
export const revalidate = 300 // 5분 캐싱

// 📊 메모리 캐시 (동일한 job 요청에 대한 즉시 응답)
const memoryCache = new Map<string, { data: any; timestamp: number }>()
const MEMORY_CACHE_TTL = 5 * 60 * 1000 // 5분으로 증가
const MAX_CACHE_SIZE = 100 // 100개로 증가

// 📊 메모리 캐시 확인 함수
const getFromMemoryCache = (key: string) => {
  const cached = memoryCache.get(key)
  if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL) {
    return cached.data
  }
  return null
}

// 📈 메모리 캐시 저장 함수 (LRU 방식)
const setMemoryCache = (key: string, data: any) => {
  // 캐시 크기 제한
  if (memoryCache.size >= MAX_CACHE_SIZE) {
    // LRU 방식으로 가장 오래된 항목 제거
    const oldestKey = memoryCache.keys().next().value
    if (oldestKey) {
      memoryCache.delete(oldestKey)
    }
  }
  memoryCache.set(key, { data, timestamp: Date.now() })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now() // 🚀 성능 측정 시작

  try {
    const { id } = await params
    const jobId = parseInt(id, 10)

    if (isNaN(jobId)) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 })
    }

    const cacheKey = `job-${jobId}`

    // 📊 메모리 캐시 확인
    const cachedData = getFromMemoryCache(cacheKey)
    if (cachedData) {
      const responseTime = Date.now() - startTime

      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'HIT-MEMORY',
          'X-Response-Time': `${responseTime}ms`,
          'Access-Control-Max-Age': '300',
        },
      })
    }

    // 📈 타임아웃 설정으로 응답 시간 보장
    const timeout = new Promise(
      (_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 3000) // 3초로 증가
    )

    const dbStartTime = Date.now() // DB 쿼리 시간 측정
    const job = await Promise.race([getJobById(jobId), timeout])
    const dbTime = Date.now() - dbStartTime

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const responseData = { job }

    // 📊 메모리 캐시에 저장
    setMemoryCache(cacheKey, responseData)

    const responseTime = Date.now() - startTime

    const response = NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': 'MISS',
        'X-Response-Time': `${responseTime}ms`,
        'X-DB-Time': `${dbTime}ms`,
        'Access-Control-Max-Age': '300',
        Vary: 'Accept-Encoding',
      },
    })

    return response
  } catch (error) {
    const responseTime = Date.now() - startTime
    console.error('Error in /api/jobs/[id]:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message === 'Request timeout'
            ? 'Request timeout'
            : 'Failed to fetch job',
      },
      {
        status:
          error instanceof Error && error.message === 'Request timeout'
            ? 408
            : 500,
        headers: {
          'X-Response-Time': `${responseTime}ms`,
        },
      }
    )
  }
}
