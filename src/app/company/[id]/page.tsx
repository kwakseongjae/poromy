import { Metadata } from 'next'
import { Suspense } from 'react'
import CompanyDetailContent from './CompanyDetailContent'
import { companies } from '@/constants/company.data'
import { encrypt } from '@/utils/crypto'

interface Company {
  id: string
  name: string
  imageUrl: string
}

// 동적 metadata 생성
export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  // 기업 정보 조회
  const company = companies.find((company: Company) => company.id === params.id)

  const title = company
    ? `${company.name} 기업 분석 및 AI 자소서 프롬프트 - Poromy`
    : '기업 분석 및 GPT/Claude AI 자소서 프롬프트 - Poromy'
  const description =
    'ChatGPT, Claude 등 AI 모델을 활용한 기업별 맞춤형 자소서 프롬프트를 제공합니다. 기업 분석과 함께 AI 자기소개서 작성 가이드를 확인하세요.'
  const imageUrl = company?.imageUrl || '/images/og-image.jpg'

  return {
    title,
    description,
    keywords:
      'AI 자소서, AI 자기소개서, GPT 프롬프트, Claude 프롬프트, ChatGPT 프롬프트, 기업 분석, 취업 준비, 면접 준비, 기업 정보, GPT 활용, Claude 활용',
    openGraph: {
      title,
      description,
      url: `https://poromy.ai.kr/company/${encrypt(params.id)}`,
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

export default function CompanyDetail() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      }
    >
      <CompanyDetailContent />
    </Suspense>
  )
}
