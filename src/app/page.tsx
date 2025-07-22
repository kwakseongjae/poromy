import { HomeContainer } from '@/components/home/HomeContainer'
import { Section } from '@/components/home/Section'
import HomeCarousel from '@/components/home/HomeCarousel'
import { Metadata } from 'next'
import { getAllKeywords } from '@/constants/seo-keywords'
import { getLatestJobs, getJobsCount } from '@/lib/supabase-jobs'
import {
  DynamicJobList,
  DynamicCompanyCarousel,
  DynamicHomeInquiry,
  DynamicEngagementTracker,
} from '@/components/home/DynamicHomeComponents'
import StructuredData from '@/components/common/StructuredData'
import { generateFAQSchema } from '@/utils/structured-data'
import { faqs } from '@/constants/faq'

// ISR 설정: 5분마다 재생성 (빌드타임 + 주기적 업데이트)
export const revalidate = 180 // 3분

/**
 * 📈 성능 최적화: 정적 메타데이터
 * - 데이터베이스 호출 완전 제거
 * - 초기 로딩 시 즉시 응답 가능
 * - 동적 요소는 ISR로 주기적 업데이트
 */
export const metadata: Metadata = {
  title: 'Poromy - GPT/Claude AI 자소서 프롬프트 아카이브',
  description:
    'ChatGPT, Claude AI로 자기소개서 작성하기. 200개+ 기업의 채용공고 분석과 맞춤형 자소서 프롬프트를 제공합니다. 서류 합격률 높이는 AI 취업 도우미.',
  keywords: getAllKeywords(),
  alternates: {
    canonical: 'https://poromy.ai.kr',
  },
  openGraph: {
    title: 'Poromy - GPT/Claude AI 자소서 프롬프트 아카이브',
    description:
      'ChatGPT, Claude를 활용한 자기소개서 작성법. 200개+ 기업 채용공고 분석과 맞춤형 프롬프트로 서류 합격률을 높이세요.',
    url: 'https://poromy.ai.kr',
    siteName: 'Poromy',
    images: [
      {
        url: `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
        width: 1200,
        height: 630,
        alt: 'Poromy - GPT/Claude AI 자소서 프롬프트 아카이브',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Poromy - GPT/Claude AI 자소서 프롬프트 아카이브',
    description:
      'ChatGPT, Claude를 활용한 자기소개서 작성법. 200개+ 기업 채용공고 분석과 맞춤형 프롬프트로 서류 합격률을 높이세요.',
    images: [
      `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
    ],
  },
}

/**
 * 📊 최적화된 데이터 페칭 (서버 컴포넌트에서만 실행)
 * - ISR로 빌드타임 + 주기적 재생성
 * - 구조화 데이터 생성을 위한 최소한의 데이터만 페칭
 * - 에러 발생 시 즉시 폴백으로 안정성 확보
 */
async function getStructuredDataForISR() {
  try {
    // 📈 병렬 처리로 대기 시간 최소화 (타임아웃 설정)
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database timeout')), 2000)
    )

    const dataPromise = Promise.all([getJobsCount()])

    const [totalCount] = (await Promise.race([dataPromise, timeout])) as [
      any[],
      number,
    ]

    return {
      totalCount,
    }
  } catch (error) {
    console.error('Error fetching structured data (using fallback):', error)
    // 📊 에러 시 즉시 정적 폴백 데이터 (DB 조회 없음)
    return {
      totalCount: 200,
    }
  }
}

/**
 * 📋 경량화된 구조화 데이터 생성
 * - 최소한의 DB 데이터로 SEO 최적화
 * - 에러 발생 시 정적 폴백으로 안정성 확보
 * - 구조화 데이터 크기 최소화로 성능 향상
 */
async function generateOptimizedStructuredData() {
  try {
    const { totalCount } = await getStructuredDataForISR()

    // 📊 구조화 데이터 크기 최소화 (필수 항목만 포함)
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Poromy - ${totalCount}개+ 기업 AI 자소서 프롬프트 아카이브`,
      description: `${totalCount}개 이상의 최신 채용공고 분석 프롬프트 제공. ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성 지원`,
      mainEntity: {
        '@type': 'Organization',
        name: 'Poromy',
        url: 'https://poromy.ai.kr',
        description: 'AI 자소서 프롬프트 아카이브 서비스',
        sameAs: [
          'https://lambda-log.tistory.com',
          'https://github.com/kwakseongjae',
        ],
        additionalType: 'TechCompany',
        knowsAbout: ['AI', 'ChatGPT', 'Claude', '자소서', '채용', '프롬프트'],
      },
    }
  } catch (error) {
    console.error('Error generating structured data:', error)
    // 📊 에러 시 최소한의 정적 구조화 데이터
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Poromy - AI 자소서 프롬프트 아카이브',
      description:
        '200개 이상의 최신 채용공고 분석 프롬프트 제공. ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성 지원',
      mainEntity: {
        '@type': 'Organization',
        name: 'Poromy',
        url: 'https://poromy.ai.kr',
        description: 'AI 자소서 프롬프트 아카이브 서비스',
      },
    }
  }
}

/**
 * 🏠 홈페이지 메인 컴포넌트
 * - 정적 메타데이터로 즉시 응답 (DB 호출 없음)
 * - ISR로 데이터 신선도 유지 (3분 주기)
 * - 클라이언트 컴포넌트는 별도 로딩으로 점진적 렌더링
 * - 에러 발생 시에도 기본 UI는 정상 표시
 */
export default async function HomePage() {
  // 📊 구조화 데이터만 서버에서 생성 (나머지는 클라이언트에서 점진적 로딩)
  const structuredData = await generateOptimizedStructuredData()
  const faqSchema = generateFAQSchema(faqs)

  return (
    <div className="min-h-screen bg-white">
      {/* 📊 SEO 최적화: 구조화 데이터 */}
      <StructuredData schema={structuredData} />
      <StructuredData schema={faqSchema} />

      {/* 🎨 헤로 섹션 - 정적 콘텐츠로 즉시 렌더링 */}
      <HomeCarousel />

      <HomeContainer>
        {/* 📋 최신 채용공고 - 동적 로딩 (클라이언트 컴포넌트) */}
        <Section title="최신 채용공고" viewAllLink="/position">
          <DynamicJobList />
        </Section>

        {/* 🏢 회사 캐러셀 - 동적 로딩 */}
        <Section title="회사별 프롬프트" viewAllLink="/company">
          <DynamicCompanyCarousel />
        </Section>

        {/* 💬 최신 질문 - 동적 로딩 */}
        <Section title="최신 질문" viewAllLink="/inquiry">
          <DynamicHomeInquiry />
        </Section>

        {/* 📈 분석 트래커 - 비동기 로딩 */}
        <DynamicEngagementTracker />
      </HomeContainer>
    </div>
  )
}
