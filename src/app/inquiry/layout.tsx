import { Metadata } from 'next'
import { getAllKeywords } from '@/constants/seo-keywords'

export const metadata: Metadata = {
  title: 'AI 취업 질문답변 커뮤니티',
  description:
    '취업 준비생을 위한 AI 활용 Q&A. ChatGPT, Claude로 자기소개서 작성하는 방법, 면접 준비 팁, 기업 분석 노하우를 공유합니다.',
  keywords: getAllKeywords(),
  alternates: {
    canonical: 'https://poromy.ai.kr/inquiry',
  },
  openGraph: {
    title: 'AI 취업 질문답변 커뮤니티 | Poromy',
    description:
      '취업 준비생을 위한 AI 활용 Q&A. ChatGPT, Claude로 자기소개서 작성하는 방법, 면접 준비 팁을 공유합니다.',
    url: 'https://poromy.ai.kr/inquiry',
    siteName: 'Poromy',
    images: [
      {
        url: `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
        width: 1200,
        height: 630,
        alt: 'Poromy - AI 취업 질문답변 커뮤니티',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 취업 질문답변 커뮤니티 | Poromy',
    description:
      '취업 준비생을 위한 AI 활용 Q&A. ChatGPT, Claude로 자기소개서 작성하는 방법, 면접 준비 팁을 공유합니다.',
    images: [
      `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
    ],
  },
}

export default function InquiryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}