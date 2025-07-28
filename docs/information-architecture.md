# Poromy Information Architecture (IA)

## 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [시스템 아키텍처](#시스템-아키텍처)
4. [라우팅 구조](#라우팅-구조)
5. [데이터 아키텍처](#데이터-아키텍처)
6. [컴포넌트 아키텍처](#컴포넌트-아키텍처)
7. [상태 관리](#상태-관리)
8. [API 구조](#api-구조)
9. [보안 및 인증](#보안-및-인증)
10. [성능 최적화](#성능-최적화)
11. [SEO 전략](#seo-전략)
12. [배포 아키텍처](#배포-아키텍처)

## 프로젝트 개요

**Poromy**는 한국어 기반 AI 기반 커리어 지원 플랫폼으로, 구직자들이 AI 프롬프트를 활용하여 맞춤형 자기소개서를 작성할 수 있도록 돕는 서비스입니다.

### 핵심 기능
- 채용공고 기반 AI 프롬프트 생성
- 기업별 맞춤형 자소서 프롬프트 제공
- ChatGPT/Claude AI 활용 가이드
- 커뮤니티 기반 Q&A 시스템

### 타겟 사용자
- 한국 구직자 (신입/경력)
- AI 도구를 활용한 자소서 작성 희망자
- 효율적인 취업 준비를 원하는 사용자

## 기술 스택

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript (Strict Mode)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Font**: Pretendard (한국어 최적화)

### Backend & Infrastructure
- **Database**: Supabase (PostgreSQL + RLS)
- **Authentication**: Supabase Auth
- **Email Service**: Resend
- **Hosting**: Vercel (추정)

### State Management & Data Fetching
- **Server State**: TanStack React Query v5
- **URL State**: nuqs
- **Client State**: React Context API

### Development Tools
- **Package Manager**: pnpm
- **AI Assistant**: Cursor AI
- **Code Quality**: ESLint, Prettier
- **Build Tools**: Webpack (Next.js 내장)

## 시스템 아키텍처

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client Browser │────▶│  Next.js Server │────▶│    Supabase     │
│   (React App)   │     │   (App Router)  │     │   (PostgreSQL)  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  React Query    │     │   API Routes    │     │   Row Level     │
│  (Cache Layer)  │     │  (Route Handlers)│     │   Security      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 아키텍처 특징
- **Server-Side Rendering (SSR)**: SEO 최적화 및 초기 로딩 성능
- **Incremental Static Regeneration (ISR)**: 3분 주기 재생성
- **Edge Functions**: API 라우트 최적화
- **Multi-Layer Caching**: 서버, API, 브라우저 캐싱

## 라우팅 구조

### 페이지 계층 구조
```
/
├── / (홈페이지)
├── /company
│   ├── /company (기업 목록)
│   └── /company/[id] (기업 상세)
├── /position
│   ├── /position (채용공고 목록)
│   └── /position/[id] (채용공고 상세)
├── /inquiry
│   ├── /inquiry (질문 목록)
│   ├── /inquiry/new (새 질문)
│   └── /inquiry/[id] (질문 상세)
├── /guide
│   ├── /guide (가이드 목록)
│   └── /guide/[type] (가이드 상세)
├── /role
│   ├── /role (직무 목록)
│   └── /role/[name] (직무 상세)
├── /auth
│   ├── /login (로그인)
│   ├── /signup (회원가입)
│   └── /verify-email (이메일 인증)
├── /admin
│   ├── /admin (관리자 대시보드)
│   ├── /admin/jobs (채용공고 관리)
│   └── /admin/add-test-users (테스트 사용자 추가)
└── /403 (접근 거부)
```

### API 엔드포인트 구조
```
/api
├── /admin
│   ├── /add-test-users
│   ├── /jobs
│   └── /test-users/count
├── /auth
│   ├── /admin-status
│   ├── /callback
│   ├── /resend-verification
│   └── /verify
├── /jobs
│   ├── /[id]
│   └── / (목록)
├── /inquiries
│   ├── /[id]
│   ├── /[id]/answers
│   └── / (목록)
├── /prompts
│   ├── /company/[id]
│   └── /position/[id]
├── /email
│   ├── /answer-notification
│   └── /inquiry-notification
├── /image-proxy
├── /link-preview
├── /create-profile
├── /update-profile
└── /revalidate
```

## 데이터 아키텍처

### 데이터베이스 스키마

#### 주요 테이블
```sql
-- 사용자 프로필
profiles {
  id: uuid (PK, FK → auth.users)
  email: string
  nickname: string
  is_verified: boolean
  is_admin: boolean
  created_at: timestamp
  updated_at: timestamp
}

-- 채용공고
jobs {
  id: serial (PK)
  company_name: string
  job_title: string
  job_type: string
  position_description: string
  main_task: string
  conditions: string[]
  qualifications: string[]
  preferred_qualifications: string[]
  logo_url: string?
  url: string?
  prompt_content: string?
  deadline: string
  created_at: timestamp
  updated_at: timestamp
}

-- 기업 정보 (상수 파일로 관리)
companies {
  id: string
  name: string
  type: 'large' | 'medium' | 'small' | 'startup'
  industry: string
  description: string
  tags: string[]
  imageUrl: string?
}

-- 문의사항
inquiries {
  id: uuid (PK)
  user_id: uuid (FK → profiles)
  title: string
  content: string
  url: string?
  status: string
  created_at: timestamp
}

-- 답변
answers {
  id: uuid (PK)
  inquiry_id: uuid (FK → inquiries)
  admin_id: uuid (FK → profiles)
  content: string
  url: string?
  created_at: timestamp
}

-- 관리자
administrators {
  id: uuid (PK, FK → profiles)
  created_at: timestamp
}
```

### 데이터 흐름
1. **읽기 작업**: React Query → API Route → Supabase Client → PostgreSQL
2. **쓰기 작업**: Form → API Route → Supabase Admin Client → PostgreSQL
3. **캐싱**: React Query (Client) + Next.js Cache (Server) + CDN Cache

## 컴포넌트 아키텍처

### 컴포넌트 구조
```
src/components/
├── admin/              # 관리자 전용 컴포넌트
│   ├── AddTestUserForm
│   ├── AdminErrorBoundary
│   └── AdminGuard
├── analytics/          # 분석 및 추적
│   ├── ClientAnalytics
│   └── EngagementTracker
├── common/             # 공통 유틸리티 컴포넌트
│   ├── HelpModal
│   ├── NotificationMessage
│   ├── PerformanceOptimizer
│   ├── PreloadResources
│   ├── PromptContainer
│   ├── SearchBar
│   └── StructuredData
├── company/            # 기업 관련 컴포넌트
│   └── CompanyCarousel
├── home/               # 홈페이지 컴포넌트
│   ├── DynamicHomeComponents
│   ├── HomeCarousel
│   ├── HomeContainer
│   ├── HomeInquiry
│   ├── Section
│   └── SectionHeader
├── inquiry/            # 문의 관련 컴포넌트
│   ├── AnswerForm
│   ├── HomeInquiryCard
│   ├── InquiryCard
│   ├── InquiryCarousel
│   ├── InquiryList
│   └── InquiryProcessModal
├── modal/              # 모달 컴포넌트
│   └── ProfileModal
├── navigation/         # 네비게이션 컴포넌트
│   ├── Navbar
│   └── Sidebar
├── position/           # 채용공고 컴포넌트
│   ├── JobList
│   └── PositionContent
└── ui/                 # 기본 UI 컴포넌트
    └── Dialog
```

### 컴포넌트 패턴
- **Domain-based Organization**: 비즈니스 도메인별 그룹화
- **Barrel Exports**: index.ts를 통한 깔끔한 import
- **Dynamic Imports**: 클라이언트 전용 컴포넌트의 코드 스플리팅
- **Composition Pattern**: Props drilling 방지

## 상태 관리

### 상태 관리 전략
```
┌─────────────────────────────────────────────────────┐
│                   Global State                       │
├─────────────────┬─────────────────┬─────────────────┤
│  Server State   │   URL State     │  Client State   │
│  (React Query)  │     (nuqs)      │  (React Context)│
├─────────────────┼─────────────────┼─────────────────┤
│ - Jobs Data     │ - Search Query  │ - User Auth     │
│ - Companies     │ - Filters       │ - Admin Status  │
│ - Inquiries     │ - Pagination    │ - UI State      │
│ - User Profile  │ - Sort Order    │ - Modal State   │
└─────────────────┴─────────────────┴─────────────────┘
```

### React Query 구조
- **Query Keys**: 중앙화된 키 관리 (`query-keys.ts`)
- **구조**: `['poromy', domain, action, ...params]`
- **캐싱 전략**: 
  - staleTime: 5분
  - gcTime: 10분
  - refetchOnWindowFocus: false

### Context Providers
1. **SupabaseContext**: 인증 상태 및 사용자 정보
2. **ReactQueryProvider**: 서버 상태 관리
3. **NuqsProvider**: URL 상태 동기화

## API 구조

### API 설계 원칙
- RESTful 엔드포인트 설계
- 일관된 응답 형식
- 에러 핸들링 표준화
- 캐싱 헤더 최적화

### 주요 API 패턴
```typescript
// 읽기 작업 (GET)
- 메모리 캐싱 (1분)
- HTTP 캐싱 (3분)
- Stale-while-revalidate

// 쓰기 작업 (POST/PUT/DELETE)
- 트랜잭션 처리
- 낙관적 업데이트
- 에러 롤백
```

### Supabase 클라이언트 패턴
```typescript
// 클라이언트 타입별 사용
- Browser Client: 클라이언트 컴포넌트
- Server Client: 서버 컴포넌트/API
- Admin Client: RLS 우회 작업
- Middleware Client: 라우트 보호
```

## 보안 및 인증

### 보안 계층
1. **Row Level Security (RLS)**: 데이터베이스 레벨 보안
2. **Middleware Protection**: 라우트 레벨 보호
3. **API Route Guards**: 엔드포인트 보호
4. **CORS & CSP Headers**: 브라우저 보안

### 인증 흐름
```
사용자 → 로그인 → Supabase Auth → JWT 토큰 
    → 미들웨어 검증 → 보호된 라우트 접근
```

### 권한 관리
- **일반 사용자**: 읽기, 문의 작성
- **인증 사용자**: 프로필 수정, 문의 관리
- **관리자**: 전체 데이터 관리, 사용자 관리

## 성능 최적화

### 최적화 전략
1. **이미지 최적화**
   - Next.js Image 컴포넌트
   - WebP 포맷 자동 변환
   - 외부 이미지 프록시 API

2. **번들 최적화**
   - 코드 스플리팅
   - Tree shaking
   - Dynamic imports

3. **캐싱 전략**
   - ISR: 3분 재검증
   - API: 5분 캐시 + SWR
   - 정적 자산: 1년 캐시
   - 폰트: 공격적 캐싱

4. **폰트 최적화**
   - Pretendard 로컬 호스팅
   - font-display: optional
   - 서브셋 폰트 로딩

## SEO 전략

### SEO 최적화
1. **메타데이터**
   - 동적 메타 태그 생성
   - Open Graph 태그
   - Twitter 카드

2. **구조화된 데이터**
   - JSON-LD 스키마
   - FAQ 스키마
   - Organization 스키마

3. **사이트맵 & Robots**
   - 동적 사이트맵 생성
   - robots.txt 최적화
   - 한국 검색엔진 최적화

4. **콘텐츠 최적화**
   - 한국어 우선 콘텐츠
   - 의미있는 URL 구조
   - 적절한 헤딩 계층

## 배포 아키텍처

### 빌드 파이프라인
```bash
1. cursorrules:update  # AI 도구 규칙 업데이트
2. generate:sitemap    # 동적 사이트맵 생성
3. generate:robots     # robots.txt 생성
4. next build          # 프로덕션 빌드
```

### 환경 변수
- Supabase 설정 (URL, Keys)
- Google Analytics ID
- 이메일 서비스 (Resend)
- 이미지 프록시 설정

### 모니터링
- 성능 메트릭스 추적
- 에러 로깅
- 사용자 행동 분석
- SEO 성과 측정

## 개발 가이드라인

### 코드 품질
- TypeScript Strict Mode
- ESLint & Prettier
- 컴포넌트 합성 패턴
- 커스텀 훅 추상화

### 성능 고려사항
- 이미지 최적화 필수
- 로딩 상태 구현
- 에러 바운더리 설정
- 번들 크기 모니터링

### 접근성
- 시맨틱 HTML
- WCAG 가이드라인
- 키보드 네비게이션
- 스크린 리더 지원

## 향후 개선 사항

### 기술적 개선
- 테스트 프레임워크 도입
- E2E 테스트 구현
- 성능 모니터링 강화
- CI/CD 파이프라인 개선

### 기능적 개선
- 실시간 알림 시스템
- AI 프롬프트 개인화
- 사용자 분석 대시보드
- 멀티 언어 지원

### 확장성 개선
- 마이크로서비스 아키텍처
- 캐싱 레이어 강화
- CDN 최적화
- 데이터베이스 샤딩