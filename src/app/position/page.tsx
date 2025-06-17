import { Metadata } from 'next'
import { Suspense } from 'react'
import PositionContent from './PositionContent'

export const metadata: Metadata = {
  title: '채용 공고 분석 프롬프트 - Poromy',
  description:
    'ChatGPT, Claude 등 AI 모델을 활용한 채용 공고 분석을 위한 최고의 AI 프롬프트 아카이브. 맞춤형 자기소개서 작성과 기업 분석을 도와드립니다.',
  openGraph: {
    title: '채용 공고 분석 프롬프트 - Poromy',
    description:
      'ChatGPT, Claude 등 AI 모델을 활용한 채용 공고 분석을 위한 최고의 AI 프롬프트 아카이브',
    url: 'https://poromy.ai.kr/position',
    siteName: 'Poromy',
    images: [
      {
        url: `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
        width: 1200,
        height: 630,
        alt: 'Poromy - 채용 공고 분석 프롬프트',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '채용 공고 분석 프롬프트 - Poromy',
    description:
      'ChatGPT, Claude 등 AI 모델을 활용한 채용 공고 분석을 위한 최고의 AI 프롬프트 아카이브',
    images: [
      `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
    ],
  },
}

// 로딩 컴포넌트
function PositionLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
    </div>
  )
}

export default function PositionPage() {
  return (
    <Suspense fallback={<PositionLoadingFallback />}>
      <PositionContent />
    </Suspense>
  )
}
