import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navigation/Navbar'

export const metadata: Metadata = {
  title: 'Poromy',
  description: 'Poromy Front-end Application',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
