import { Metadata } from 'next'
import { Suspense } from 'react'
import CompanyDetailContent from './CompanyDetailContent'
import { companies } from '@/constants/company.data'
import { encrypt } from '@/utils/crypto'
import { getAllKeywords } from '@/constants/seo-keywords'
import StructuredData from '@/components/common/StructuredData'
import {
  generateBreadcrumbSchema,
  generateArticleSchema,
} from '@/utils/structured-data'

interface Company {
  id: string
  name: string
  imageUrl: string
}

// 동적 metadata 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  // 기업 정보 조회
  const resolvedParams = await params
  const company = companies.find(
    (company: Company) => company.id === resolvedParams.id
  )

  const title = company
    ? `${company.name} 기업 분석 및 AI 자소서 프롬프트 - Poromy`
    : '기업 분석 및 GPT/Claude AI 자소서 프롬프트 - Poromy'
  const description =
    'ChatGPT, Claude 등 AI 모델을 활용한 기업별 맞춤형 자소서 프롬프트를 제공합니다. 기업 분석과 함께 AI 자기소개서 작성 가이드를 확인하세요.'
  const imageUrl =
    company?.imageUrl ||
    `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`

  return {
    title,
    description,
    keywords: getAllKeywords(),
    openGraph: {
      title,
      description,
      url: `https://poromy.ai.kr/company/${encrypt(resolvedParams.id)}`,
      siteName: 'Poromy',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${company?.name || '기업'} 분석 및 GPT/Claude AI 자소서 프롬프트`,
        },
      ],
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function CompanyDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const company = companies.find(
    (company: Company) => company.id === resolvedParams.id
  )

  // 빵 부스러기 스키마 생성
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://poromy.ai.kr' },
    { name: '기업별 프롬프트', url: 'https://poromy.ai.kr/company' },
    {
      name: company?.name || '기업 상세',
      url: `https://poromy.ai.kr/company/${encrypt(resolvedParams.id)}`,
    },
  ])

  // 기업 분석 아티클 스키마 생성
  const articleSchema = company
    ? generateArticleSchema({
        headline: `${company.name} 기업 분석 및 AI 자소서 프롬프트`,
        description: `${company.name}에 대한 상세 분석과 AI 기반 자기소개서 작성 프롬프트를 제공합니다.`,
        author: 'Poromy Team',
        datePublished: new Date().toISOString(),
        image: company.imageUrl,
        url: `https://poromy.ai.kr/company/${encrypt(resolvedParams.id)}`,
      })
    : null

  const schemas = [breadcrumbSchema, ...(articleSchema ? [articleSchema] : [])]

  return (
    <>
      <StructuredData schema={schemas} />
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          </div>
        }
      >
        <CompanyDetailContent />
      </Suspense>
    </>
  )
}
