import { HomeContainer } from '@/components/home/HomeContainer'
import { Section } from '@/components/home/Section'
import HomeCarousel from '@/components/home/HomeCarousel'
import { Metadata } from 'next'
import { getAllKeywords } from '@/constants/seo-keywords'

import {
  DynamicJobList,
  DynamicCompanyCarousel,
  DynamicHomeInquiry,
  DynamicEngagementTracker,
} from '@/components/home/DynamicHomeComponents'
import StructuredData from '@/components/common/StructuredData'
import { HomePreloadResources } from '@/components/common/PreloadResources'
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
 * 📋 정적 구조화 데이터 생성
 * - 빠른 초기 로딩을 위한 정적 데이터
 * - 동적 데이터는 클라이언트에서 React Query로 처리
 */
function generateStaticStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Poromy - AI 자소서 프롬프트 아카이브',
    description:
      '200개+ 최신 채용공고 분석 프롬프트 제공. ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성 지원',
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
}

/**
 * 🏠 홈페이지 메인 컴포넌트
 * - 정적 메타데이터로 즉시 응답 (DB 호출 없음)
 * - React Query로 클라이언트 데이터 페칭
 * - 클라이언트 컴포넌트는 별도 로딩으로 점진적 렌더링
 * - 에러 발생 시에도 기본 UI는 정상 표시
 */
export default function HomePage() {
  // 📊 정적 구조화 데이터 생성 (DB 호출 없음)
  const structuredData = generateStaticStructuredData()
  const faqSchema = generateFAQSchema(faqs)

  return (
    <div className="min-h-screen bg-white">
      {/* 🚀 홈페이지 전용 리소스 프리로드 */}
      <HomePreloadResources />
      
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
