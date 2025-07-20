/**
 * Custom hooks for URL query parameter management using nuq
 * 
 * 기존의 수동적인 URL 파라미터 관리를 nuq를 사용한 타입 안전하고 
 * 선언적인 방식으로 대체합니다.
 */

import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

/**
 * 검색 쿼리 파라미터 훅
 * URL의 'query' 파라미터를 관리합니다.
 */
export const useSearchQuery = () => {
  return useQueryState(
    'query',
    parseAsString.withDefault('').withOptions({
      clearOnDefault: true, // 빈 문자열일 때 URL에서 파라미터 제거
    })
  )
}

/**
 * 페이지네이션 파라미터 훅
 * URL의 'page' 파라미터를 관리합니다.
 */
export const usePageParam = () => {
  return useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({
      clearOnDefault: true, // 1페이지일 때 URL에서 파라미터 제거
    })
  )
}

/**
 * 채용공고 ID 파라미터 훅 (암호화된 ID)
 * URL의 'id' 파라미터를 관리합니다.
 */
export const useJobIdParam = () => {
  return useQueryState(
    'id',
    parseAsString.withOptions({
      clearOnDefault: true, // 빈 값일 때 URL에서 파라미터 제거
    })
  )
}

/**
 * 직무 타입 필터 파라미터 훅
 * URL의 'jobType' 파라미터를 관리합니다.
 */
export const useJobTypeFilter = () => {
  return useQueryState(
    'jobType',
    parseAsString.withOptions({
      clearOnDefault: true,
    })
  )
}

/**
 * 정렬 파라미터 훅
 * URL의 'sort' 파라미터를 관리합니다.
 */
export const useSortParam = () => {
  return useQueryState(
    'sort',
    parseAsString.withDefault('latest').withOptions({
      clearOnDefault: true,
    })
  )
}

/**
 * 페이지 크기 파라미터 훅
 * URL의 'limit' 파라미터를 관리합니다.
 */
export const useLimitParam = () => {
  return useQueryState(
    'limit',
    parseAsInteger.withDefault(10).withOptions({
      clearOnDefault: true,
    })
  )
}

/**
 * 오프셋 파라미터 훅 (무한 스크롤용)
 * URL의 'offset' 파라미터를 관리합니다.
 */
export const useOffsetParam = () => {
  return useQueryState(
    'offset',
    parseAsInteger.withDefault(0).withOptions({
      clearOnDefault: true,
    })
  )
}

/**
 * 필터 모달 상태 파라미터 훅
 * URL의 'filters' 파라미터를 관리합니다.
 */
export const useFiltersParam = () => {
  return useQueryState(
    'filters',
    parseAsString.withOptions({
      clearOnDefault: true,
    })
  )
}

/**
 * 뷰 모드 파라미터 훅 (리스트/그리드)
 * URL의 'view' 파라미터를 관리합니다.
 */
export const useViewModeParam = () => {
  return useQueryState(
    'view',
    parseAsString.withDefault('grid').withOptions({
      clearOnDefault: true,
    })
  )
}

/**
 * 복합 검색 파라미터 훅
 * 여러 검색 관련 파라미터를 한 번에 관리합니다.
 */
export const useSearchParams = () => {
  const [query, setQuery] = useSearchQuery()
  const [page, setPage] = usePageParam()
  const [sort, setSort] = useSortParam()
  const [limit, setLimit] = useLimitParam()
  const [jobType, setJobType] = useJobTypeFilter()

  const resetSearch = () => {
    setQuery('')
    setPage(1)
    setSort('latest')
    setJobType(null)
  }

  const updateSearch = (newQuery: string) => {
    setQuery(newQuery)
    setPage(1) // 새로운 검색시 첫 페이지로 이동
  }

  return {
    // 현재 값들
    query,
    page,
    sort,
    limit,
    jobType,
    
    // 업데이트 함수들
    setQuery: updateSearch,
    setPage,
    setSort,
    setLimit,
    setJobType,
    
    // 유틸리티 함수들
    resetSearch,
  }
}

/**
 * 채용공고 상세 페이지 파라미터 훅
 * 채용공고 상세 페이지에서 사용하는 파라미터들을 관리합니다.
 */
export const useJobDetailParams = () => {
  const [id, setId] = useJobIdParam()
  const [query, setQuery] = useSearchQuery()
  
  const clearJobSelection = () => {
    setId(null)
  }
  
  const selectJob = (encryptedId: string) => {
    setId(encryptedId)
  }
  
  return {
    // 현재 값들
    id,
    query,
    
    // 업데이트 함수들
    setId,
    setQuery,
    
    // 유틸리티 함수들
    clearJobSelection,
    selectJob,
  }
}

/**
 * 페이지네이션 파라미터 훅
 * 페이지네이션과 관련된 모든 파라미터를 관리합니다.
 */
export const usePaginationParams = () => {
  const [page, setPage] = usePageParam()
  const [limit, setLimit] = useLimitParam()
  const [offset, setOffset] = useOffsetParam()
  
  const goToPage = (newPage: number) => {
    setPage(newPage)
    setOffset((newPage - 1) * limit) // 오프셋도 자동으로 계산
  }
  
  const changeLimit = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1) // 페이지 크기 변경시 첫 페이지로 이동
    setOffset(0)
  }
  
  const nextPage = () => {
    const newPage = page + 1
    goToPage(newPage)
  }
  
  const prevPage = () => {
    if (page > 1) {
      const newPage = page - 1
      goToPage(newPage)
    }
  }
  
  return {
    // 현재 값들
    page,
    limit,
    offset,
    
    // 업데이트 함수들
    setPage,
    setLimit,
    setOffset,
    
    // 유틸리티 함수들
    goToPage,
    changeLimit,
    nextPage,
    prevPage,
  }
}

/**
 * URL 상태 동기화 유틸리티
 * 컴포넌트의 로컬 상태와 URL 파라미터를 동기화하는 헬퍼 함수들
 */
export const useURLStateSync = () => {
  const searchParams = useSearchParams()
  const jobDetailParams = useJobDetailParams()
  const paginationParams = usePaginationParams()
  
  return {
    search: searchParams,
    jobDetail: jobDetailParams,
    pagination: paginationParams,
  }
}