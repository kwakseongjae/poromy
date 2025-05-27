![Poromy](./public/images/og-image.jpg)

# Poromy AI 🤖

## 취준생을 위한 AI 자소서 프롬프트 아카이브

채용 공고를 분석하여 맞춤형 자기소개서 작성을 돕는 AI 프롬프트 생성 서비스입니다.  
직행의 채용 정보를 활용하여 취준생들의 서류 작성 부담을 덜어드립니다.

🔗 **서비스 링크**: [https://poromy.ai.kr](https://poromy.ai.kr)

## 프로젝트 소개

### 🎯 왜 Poromy를 만들었나요?

취업 준비 과정에서 수많은 채용 플랫폼(네이버, 사람인, 잡코리아, 원티드, 점핏 등)을 매일 확인하며 정보를 수집하는 비효율적인 과정을 겪었습니다. **직행**을 통해 통합된 채용 정보를 얻게 되었지만, 여전히 각 공고에 맞는 자기소개서를 작성하기 위해 AI에 일일이 정보를 입력하는 번거로움이 있었습니다.

이러한 개인적 경험을 바탕으로, **채용 데이터와 AI의 시너지**를 통해 취준생들의 자소서 작성 과정을 혁신하고자 Poromy를 개발했습니다.

### 🚀 주요 기능

- **채용공고 기반 프롬프트 제공**: 직행에서 수집한 채용 정보와 사용자가 문의한 채용공고를 분석하여 맞춤형 AI 프롬프트 제공
- **SEO 최적화**: 채용공고 정보를 반영한 동적 Sitemap 자동 생성 시스템을 구축하여 검색 엔진 최적화

## 기술 스택

### Frontend

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/Next.js 15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
<img src="https://img.shields.io/badge/React 19-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">

### Backend & Database

<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white">

### AI IDE Tool

<img src="https://img.shields.io/badge/Cursor AI-000000?style=for-the-badge&logo=cursor&logoColor=white">

## 성과 및 최적화

### 🎯 성능 개선

1. **병렬 처리 최적화**

   - Promise.all을 활용한 데이터 조회 최적화
   - **성과**: 데이터 조회 속도 **4배 향상** (4초 → 1초)

2. **LCP(Largest Contentful Paint) 최적화**

   - 이미지 최적화 및 레이지 로딩 적용
   - 중요 리소스 우선순위 조정
   - **성과**: 페이지 로딩 속도 **57% 개선** (5.64초 → 2.43초)

3. **SEO 최적화**
   - TypeScript → JavaScript 변환 자동화 스크립트 구현
   - 동적 Sitemap 생성으로 검색 엔진 노출 증대

### 💡 기술적 도전 과제 해결

1. **Next.js 외부 도메인 이미지 제한 문제**

   - **문제**: 다양한 기업 로고 이미지의 외부 도메인 제한
   - **해결**: 이미지 프록시 API 구현으로 모든 외부 이미지 안전하게 처리

2. **개발 생산성 향상**
   - Cursor AI와 .cursorrules 활용
   - 디렉토리 구조 감지 자동화 스크립트 구현
   - 빌드 시점에 .cursorrules 자동 업데이트로 일관된 코드 품질 유지

## 프로젝트 구조

```
poromy-front/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React 컴포넌트
│   ├── lib/             # 유틸리티 함수
│   └── assets/          # 정적 자원
├── public/              # 정적 파일
├── scripts/             # 빌드 및 자동화 스크립트
│   ├── generate-data.js # 데이터 생성 스크립트
│   └── update-cursorrules.js # Cursor 규칙 업데이트
└── package.json
```

## 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

## 앞으로의 계획

1. **채용 플랫폼 연동 파이프라인 구축**

   - 채용 플랫폼과의 협업을 통한 실시간 채용공고 수집 자동화
   - AI 기반 채용공고 분석 및 맞춤형 프롬프트 자동 생성 시스템
   - 사용자별 관심 분야 및 경력에 따른 개인화된 프롬프트 추천 엔진

2. **AI 고도화**

   - 기업별 자소서 스타일 학습
   - 합격 자소서 패턴 분석

3. **커뮤니티 기능**
   - 프롬프트 공유 및 평가
   - 취준생 네트워킹

## Contact

**개발자**: 곽성재  
**이메일**: gkffhdnls13@gmail.com  
**GitHub**: [@kwakseongjae](https://github.com/kwakseongjae)  
**블로그**: [lambda-log.tistory.com](https://lambda-log.tistory.com)
