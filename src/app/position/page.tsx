import { Metadata } from 'next'
import { Suspense } from 'react'
import PositionContent from '../../components/position/PositionContent'

// Force dynamic rendering to avoid SSR issues with nuqs
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '채용공고별 AI 자소서 프롬프트',
  description:
    '기업별 채용공고에 맞는 자기소개서 작성 프롬프트. ChatGPT, Claude AI로 맞춤형 자소서를 작성하세요. 대기업, 스타트업, 공기업 채용 준비.',
  alternates: {
    canonical: 'https://poromy.ai.kr/position',
  },
  openGraph: {
    title: '채용공고별 AI 자소서 프롬프트 | Poromy',
    description:
      '기업별 채용공고에 맞는 자기소개서 작성 프롬프트. ChatGPT, Claude AI로 맞춤형 자소서를 작성하세요.',
    url: 'https://poromy.ai.kr/position',
    siteName: 'Poromy',
    images: [
      {
        url: `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
        width: 1200,
        height: 630,
        alt: 'Poromy - 채용공고별 AI 자소서 프롬프트',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '채용공고별 AI 자소서 프롬프트 | Poromy',
    description:
      '기업별 채용공고에 맞는 자기소개서 작성 프롬프트. ChatGPT, Claude AI로 맞춤형 자소서를 작성하세요.',
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
