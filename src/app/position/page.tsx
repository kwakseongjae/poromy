import { Metadata } from 'next'
import { Suspense } from 'react'
import PositionContent from './PositionContent'

export const metadata: Metadata = {
  title: '채용 공고별 GPT/Claude AI 자소서 프롬프트 - Poromy',
  description:
    'ChatGPT, Claude 등 AI 모델을 활용한 채용 공고별 맞춤형 자소서 프롬프트를 제공합니다. 신입/경력, 직무별 맞춤형 자기소개서 작성 가이드를 확인하세요.',
  keywords:
    'AI 자소서, AI 자기소개서, GPT 프롬프트, Claude 프롬프트, ChatGPT 프롬프트, 채용 공고, 취업 준비, 면접 준비, 신입 채용, 경력 채용, 직무별 자소서, GPT 활용, Claude 활용',
  openGraph: {
    title: '채용 공고별 GPT/Claude AI 자소서 프롬프트 - Poromy',
    description:
      'ChatGPT, Claude 등 AI 모델을 활용한 채용 공고별 맞춤형 자소서 프롬프트를 제공합니다.',
    url: 'https://poromy.ai.kr/position',
    siteName: 'Poromy',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '채용 공고별 GPT/Claude AI 자소서 프롬프트',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '채용 공고별 GPT/Claude AI 자소서 프롬프트 - Poromy',
    description:
      'ChatGPT, Claude 등 AI 모델을 활용한 채용 공고별 맞춤형 자소서 프롬프트를 제공합니다.',
    images: ['/images/og-image.jpg'],
  },
}

export default function PositionDetail() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      }
    >
      <PositionContent />
    </Suspense>
  )
}
