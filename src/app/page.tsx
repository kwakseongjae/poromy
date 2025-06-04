import { HomeContainer } from '@/components/home/HomeContainer'
import { Section } from '@/components/home/Section'
import { sortedJobs as jobs } from '@/constants/job.data'
import { companies } from '@/constants/company.data'
import HomeCarousel from '@/components/home/HomeCarousel'
import { Metadata } from 'next'
import { encrypt } from '@/utils/crypto'
import { getAllKeywords } from '@/constants/seo-keywords'
import {
  DynamicJobList,
  DynamicCompanyCarousel,
  DynamicHomeInquiry,
  DynamicEngagementTracker,
} from '@/components/home/DynamicHomeComponents'
import StructuredData from '@/components/common/StructuredData'
import { generateFAQSchema } from '@/utils/structured-data'
import { faqs } from '@/constants/faq'

export const metadata: Metadata = {
  title: 'Poromy - GPT/Claude AI 자소서 프롬프트 아카이브',
  description:
    'ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성, 기업 분석, 채용 공고 분석을 위한 최고의 AI 프롬프트 아카이브. 맞춤형 자기소개서 작성과 기업 분석을 도와드립니다.',
  keywords: getAllKeywords(),
  openGraph: {
    title: 'Poromy - GPT/Claude AI 자소서 프롬프트 아카이브',
    description:
      'ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성, 기업 분석, 채용 공고 분석을 위한 최고의 AI 프롬프트 아카이브',
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
      'ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성, 기업 분석, 채용 공고 분석을 위한 최고의 AI 프롬프트 아카이브',
    images: [
      `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
    ],
  },
}

// 메인 구조화된 데이터
const mainStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Poromy - GPT/Claude AI 자소서 프롬프트 아카이브',
  description:
    'ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성, 기업 분석, 채용 공고 분석을 위한 최고의 AI 프롬프트 아카이브',
  mainEntity: [
    {
      '@type': 'ItemList',
      name: '채용 공고 별 AI 프롬프트',
      numberOfItems: jobs.length,
      itemListElement: jobs.slice(0, 10).map((job, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'JobPosting',
          title: job.jobTitle,
          description: `${job.companyName}의 ${job.jobTitle} 채용 공고 분석 프롬프트`,
          hiringOrganization: {
            '@type': 'Organization',
            name: job.companyName,
          },
          url: `https://poromy.ai.kr/position/${encrypt(job.id)}`,
        },
      })),
    },
    {
      '@type': 'ItemList',
      name: '기업별 AI 프롬프트',
      numberOfItems: companies.length,
      itemListElement: companies.slice(0, 10).map((company, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Organization',
          name: company.name,
          description: `${company.name} 기업 분석 프롬프트`,
          url: `https://poromy.ai.kr/company/${encrypt(company.id)}`,
        },
      })),
    },
  ],
  about: {
    '@type': 'Thing',
    name: 'AI 프롬프트 아카이브',
    description:
      'ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성과 기업 분석을 위한 전문 프롬프트 모음',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://poromy.ai.kr',
  },
}

export default function Home() {
  // FAQ 스키마 생성
  const faqSchema = generateFAQSchema(faqs)

  // 모든 스키마를 배열로 결합
  const schemas = [mainStructuredData, faqSchema]

  return (
    <>
      <StructuredData schema={schemas} />
      <h1 className="sr-only">Poromy - AI 자소서 프롬프트 아카이브 홈페이지</h1>
      <HomeCarousel />
      <HomeContainer>
        <Section title="채용 공고 별 프롬프트" viewAllLink="/position">
          <DynamicJobList />
        </Section>

        <Section title="인기 기업 분석 프롬프트" viewAllLink="/company">
          <DynamicCompanyCarousel />
        </Section>

        <Section title="채용공고 분석요청" viewAllLink="/inquiry">
          <DynamicHomeInquiry />
        </Section>
      </HomeContainer>
      <DynamicEngagementTracker />
    </>
  )
}
