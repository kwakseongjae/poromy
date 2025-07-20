/**
 * Jobs 관련 React Query 커스텀 훅스
 * 
 * 기존 fetch 로직을 React Query로 마이그레이션
 * - 자동 캐싱 및 백그라운드 업데이트
 * - 로딩 상태 및 에러 처리 통합
 * - 뮤테이션을 통한 낙관적 업데이트
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import type { Job, JobType } from '@/types/job'

// API 응답 타입 정의
interface JobsResponse {
  jobs: Job[]
  totalCount?: number
  hasMore?: boolean
  error?: string
}

interface JobDetailResponse {
  job: Job | null
  error?: string
}

// ============================================================================
// API 호출 함수들 (기존 fetch 로직을 래핑)
// ============================================================================

/**
 * 최신 채용공고 조회 API
 */
const fetchLatestJobs = async (limit: number = 10): Promise<Job[]> => {
  const response = await fetch(`/api/jobs?latest=true&limit=${limit}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data: JobsResponse = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }
  
  return data.jobs || []
}

/**
 * 전체 채용공고 조회 API (관리자용)
 */
const fetchAllJobs = async (): Promise<Job[]> => {
  const response = await fetch('/api/jobs', {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data: JobsResponse = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }
  
  return data.jobs || []
}

/**
 * 페이지네이션된 채용공고 조회 API
 */
const fetchPaginatedJobs = async (
  page: number,
  limit: number
): Promise<{ jobs: Job[]; totalCount: number; hasMore: boolean }> => {
  const response = await fetch(`/api/jobs?page=${page}&limit=${limit}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data: JobsResponse = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }
  
  return {
    jobs: data.jobs || [],
    totalCount: data.totalCount || 0,
    hasMore: data.hasMore || false,
  }
}

/**
 * 오프셋 기반 채용공고 조회 API (무한 스크롤용)
 */
const fetchJobsWithOffset = async (
  offset: number,
  limit: number
): Promise<{ jobs: Job[]; totalCount: number; hasMore: boolean }> => {
  const response = await fetch(`/api/jobs?offset=${offset}&limit=${limit}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data: JobsResponse = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }
  
  return {
    jobs: data.jobs || [],
    totalCount: data.totalCount || 0,
    hasMore: data.hasMore || false,
  }
}

/**
 * 회사별 채용공고 조회 API
 */
const fetchJobsByCompany = async (companyName: string): Promise<Job[]> => {
  const response = await fetch(`/api/jobs?company=${encodeURIComponent(companyName)}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data: JobsResponse = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }
  
  return data.jobs || []
}

/**
 * 직무 타입별 채용공고 조회 API
 */
const fetchJobsByType = async (jobType: JobType): Promise<Job[]> => {
  const response = await fetch(`/api/jobs?type=${encodeURIComponent(jobType)}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data: JobsResponse = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }
  
  return data.jobs || []
}

/**
 * 채용공고 검색 API (기본)
 */
const fetchSearchJobs = async (query: string): Promise<Job[]> => {
  const response = await fetch(`/api/jobs?query=${encodeURIComponent(query)}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data: JobsResponse = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }
  
  return data.jobs || []
}

/**
 * 채용공고 검색 API (페이지네이션)
 */
const fetchSearchJobsPaginated = async (
  query: string,
  page: number,
  limit: number
): Promise<{ jobs: Job[]; totalCount: number; hasMore: boolean }> => {
  const response = await fetch(
    `/api/jobs?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data: JobsResponse = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }
  
  return {
    jobs: data.jobs || [],
    totalCount: data.totalCount || 0,
    hasMore: data.hasMore || false,
  }
}

/**
 * 채용공고 검색 API (오프셋)
 */
const fetchSearchJobsWithOffset = async (
  query: string,
  offset: number,
  limit: number
): Promise<{ jobs: Job[]; totalCount: number; hasMore: boolean }> => {
  const response = await fetch(
    `/api/jobs?query=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`,
    {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data: JobsResponse = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }
  
  return {
    jobs: data.jobs || [],
    totalCount: data.totalCount || 0,
    hasMore: data.hasMore || false,
  }
}

/**
 * 개별 채용공고 상세 조회 API
 */
const fetchJobDetail = async (id: string | number): Promise<Job | null> => {
  const response = await fetch(`/api/jobs/${id}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data: JobDetailResponse = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }
  
  return data.job
}

// ============================================================================
// React Query 커스텀 훅스
// ============================================================================

/**
 * 최신 채용공고 조회 훅
 */
export const useLatestJobs = (limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.jobs.latestJobs(limit),
    queryFn: () => fetchLatestJobs(limit),
    staleTime: 3 * 60 * 1000, // 3분간 fresh
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  })
}

/**
 * 전체 채용공고 조회 훅 (관리자용)
 */
export const useAllJobs = () => {
  return useQuery({
    queryKey: queryKeys.jobs.allJobs(),
    queryFn: fetchAllJobs,
    staleTime: 2 * 60 * 1000, // 2분간 fresh (관리자는 더 자주 업데이트)
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  })
}

/**
 * 페이지네이션된 채용공고 조회 훅
 */
