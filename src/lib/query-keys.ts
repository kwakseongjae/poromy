/**
 * Query Key Factory for React Query
 * 
 * 체계적인 캐시 키 관리를 위한 팩토리 패턴
 * - 일관된 키 구조로 캐시 무효화 효율성 향상
 * - 타입 안전성 보장
 * - 네임스페이스별 관리로 충돌 방지
 */

import type { JobType } from '@/types/job'

// 기본 쿼리 키 팩토리 생성 함수
export const createQueryKeys = <T extends string>(namespace: T) => ({
  all: [namespace] as const,
  lists: () => [namespace, 'list'] as const,
  list: (filters?: Record<string, any>) => {
    const result = [namespace, 'list', filters].filter(Boolean)
    return result as readonly unknown[]
  },
  details: () => [namespace, 'detail'] as const,
  detail: (id: string | number) => [namespace, 'detail', id] as const,
})

// Jobs 관련 쿼리 키
export const jobKeys = {
  // 모든 job 관련 쿼리
  all: ['jobs'] as const,
  
  // 리스트 쿼리들
  lists: () => ['jobs', 'list'] as const,
  
  // 전체 job 리스트 (관리자용)
  allJobs: () => ['jobs', 'list', 'all'] as const,
  
  // 최신 job 리스트 (홈페이지용)
  latestJobs: (limit?: number) => {
    const result = ['jobs', 'list', 'latest', { limit }].filter(Boolean)
    return result as readonly unknown[]
  },
  
  // 페이지네이션된 job 리스트
  paginatedJobs: (page: number, limit: number) => 
    ['jobs', 'list', 'paginated', { page, limit }] as const,
  
  // 오프셋 기반 job 리스트 (무한 스크롤용)
  offsetJobs: (offset: number, limit: number) => 
    ['jobs', 'list', 'offset', { offset, limit }] as const,
  
  // 회사별 job 리스트
  jobsByCompany: (companyName: string) => 
    ['jobs', 'list', 'company', companyName] as const,
  
  // 직무 타입별 job 리스트
  jobsByType: (jobType: JobType) => 
    ['jobs', 'list', 'type', jobType] as const,
  
  // 검색 결과 (기본)
  searchJobs: (query: string) => 
    ['jobs', 'list', 'search', query] as const,
  
  // 검색 결과 (페이지네이션)
  searchJobsPaginated: (query: string, page: number, limit: number) => 
    ['jobs', 'list', 'search', 'paginated', { query, page, limit }] as const,
  
  // 검색 결과 (오프셋)
  searchJobsOffset: (query: string, offset: number, limit: number) => 
    ['jobs', 'list', 'search', 'offset', { query, offset, limit }] as const,
  
  // 개별 job 상세 정보
  details: () => ['jobs', 'detail'] as const,
  detail: (id: string | number) => ['jobs', 'detail', id] as const,
  
  // job 프롬프트 내용
  prompt: (id: string | number) => ['jobs', 'prompt', id] as const,
  
  // 메타데이터 쿼리들
  meta: () => ['jobs', 'meta'] as const,
  jobsCount: () => ['jobs', 'meta', 'count'] as const,
  availableJobTypes: () => ['jobs', 'meta', 'job-types'] as const,
  companyNames: () => ['jobs', 'meta', 'company-names'] as const,
}

// Companies 관련 쿼리 키
export const companyKeys = {
  all: ['companies'] as const,
  lists: () => ['companies', 'list'] as const,
  list: (filters?: Record<string, any>) => {
    const result = ['companies', 'list', filters].filter(Boolean)
    return result as readonly unknown[]
  },
  details: () => ['companies', 'detail'] as const,
  detail: (id: string) => ['companies', 'detail', id] as const,
}

// Inquiries 관련 쿼리 키
export const inquiryKeys = {
  all: ['inquiries'] as const,
  lists: () => ['inquiries', 'list'] as const,
  list: (filters?: Record<string, any>) => {
    const result = ['inquiries', 'list', filters].filter(Boolean)
    return result as readonly unknown[]
  },
  details: () => ['inquiries', 'detail'] as const,
  detail: (id: string | number) => ['inquiries', 'detail', id] as const,
  latest: (limit?: number) => {
    const result = ['inquiries', 'list', 'latest', { limit }].filter(Boolean)
    return result as readonly unknown[]
  },
}

// User 관련 쿼리 키
export const userKeys = {
  all: ['user'] as const,
  details: () => ['user', 'detail'] as const,
  profile: () => ['user', 'profile'] as const,
  adminStatus: () => ['user', 'admin-status'] as const,
}

// 통합 쿼리 키 객체
export const queryKeys = {
  jobs: jobKeys,
  companies: companyKeys,
  inquiries: inquiryKeys,
  user: userKeys,
}

// 쿼리 키 유틸리티 함수들
export const queryKeyUtils = {
  /**
   * 특정 네임스페이스의 모든 쿼리 무효화
   */
  invalidateNamespace: (namespace: string) => [namespace],
  
  /**
   * 특정 네임스페이스의 리스트 쿼리들만 무효화
   */
  invalidateListQueries: (namespace: string) => [namespace, 'list'],
  
  /**
   * 특정 네임스페이스의 상세 쿼리들만 무효화
   */
  invalidateDetailQueries: (namespace: string) => [namespace, 'detail'],
  
  /**
   * 검색 관련 쿼리들만 무효화
   */
  invalidateSearchQueries: () => jobKeys.all.concat(['search'] as any),
}

// 타입 안전성을 위한 헬퍼
export type JobQueryKeys = typeof jobKeys
export type CompanyQueryKeys = typeof companyKeys
export type InquiryQueryKeys = typeof inquiryKeys
export type UserQueryKeys = typeof userKeys
export type QueryKeys = typeof queryKeys

export default queryKeys