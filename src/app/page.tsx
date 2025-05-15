import { HomeContainer } from '@/components/home/HomeContainer'
import { Section } from '@/components/home/Section'
import JobList from '@/components/position/JobList'
import CompanyCarousel from '@/components/company/CompanyCarousel'
import { sortedJobs as jobs } from '@/constants/job.data'
import { companies } from '@/constants/company.data'
import Script from 'next/script'
import HomeCarousel from '@/components/home/HomeCarousel'
import { HomeInquiry } from '@/components/home/HomeInquiry'
import { Metadata } from 'next'
import { encrypt } from '@/utils/crypto'
import EngagementTracker from '@/components/analytics/EngagementTracker'
import { getAllKeywords } from '@/constants/seo-keywords'

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
        url: '/images/og-image.jpg',
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
    images: ['/images/og-image.jpg'],
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Poromy - GPT/Claude AI 자소서 프롬프트 아카이브',
  description:
    'ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성, 기업 분석, 채용 공고 분석을 위한 최고의 AI 프롬프트 아카이브',
  mainEntity: [
    {
      '@type': 'ItemList',
      name: '채용 공고 별 AI 프롬프트',
      itemListElement: jobs.map((job, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'JobPosting',
          title: job.jobTitle,
          description: `${job.companyName}의 ${job.jobTitle} 채용 공고입니다. ${job.qualifications.join(' ')} ${job.preferredQualifications.join(' ')}`,
          datePosted: new Date().toISOString(),
          hiringOrganization: {
            '@type': 'Organization',
            name: job.companyName,
            logo: job.logoUrl,
            sameAs: job.url,
          },
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality:
                job.conditions.find(
                  (c) =>
                    c.includes('서울') ||
                    c.includes('성남') ||
                    c.includes('수원') ||
                    c.includes('대전') ||
                    c.includes('제주') ||
                    c.includes('판교')
                ) || '미지정',
            },
          },
          employmentType:
            job.conditions.find(
              (c) => c.includes('신입') || c.includes('경력')
            ) || '미지정',
          educationRequirements:
            job.conditions.find(
              (c) =>
                c.includes('대졸') || c.includes('석사') || c.includes('박사')
            ) || '미지정',
          url: `https://poromy.ai.kr/position/${encrypt(job.id)}`,
          validThrough: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days from now
        },
      })),
    },
    {
      '@type': 'ItemList',
      name: '기업별 AI 프롬프트',
      itemListElement: companies.map((company, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Organization',
          name: company.name,
          description: company.description,
          industry: company.industry,
          employeeCount: company.employeeCount,
          foundingDate: company.founded,
          url: `https://poromy.ai.kr/company/${encrypt(company.id)}`,
        },
      })),
    },
  ],
  about: {
    '@type': 'Thing',
    name: 'AI 프롬프트',
    description:
      'ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성과 기업 분석을 위한 프롬프트 모음',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://poromy.ai.kr',
  },
}

export default function Home() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeCarousel />
      <HomeContainer>
        <Section title="채용 공고 별 프롬프트" viewAllLink="/position">
          <JobList />
        </Section>

        <Section title="인기 기업 분석 프롬프트" viewAllLink="/company">
          <CompanyCarousel />
        </Section>

        <Section title="채용공고 분석요청" viewAllLink="/inquiry">
          <HomeInquiry />
        </Section>
      </HomeContainer>
      <EngagementTracker />
    </>
  )
}
