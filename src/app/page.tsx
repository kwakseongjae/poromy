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

/**
 * 캐시된 데이터를 위한 글로벌 변수 (서버 컴포넌트에서 사용)
 * Next.js에서 같은 렌더링 사이클에서 중복 요청 방지
 */
let cachedJobsData: { jobs: any[]; totalCount: number } | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 1000 * 60 * 5 // 5분 캐시

/**
 * 최적화된 데이터 페칭 함수
 * - 최신 채용공고 10개만 가져와서 메타데이터와 구조화 데이터 생성
 * - 전체 개수는 별도로 가져와서 성능 최적화
 */
async function getOptimizedHomeData() {
  const now = Date.now()

  // 캐시가 유효한 경우 캐시된 데이터 반환
  if (cachedJobsData && now - cacheTimestamp < CACHE_DURATION) {
    return cachedJobsData
  }

  try {
    // 병렬로 최신 데이터와 총 개수 가져오기 (전체 데이터 대신 최적화)
    const [latestJobs, totalCount] = await Promise.all([
      getLatestJobs(10), // 메인 페이지에 필요한 최소한의 데이터만
      getJobsCount(), // 전체 개수만 가져와서 성능 향상
    ])

    const optimizedData = {
      jobs: latestJobs,
      totalCount,
    }

    // 캐시 업데이트
    cachedJobsData = optimizedData
    cacheTimestamp = now

    return optimizedData
  } catch (error) {
    console.error('Error fetching optimized home data:', error)
    return { jobs: [], totalCount: 0 }
  }
}

// 최적화된 메타데이터 생성 - 최소한의 데이터만 사용
export async function generateMetadata(): Promise<Metadata> {
  try {
    // 최적화된 데이터 가져오기 (전체 대신 최소한만)
    const { jobs, totalCount } = await getOptimizedHomeData()

    // 최신 5개 채용공고 정보
    const companyNames = jobs
      .slice(0, 5)
      .map((job) => job.companyName)
      .join(', ')

    // 기본 title과 description (정적)
    const staticTitle = 'Poromy - GPT/Claude AI 자소서 프롬프트 아카이브'
    const staticDescription =
      'ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성, 기업 분석, 채용 공고 분석을 위한 최고의 AI 프롬프트 아카이브. 맞춤형 자기소개서 작성과 기업 분석을 도와드립니다.'

    // 동적 키워드 생성 (최소한의 데이터 기반)
    const jobTypes = [...new Set(jobs.map((job) => job.jobType))]
    const dynamicKeywords = [
      ...getAllKeywords(),
      ...companyNames.split(', ').filter((name) => name), // 빈 문자열 제거
      ...jobTypes,
      '최신 채용공고',
      `${totalCount}개 기업`,
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
            alt: `Poromy - ${totalCount}개 기업 AI 자소서 프롬프트 아카이브`,
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

    // 에러 시 정적 메타데이터 반환 (동적 요소 제거)
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

// 최적화된 구조화 데이터 생성 - 캐시된 데이터 재사용
async function generateMainStructuredData() {
  try {
    // 이미 캐시된 데이터 재사용 (중복 DB 호출 방지)
    const { jobs, totalCount } = await getOptimizedHomeData()

    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Poromy - ${totalCount}개 기업 AI 자소서 프롬프트 아카이브`,
      description: `${totalCount}개의 최신 채용공고 분석 프롬프트 제공. ChatGPT, Claude 등 AI 모델을 활용한 자소서 작성 지원`,
      mainEntity: [
        {
          '@type': 'ItemList',
          name: '채용 공고 별 AI 프롬프트',
          description: `${totalCount}개 기업의 채용 공고 분석 프롬프트 모음`,
          numberOfItems: totalCount,
          itemListElement: jobs.map((job, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Article',
              name: `${job.companyName} ${job.jobTitle} 프롬프트`,
              description: job.positionDescription.slice(0, 150), // 길이 제한으로 성능 최적화
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
    // 에러 시 정적 구조화 데이터 반환
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
  // 서버에서 구조화된 데이터 생성 (캐시된 데이터 활용)
  const mainStructuredData = await generateMainStructuredData()

  // FAQ 스키마 생성 (정적 데이터이므로 빠름)
  const faqSchema = generateFAQSchema(faqs)

  // 모든 스키마를 배열로 결합
  const schemas = [mainStructuredData, faqSchema]

  return (
    <>
      <StructuredData schema={schemas} />
      <h1 className="sr-only">Poromy - AI 자소서 프롬프트 아카이브 홈페이지</h1>
      {/* 홈페이지 상단 케러셀 */}
      <HomeCarousel />

      {/* 홈페이지 컨테이너 */}
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
