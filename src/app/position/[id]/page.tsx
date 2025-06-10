import { Metadata } from 'next'
import { decrypt, encrypt } from '@/utils/crypto'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

import { getAllKeywords } from '@/constants/seo-keywords'
import DeviceAwarePositionView from '@/components/DeviceAwarePositionView'
import { isMobileDevice } from '@/utils/device'
import StructuredData from '@/components/common/StructuredData'
import {
  generateJobPostingSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
} from '@/utils/structured-data'

interface Props {
  params: Promise<{ id: string }>
}

// Helper function to fetch job data
async function fetchJob(id: string) {
  try {
    const jobId = parseInt(id, 10)
    if (isNaN(jobId)) {
      return null
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/${jobId}`,
      {
        cache: 'force-cache',
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.job
  } catch (error) {
    console.error('Error fetching job:', error)
    return null
  }
}

// Helper function to fetch all jobs for static params
async function fetchAllJobs() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs`,
      {
        cache: 'force-cache',
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.jobs || []
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const decryptedId = decrypt(resolvedParams.id)
    const job = await fetchJob(decryptedId)

    if (!job) {
      return {
        title: '채용 공고를 찾을 수 없습니다 - Poromy',
        description: '요청하신 채용 공고를 찾을 수 없습니다.',
      }
    }

    const title = `${job.companyName} 채용 - ${job.jobTitle} | Poromy`
    const description = `${job.companyName}의 ${job.jobTitle} 채용 공고 분석과 맞춤형 AI 자소서 프롬프트를 제공합니다. ${job.qualifications.join(', ')} ${job.preferredQualifications.join(', ')} 자격요건에 맞는 최적화된 자기소개서 작성 가이드를 확인하세요.`

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
            url:
              job.logoUrl ||
              `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
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
        images: [
          job.logoUrl ||
            `/images/og-image.jpg?v=${process.env.NEXT_PUBLIC_OG_IMAGE_VERSION}`,
        ],
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
  // In development or if API is not available, return empty array to allow dynamic generation
  if (
    process.env.NODE_ENV === 'development' ||
    !process.env.NEXT_PUBLIC_APP_URL
  ) {
    return []
  }

  try {
    const jobs = await fetchAllJobs()
    return jobs.map((job: any) => ({
      id: encrypt(job.id),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function PositionPage({ params }: Props) {
  try {
    const resolvedParams = await params
    const decryptedId = decrypt(resolvedParams.id)
    const job = await fetchJob(decryptedId)

    if (!job) notFound()

    // 서버에서 User-Agent 확인
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const isMobileUA = isMobileDevice(userAgent)

    // 구조화된 데이터 스키마 생성
    const jobPostingSchema = generateJobPostingSchema({
      title: job.jobTitle,
      company: job.companyName,
      location:
        job.conditions.find(
          (c: string) =>
            c.includes('서울') ||
            c.includes('성남') ||
            c.includes('수원') ||
            c.includes('대전') ||
            c.includes('제주') ||
            c.includes('판교')
        ) || '미지정',
      description: `${job.companyName}의 ${job.jobTitle} 채용 공고입니다. 필요 자격: ${job.qualifications.join(', ')} 우대사항: ${job.preferredQualifications.join(', ')}`,
      datePosted: new Date().toISOString(),
      validThrough: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      employmentType:
        job.conditions.find(
          (c: string) => c.includes('신입') || c.includes('경력')
        ) || 'FULL_TIME',
    })

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://poromy.ai.kr' },
      { name: '채용공고 프롬프트', url: 'https://poromy.ai.kr/position' },
      {
        name: `${job.companyName} ${job.jobTitle}`,
        url: `https://poromy.ai.kr/position/${resolvedParams.id}`,
      },
    ])

    const articleSchema = generateArticleSchema({
      headline: `${job.companyName} ${job.jobTitle} 채용공고 분석`,
      description: `${job.companyName}의 ${job.jobTitle} 포지션에 대한 상세 분석과 AI 기반 자기소개서 작성 가이드`,
      author: 'Poromy Team',
      datePublished: new Date().toISOString(),
      image: job.logoUrl,
      url: `https://poromy.ai.kr/position/${resolvedParams.id}`,
    })

    const schemas = [jobPostingSchema, breadcrumbSchema, articleSchema]

    return (
      <>
        <StructuredData schema={schemas} />
        <DeviceAwarePositionView
          redirectTo={`/position?id=${resolvedParams.id}`}
          isMobileUA={isMobileUA}
        />
      </>
    )
  } catch (error) {
    notFound()
  }
}
