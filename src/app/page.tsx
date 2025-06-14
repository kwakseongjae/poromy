import { HomeContainer } from '@/components/home/HomeContainer'
import { Section } from '@/components/home/Section'
import HomeCarousel from '@/components/home/HomeCarousel'
import { Metadata } from 'next'
import { getAllKeywords } from '@/constants/seo-keywords'
import { getAllJobs } from '@/lib/supabase-jobs'
import {
  DynamicJobList,
  DynamicCompanyCarousel,
  DynamicHomeInquiry,
  DynamicEngagementTracker,
} from '@/components/home/DynamicHomeComponents'
import StructuredData from '@/components/common/StructuredData'
import { generateFAQSchema } from '@/utils/structured-data'
import { faqs } from '@/constants/faq'

// 동적 메타데이터 생성 - 서버에서 직접 jobs 데이터 불러오기
export async function generateMetadata(): Promise<Metadata> {
  try {
    // 서버에서 직접 채용공고 데이터 불러오기
    const jobs = await getAllJobs()

    // 최신 5개 채용공고 정보
    const latestJobs = jobs.slice(0, 5)
    const companyNames = latestJobs.map((job) => job.companyName).join(', ')

    // 기본 title과 description (정적)
    const staticTitle = 'Poromy - GPT/Claude AI 자소서 프롬프트 아카이브'
    const staticDescription =
      'ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성, 기업 분석, 채용 공고 분석을 위한 최고의 AI 프롬프트 아카이브. 맞춤형 자기소개서 작성과 기업 분석을 도와드립니다.'

    // 동적 키워드 생성 (동적)
    const jobTypes = [...new Set(jobs.map((job) => job.jobType))]
    const dynamicKeywords = [
      ...getAllKeywords(),
      ...companyNames.split(', '),
      ...jobTypes,
      '최신 채용공고',
      `${jobs.length}개 기업`,
    ].join(', ')

    return {
      title: staticTitle,
      description: staticDescription,
      keywords: dynamicKeywords,
      openGraph: {
        title: staticTitle,
        description: staticDescription,
        url: 'https://poromy.ai.kr',
        siteName: 'Poromy',
        images: [
          {
            url: `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
            width: 1200,
            height: 630,
            alt: `Poromy - ${jobs.length}개 기업 AI 자소서 프롬프트 아카이브`,
          },
        ],
        locale: 'ko_KR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: staticTitle,
        description: staticDescription,
        images: [
          `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
        ],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)

    // 에러 시 기본 메타데이터 반환
    return {
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
  }
}

// 메인 구조화된 데이터도 동적으로 생성
async function generateMainStructuredData() {
  try {
    const jobs = await getAllJobs()
    const latestJobs = jobs.slice(0, 10) // 상위 10개 채용공고

    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Poromy - ${jobs.length}개 기업 AI 자소서 프롬프트 아카이브`,
      description: `${jobs.length}개의 최신 채용공고 분석 프롬프트 제공. ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성 지원`,
      mainEntity: [
        {
          '@type': 'ItemList',
          name: '채용 공고 별 AI 프롬프트',
          description: `${jobs.length}개 기업의 채용 공고 분석 프롬프트 모음`,
          numberOfItems: jobs.length,
          itemListElement: latestJobs.map((job, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Article',
              name: `${job.companyName} ${job.jobTitle} 프롬프트`,
              description: job.positionDescription,
              publisher: {
                '@type': 'Organization',
                name: 'Poromy',
                url: 'https://poromy.ai.kr',
              },
            },
          })),
        },
        {
          '@type': 'Organization',
          name: 'Poromy',
          url: 'https://poromy.ai.kr',
          description: 'AI 자소서 프롬프트 아카이브 서비스',
          sameAs: [
            'https://lambda-log.tistory.com',
            'https://github.com/kwakseongjae',
          ],
        },
      ],
    }
  } catch (error) {
    console.error('Error generating structured data:', error)
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Poromy - GPT/Claude AI 자소서 프롬프트 아카이브',
      description:
        'ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성, 기업 분석, 채용 공고 분석을 위한 최고의 AI 프롬프트 아카이브',
      mainEntity: [
        {
          '@type': 'ItemList',
          name: '채용 공고 별 AI 프롬프트',
          description: '다양한 기업의 채용 공고 분석 프롬프트 모음',
        },
      ],
    }
  }
}

export default async function HomePage() {
  // 서버에서 구조화된 데이터 생성
  const mainStructuredData = await generateMainStructuredData()

  // FAQ 스키마 생성
  const faqSchema = generateFAQSchema(faqs)

  // 모든 스키마를 배열로 결합
  const schemas = [mainStructuredData, faqSchema]

  return (
    <>
      <StructuredData schema={schemas} />
      <h1 className="sr-only">Poromy - AI 자소서 프롬프트 아카이브 홈페이지</h1>
      {/* 홈페이지 상단 케러셀 */}
      <HomeCarousel />

      {/* 홈페이지  컨테이너 */}
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
