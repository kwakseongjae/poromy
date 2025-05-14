import { Metadata } from 'next'
import { jobs } from '@/constants/job.data'
import { decrypt, encrypt } from '@/utils/crypto'
import { notFound } from 'next/navigation'
import ClientRedirect from '@/components/ClientRedirect'
import { getAllKeywords } from '@/constants/seo-keywords'

interface Props {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const decryptedId = decrypt(resolvedParams.id)
    const job = jobs.find((job) => job.id === decryptedId)

    if (!job) {
      return {
        title: '채용 공고를 찾을 수 없습니다 - Poromy',
        description: '요청하신 채용 공고를 찾을 수 없습니다.',
      }
    }

    const title = `${job.jobTitle} - ${job.companyName} 채용 공고 분석 및 AI 자소서 프롬프트 - Poromy`
    const description = `${job.companyName}의 ${job.jobTitle} 채용 공고 분석과 맞춤형 AI 자소서 프롬프트를 제공합니다. ${job.qualifications.join(', ')} ${job.preferredQualifications.join(', ')} 자격요건에 맞는 최적화된 자기소개서 작성 가이드를 확인하세요.`

    const jobPostingSchema = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.jobTitle,
      description: `${job.companyName}의 ${job.jobTitle} 채용 공고입니다. ${job.qualifications.join(' ')} ${job.preferredQualifications.join(' ')}`,
      datePosted: new Date().toISOString(),
      hiringOrganization: {
        '@type': 'Organization',
        name: job.companyName,
        logo: job.logoUrl,
        sameAs: job.url,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality:
            job.conditions.find(
              (c) =>
                c.includes('서울') ||
                c.includes('성남') ||
                c.includes('수원') ||
                c.includes('대전') ||
                c.includes('제주') ||
                c.includes('판교')
            ) || '미지정',
        },
      },
      employmentType:
        job.conditions.find((c) => c.includes('신입') || c.includes('경력')) ||
        '미지정',
      educationRequirements:
        job.conditions.find(
          (c) => c.includes('대졸') || c.includes('석사') || c.includes('박사')
        ) || '미지정',
      url: `https://poromy.ai.kr/position/${resolvedParams.id}`,
      validThrough: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 30 days from now
    }

    return {
      title,
      description,
      keywords: getAllKeywords(),
      alternates: {
        canonical: `/position/${resolvedParams.id}`,
      },
      openGraph: {
        title,
        description,
        url: `https://poromy.ai.kr/position/${resolvedParams.id}`,
        siteName: 'Poromy',
        images: [
          {
            url: job.logoUrl || '/images/og-image.jpg',
            width: 1200,
            height: 630,
            alt: `${job.companyName} ${job.jobTitle} 채용공고 분석 및 AI 자소서 프롬프트`,
          },
        ],
        locale: 'ko_KR',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [job.logoUrl || '/images/og-image.jpg'],
      },
      other: {
        'application/ld+json': JSON.stringify(jobPostingSchema),
      },
    }
  } catch (error) {
    return {
      title: '잘못된 URL - Poromy',
      description: '잘못된 URL입니다.',
    }
  }
}

export async function generateStaticParams() {
  return jobs.map((job) => ({
    id: encrypt(job.id),
  }))
}

export default async function PositionPage({ params }: Props) {
  try {
    const resolvedParams = await params
    const decryptedId = decrypt(resolvedParams.id)
    const job = jobs.find((job) => job.id === decryptedId)

    if (!job) {
      notFound()
    }

    return <ClientRedirect to={`/position?id=${resolvedParams.id}`} />
  } catch (error) {
    notFound()
  }
}