export const usePaginatedJobs = (page: number, limit: number) => {
  return useQuery({
    queryKey: queryKeys.jobs.paginatedJobs(page, limit),
    queryFn: () => fetchPaginatedJobs(page, limit),
    staleTime: 5 * 60 * 1000, // 5분간 fresh
    gcTime: 15 * 60 * 1000, // 15분간 캐시 유지
    placeholderData: (previousData) => previousData, // 페이지 전환 시 이전 데이터 유지
  })
}

/**
 * 오프셋 기반 채용공고 조회 훅 (무한 스크롤용)
 */
export const useJobsWithOffset = (offset: number, limit: number) => {
  return useQuery({
    queryKey: queryKeys.jobs.offsetJobs(offset, limit),
    queryFn: () => fetchJobsWithOffset(offset, limit),
    staleTime: 2 * 60 * 1000, // 2분간 fresh (무한 스크롤은 더 빈번하게 업데이트)
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    placeholderData: (previousData) => previousData,
  })
}

/**
 * 회사별 채용공고 조회 훅
 */
export const useJobsByCompany = (companyName: string) => {
  return useQuery({
    queryKey: queryKeys.jobs.jobsByCompany(companyName),
    queryFn: () => fetchJobsByCompany(companyName),
    enabled: !!companyName, // companyName이 있을 때만 쿼리 실행
    staleTime: 10 * 60 * 1000, // 10분간 fresh (회사별 데이터는 변경이 적음)
    gcTime: 30 * 60 * 1000, // 30분간 캐시 유지
  })
}

/**
 * 직무 타입별 채용공고 조회 훅
 */
export const useJobsByType = (jobType: JobType) => {
  return useQuery({
    queryKey: queryKeys.jobs.jobsByType(jobType),
    queryFn: () => fetchJobsByType(jobType),
    enabled: !!jobType,
    staleTime: 10 * 60 * 1000, // 10분간 fresh
    gcTime: 30 * 60 * 1000, // 30분간 캐시 유지
  })
}

/**
 * 채용공고 검색 훅 (기본)
 */
export const useSearchJobs = (query: string) => {
  return useQuery({
    queryKey: queryKeys.jobs.searchJobs(query),
    queryFn: () => fetchSearchJobs(query),
    enabled: !!query && query.trim().length > 0, // 검색어가 있을 때만 실행
    staleTime: 1 * 60 * 1000, // 1분간 fresh (검색 결과는 빠르게 변경될 수 있음)
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  })
}

/**
 * 채용공고 검색 훅 (페이지네이션)
 */
export const useSearchJobsPaginated = (query: string, page: number, limit: number) => {
  return useQuery({
    queryKey: queryKeys.jobs.searchJobsPaginated(query, page, limit),
    queryFn: () => fetchSearchJobsPaginated(query, page, limit),
    enabled: !!query && query.trim().length > 0,
    staleTime: 1 * 60 * 1000, // 1분간 fresh
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
    placeholderData: (previousData) => previousData,
  })
}

/**
 * 채용공고 검색 훅 (오프셋)
 */
export const useSearchJobsWithOffset = (query: string, offset: number, limit: number) => {
  return useQuery({
    queryKey: queryKeys.jobs.searchJobsOffset(query, offset, limit),
    queryFn: () => fetchSearchJobsWithOffset(query, offset, limit),
    enabled: !!query && query.trim().length > 0,
    staleTime: 1 * 60 * 1000, // 1분간 fresh
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
    placeholderData: (previousData) => previousData,
  })
}

/**
 * 개별 채용공고 상세 조회 훅
 */
export const useJobDetail = (id: string | number | null) => {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id || 0),
    queryFn: () => fetchJobDetail(id!),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    staleTime: 10 * 60 * 1000, // 10분간 fresh (상세 정보는 변경이 적음)
    gcTime: 30 * 60 * 1000, // 30분간 캐시 유지
  })
}

// ============================================================================
// 뮤테이션 훅스 (관리자용)
// ============================================================================

/**
 * 채용공고 삭제 뮤테이션
 */
export const useDeleteJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/jobs?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete job')
      }

      return response.json()
    },
    onSuccess: () => {
      // 모든 jobs 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all })
    },
  })
}

/**
 * 채용공고 생성 뮤테이션
 */
export const useCreateJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (jobData: { job: any; promptContent: string }) => {
      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create job')
      }

      return response.json()
    },
    onSuccess: () => {
      // 모든 jobs 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all })
    },
  })
}

// ============================================================================
// 유틸리티 훅스
// ============================================================================

/**
 * Jobs 관련 캐시 무효화 유틸리티 훅
 */
export const useInvalidateJobsCache = () => {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all }),
    invalidateLists: () => queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() }),
    invalidateDetails: () => queryClient.invalidateQueries({ queryKey: queryKeys.jobs.details() }),
    invalidateLatest: () => queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() }),
    invalidateSearch: () => queryClient.invalidateQueries({ 
      queryKey: queryKeys.jobs.all,
      predicate: (query) => query.queryKey.includes('search')
    }),
  }
}