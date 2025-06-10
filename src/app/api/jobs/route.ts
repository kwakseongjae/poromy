import { NextRequest, NextResponse } from 'next/server'
import {
  getAllJobs,
  getJobsByType,
  getJobsByCompany,
  searchJobs,
  getJobsPaginated,
  getLatestJobs,
  getJobsWithOffset,
} from '@/lib/supabase-jobs'
import type { JobType } from '@/types/job'

// 정적 캐싱을 활용하되, 태그 기반 무효화 가능하도록 설정
export const revalidate = 3600 // 1시간 캐싱

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as JobType | null
    const company = searchParams.get('company')
    const search = searchParams.get('search')
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')
    const latest = searchParams.get('latest')
    const offset = searchParams.get('offset')

    let jobs
    let totalCount
    let hasMore
    let cacheTags = ['jobs'] // 기본 캐시 태그

    // 최신 job 가져오기 (메인 페이지용)
    if (latest) {
      const limitNum = limit ? parseInt(limit) : 10
      jobs = await getLatestJobs(limitNum)
      cacheTags.push('jobs-latest')
    }
    // 오프셋 기반 페이지네이션 처리
    else if (offset && !search && !type && !company) {
      const offsetNum = parseInt(offset)
      const limitNum = limit ? parseInt(limit) : 10
      const result = await getJobsWithOffset(offsetNum, limitNum)
      jobs = result.jobs
      totalCount = result.totalCount
      hasMore = result.hasMore
      cacheTags.push(`jobs-offset-${offsetNum}`)
    }
    // 페이지네이션 처리
    else if (page && !search && !type && !company) {
      const pageNum = parseInt(page)
      const limitNum = limit ? parseInt(limit) : 10
      const result = await getJobsPaginated(pageNum, limitNum)
      jobs = result.jobs
      totalCount = result.totalCount
      hasMore = result.hasMore
      cacheTags.push(`jobs-page-${pageNum}`)
    } else if (search) {
      jobs = await searchJobs(search)
      cacheTags.push('jobs-search')
    } else if (type) {
      jobs = await getJobsByType(type)
      cacheTags.push(`jobs-type-${type}`)
    } else if (company) {
      jobs = await getJobsByCompany(company)
      cacheTags.push(`jobs-company-${company}`)
    } else {
      jobs = await getAllJobs()
      cacheTags.push('jobs-all')
    }

    const responseData: any = { jobs }
    if (totalCount !== undefined) {
      responseData.totalCount = totalCount
      responseData.hasMore = hasMore
    }

    const response = NextResponse.json(responseData)

    // 개발 환경에서는 캐싱 완전 비활성화
    if (process.env.NODE_ENV === 'development') {
      response.headers.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      )
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
    } else {
      // 프로덕션에서는 캐시 설정
      response.headers.set(
        'Cache-Control',
        's-maxage=3600, stale-while-revalidate=86400'
      )
    }

    return response
  } catch (error) {
    console.error('Error in /api/jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}
