import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/navigation/Navbar'
import { CursorProvider } from '@/contexts/CursorContext'
import CustomCursor from '@/components/CustomCursor'
import { createClient } from '@/lib/supabase-server'
import SupabaseProvider from '@/contexts/SupabaseContext'
import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'
import { getAllKeywords } from '@/constants/seo-keywords'
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateSoftwareApplicationSchema,
  createJsonLdScript,
} from '@/utils/structured-data'
import { PreloadResources } from '@/components/common/PreloadResources'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: false,
}

export const metadata: Metadata = {
  // ============================================================================
  // 기본 메타데이터 (Basic Metadata)
  // ============================================================================
  metadataBase: new URL('https://poromy.ai.kr'),
  title: {
    default: 'Poromy - AI 채용공고 분석 프롬프트 아카이브',
    template: '%s | Poromy',
  },
  description:
    '채용공고와 기업분석을 위한 AI 프롬프트 아카이브. ChatGPT, Claude 등 다양한 AI 모델에 맞는 맞춤형 프롬프트를 제공합니다.',
  keywords: getAllKeywords(),

  // ============================================================================
  // 작성자/출판 정보 (Author & Publisher Info)
  // ============================================================================
  authors: [{ name: 'Poromy Team', url: 'https://poromy.ai.kr' }],
  creator: 'Poromy',
  publisher: 'Poromy',

  // ============================================================================
  // 웹 기술 설정 (Web Technology Settings)
  // ============================================================================
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // ============================================================================
  // URL 관련 설정 (URL & Canonicalization)
  // ============================================================================
  alternates: {
    canonical: 'https://poromy.ai.kr',
    languages: {
      'ko-KR': 'https://poromy.ai.kr',
    },
  },

  // ============================================================================
  // 소셜 미디어 메타데이터 (Social Media Metadata)
  // ============================================================================
  openGraph: {
    title: 'Poromy - AI 채용공고 분석 프롬프트 아카이브',
    description: '자기소개서, 이력서 작성을 위한 AI 프롬프트 아카이브',
    url: 'https://poromy.ai.kr',
    siteName: 'Poromy',
    images: [
      {
        url: `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
        width: 1200,
        height: 630,
        alt: 'Poromy - AI 프롬프트로 취업 준비를 스마트하게',
      },
      {
        url: `/images/og-image-square.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
        width: 1200,
        height: 1200,
        alt: 'Poromy - AI 프롬프트 아카이브',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Poromy - AI 프롬프트 아카이브',
    description: '채용 공고와 기업 분석을 위한 AI 프롬프트 아카이브',
    images: [
      `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
    ],
  },

  // ============================================================================
  // 검색엔진 설정 (Search Engine Settings)
  // ============================================================================
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ============================================================================
  // 사이트 인증 (Site Verification)
  // ============================================================================
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },

  // ============================================================================
  // 사이트 아이콘 (Site Icons)
  // ============================================================================
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },

  // ============================================================================
  // 카테고리/분류 (Category & Classification)
  // ============================================================================
  category: 'employment',
  classification: 'AI Tools, Employment, Career',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 구조화된 데이터 스키마 생성
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()
  const softwareApplicationSchema = generateSoftwareApplicationSchema()

  return (
    <html lang="ko">
      <head>
        {/* 중요 리소스 프리로드 */}
        <PreloadResources />

        {/* Naver 사이트 인증 */}
        <meta
          name="naver-site-verification"
          content={process.env.NEXT_PUBLIC_NAVER_VERIFICATION}
        />

        {/* RSS 피드 */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Poromy RSS"
          href="/rss"
        />

        {/* 구조화된 데이터 (JSON-LD) 추가 */}
        <script {...createJsonLdScript(organizationSchema)} />
        <script {...createJsonLdScript(websiteSchema)} />
        <script {...createJsonLdScript(softwareApplicationSchema)} />
      </head>
      <body>
        <SupabaseProvider initialSession={session}>
          <CursorProvider>
            <CustomCursor />
            <Navbar />
            <main>{children}</main>
          </CursorProvider>
        </SupabaseProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <NextGoogleAnalytics
            gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          />
        )}
      </body>
    </html>
  )
}
