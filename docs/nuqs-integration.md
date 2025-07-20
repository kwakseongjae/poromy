# Nuqs Integration Guide

## Overview

이 프로젝트는 기존의 수동적인 URL 쿼리 파라미터 관리를 `nuqs` (Next.js URL Query State) 라이브러리를 사용한 타입 안전하고 선언적인 방식으로 대체했습니다.

## 주요 변경사항

### Before (기존 방식)
```tsx
// 수동적인 URL 파라미터 관리
const searchParams = useSearchParams()
const router = useRouter()
const pathname = usePathname()

const query = searchParams.get('query') || ''

const updateQuery = (newQuery: string) => {
  const params = new URLSearchParams(searchParams)
  if (newQuery) {
    params.set('query', newQuery)
  } else {
    params.delete('query')
  }
  router.push(`${pathname}?${params.toString()}`)
}
```

### After (nuqs 방식)
```tsx
// 선언적이고 타입 안전한 URL 파라미터 관리
import { useSearchQuery } from '@/hooks/useQueryParams'

const [query, setQuery] = useSearchQuery()

// 간단한 상태 업데이트
setQuery(newQuery)
```

## 핵심 장점

1. **타입 안전성**: TypeScript와 완벽 통합
2. **선언적 API**: React의 useState와 동일한 패턴
3. **자동 URL 동기화**: 상태 변경이 즉시 URL에 반영
4. **SSR/SSG 호환**: Next.js와 완벽 호환
5. **히스토리 관리**: 브라우저 뒤로가기/앞으로가기 자동 지원

## 프로젝트 구조

### 1. Provider 설정

```tsx
// src/providers/NuqProvider.tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function NuqProvider({ children }: NuqProviderProps) {
  return <NuqsAdapter>{children}</NuqsAdapter>
}
```

### 2. 커스텀 훅 라이브러리

```tsx
// src/hooks/useQueryParams.ts
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

export const useSearchQuery = () => {
  return useQueryState(
    'query',
    parseAsString.withDefault('').withOptions({
      clearOnDefault: true,
    })
  )
}

export const usePageParam = () => {
  return useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({
      clearOnDefault: true,
    })
  )
}
```

## 사용법

### 기본 사용법

```tsx
import { useSearchQuery, usePageParam } from '@/hooks/useQueryParams'

function SearchComponent() {
  const [query, setQuery] = useSearchQuery()
  const [page, setPage] = usePageParam()

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <button onClick={() => setPage(page + 1)}>
        Next Page
      </button>
    </div>
  )
}
```

### 복합 파라미터 관리

```tsx
import { useSearchParams } from '@/hooks/useQueryParams'

function AdvancedSearchComponent() {
  const {
    query,
    page,
    sort,
    jobType,
    setQuery,
    setPage,
    setSort,
    setJobType,
    resetSearch,
  } = useSearchParams()

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="latest">최신순</option>
        <option value="popular">인기순</option>
      </select>
      <button onClick={resetSearch}>초기화</button>
    </div>
  )
}
```

## 컴포넌트별 적용 현황

### SearchBar 컴포넌트
- **Before**: `useSearchParams`, `useRouter`, `usePathname` 조합
- **After**: `useSearchQuery` 훅 사용
- **장점**: 코드 라인 50% 감소, 타입 안전성 향상

### PositionContent 컴포넌트
- **Before**: 복잡한 URL 파라미터 조작 로직
- **After**: 선언적 파라미터 관리
- **장점**: 가독성 향상, 버그 위험 감소

## 파라미터 타입별 가이드

### 문자열 파라미터
```tsx
export const useSearchQuery = () => {
  return useQueryState(
    'query',
    parseAsString.withDefault('').withOptions({
      clearOnDefault: true, // 빈 문자열일 때 URL에서 제거
    })
  )
}
```

### 숫자 파라미터
```tsx
export const usePageParam = () => {
  return useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({
      clearOnDefault: true, // 1일 때 URL에서 제거
    })
  )
}
```

### 선택적 파라미터
```tsx
export const useJobIdParam = () => {
  return useQueryState(
    'id',
    parseAsString.withOptions({
      clearOnDefault: true, // null일 때 URL에서 제거
    })
  )
}
```

## 마이그레이션 체크리스트

- [x] nuqs 라이브러리 설치
- [x] NuqProvider 설정
- [x] 커스텀 훅 라이브러리 구현
- [x] SearchBar 컴포넌트 리팩토링
- [x] PositionContent 컴포넌트 리팩토링
- [x] 빌드 테스트 완료
- [x] TypeScript 타입 검증 완료

## 성능 최적화

### 1. 기본값 설정
```tsx
// 기본값을 설정하여 불필요한 리렌더링 방지
parseAsString.withDefault('')
parseAsInteger.withDefault(1)
```

### 2. clearOnDefault 옵션
```tsx
// 기본값일 때 URL에서 파라미터 제거로 깔끔한 URL 유지
.withOptions({ clearOnDefault: true })
```

### 3. 배치 업데이트
```tsx
// 여러 파라미터를 동시에 업데이트할 때 배치 처리
const updateMultipleParams = () => {
  setQuery('new query')
  setPage(1)
  setSort('latest')
}
```

## 문제 해결

### 1. 초기 렌더링에서 undefined 값
**문제**: 첫 렌더링에서 파라미터 값이 undefined
**해결**: 기본값 설정과 조건부 렌더링 사용

```tsx
const [query, setQuery] = useSearchQuery()

// 로딩 중일 때 처리
if (query === undefined) {
  return <div>Loading...</div>
}
```

### 2. SSR 불일치
**문제**: 서버와 클라이언트 렌더링 결과 불일치
**해결**: Suspense와 fallback 컴포넌트 사용

```tsx
<Suspense fallback={<SearchBarFallback />}>
  <SearchBarContent />
</Suspense>
```

## 향후 개선 계획

1. **타입 안전성 강화**: 파라미터 값에 대한 더 엄격한 타입 정의
2. **성능 최적화**: 메모이제이션과 최적화된 렌더링
3. **테스트 추가**: 각 훅에 대한 단위 테스트 작성
4. **문서화 확장**: 더 많은 사용 사례와 패턴 문서화

## 참고 자료

- [nuqs 공식 문서](https://github.com/47ng/nuqs)
- [Next.js App Router 가이드](https://nextjs.org/docs/app)
- [React Query와의 통합 패턴](https://tanstack.com/query/latest)