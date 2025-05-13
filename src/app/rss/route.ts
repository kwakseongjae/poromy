import { Feed } from 'feed'
import { companies } from '@/constants/company.data'
import { encrypt } from '@/utils/crypto'

export const revalidate = 3600 // 1시간마다 재생성

export async function GET() {
  const siteUrl = 'https://poromy.ai.kr'

  const feed = new Feed({
    title: 'Poromy - AI 기반 채용 플랫폼',
    description:
      'AI 기반 채용 플랫폼 Poromy의 최신 채용 정보와 기업 정보를 제공합니다.',
    id: siteUrl,
    link: siteUrl,
    language: 'ko',
    image: `${siteUrl}/og-image.jpg`,
    favicon: `${siteUrl}/favicon.svg`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Poromy`,
    updated: new Date(),
    feedLinks: {
      rss2: `${siteUrl}/rss`,
    },
    author: {
      name: 'Poromy',
      email: 'poromy.contact@gmail.com',
      link: siteUrl,
    },
  })

  // 기업 정보 추가
  companies.forEach((company) => {
    const encryptedId = encrypt(company.id)
    const companyUrl = `${siteUrl}/company/${encryptedId}`

    feed.addItem({
      title: company.name,
      id: companyUrl,
      link: companyUrl,
      description: company.description,
      content: `
        <h2>${company.name}</h2>
        <p>${company.description}</p>
        <h3>주요 특징:</h3>
        <ul>
          ${company.tags.map((tag) => `<li>${tag}</li>`).join('')}
        </ul>
      `,
      date: new Date(),
      image: company.hasLogo
        ? new URL(company.imageUrl, siteUrl).toString()
        : undefined,
    })
  })

  const rss = feed.rss2()

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
