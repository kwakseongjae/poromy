import { Metadata } from 'next'
import { getAllKeywords } from '@/constants/seo-keywords'

export const metadata: Metadata = {
  title: '기업별 AI 자기소개서 프롬프트',
  description:
    '대기업, 중견기업, 스타트업별 맞춤형 자기소개서 작성 프롬프트. ChatGPT, Claude AI로 기업 문화에 맞는 자소서를 작성하세요.',
  keywords: getAllKeywords(),
  alternates: {
    canonical: 'https://poromy.ai.kr/company',
  },
  openGraph: {
    title: '기업별 AI 자기소개서 프롬프트 | Poromy',
    description:
      '대기업, 중견기업, 스타트업별 맞춤형 자기소개서 작성 프롬프트. ChatGPT, Claude AI로 기업 문화에 맞는 자소서를 작성하세요.',
    url: 'https://poromy.ai.kr/company',
    siteName: 'Poromy',
    images: [
      {
        url: `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
        width: 1200,
        height: 630,
        alt: 'Poromy - 기업별 AI 자기소개서 프롬프트',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '기업별 AI 자기소개서 프롬프트 | Poromy',
    description:
      '대기업, 중견기업, 스타트업별 맞춤형 자기소개서 작성 프롬프트. ChatGPT, Claude AI로 기업 문화에 맞는 자소서를 작성하세요.',
    images: [
      `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
    ],
  },
}

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}