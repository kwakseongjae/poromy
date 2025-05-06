import { Metadata } from 'next'
import PositionContent from './PositionContent'
import { jobs } from '@/constants/job.data'

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
        url: '/images/og-image.jpg',
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
    images: ['/images/og-image.jpg'],
  },
}

export default function PositionPage() {
  return <PositionContent />
}
