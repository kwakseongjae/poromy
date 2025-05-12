import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navigation/Navbar'
import { CursorProvider } from '@/contexts/CursorContext'
import CustomCursor from '@/components/CustomCursor'
import { createClient } from '@/lib/supabase-server'
import SupabaseProvider from '@/contexts/SupabaseContext'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://poromy.ai.kr'),
  title: 'Poromy - AI 프롬프트 아카이브',
  description:
    '채용 공고와 기업 분석을 위한 AI 프롬프트 아카이브. 다양한 직무와 기업에 맞는 맞춤형 프롬프트를 제공합니다.',
  keywords:
    'AI 프롬프트, 채용 공고, 기업 분석, 취업 준비, 면접 준비, 자기소개서, 이력서',
  openGraph: {
    title: 'Poromy - AI 프롬프트 아카이브',
    description: '채용 공고와 기업 분석을 위한 AI 프롬프트 아카이브',
    url: 'https://poromy.ai.kr',
    siteName: 'Poromy',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
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
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
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

  return (
    <html lang="ko">
      <head>
        <meta
          name="naver-site-verification"
          content="9934f90db2f107b504163e05d916ab579541c6b0"
        />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
            `,
          }}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Poromy RSS"
          href="/rss"
        />
      </head>
      <body className={inter.className}>
        <SupabaseProvider initialSession={session}>
          <CursorProvider>
            <CustomCursor />
            <Navbar />
            <main>{children}</main>
          </CursorProvider>
        </SupabaseProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
