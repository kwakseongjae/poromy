import { Metadata } from 'next'
import { jobs } from '@/constants/job.data'
import { decrypt, encrypt } from '@/utils/crypto'
import { notFound } from 'next/navigation'
import ClientRedirect from '@/components/ClientRedirect'

interface Props {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const resolvedSearchParams = await searchParams
    const decryptedId = decrypt(resolvedParams.id)
    const job = jobs.find((job) => job.id === decryptedId)

    if (!job) {
      return {
        title: '채용 공고를 찾을 수 없습니다 - Poromy',
        description: '요청하신 채용 공고를 찾을 수 없습니다.',
      }
    }

    const jobPostingSchema = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.jobTitle,
      hiringOrganization: {
        '@type': 'Organization',
        name: job.companyName,
        logo: job.logoUrl,
      },
      url: `https://poromy.ai.kr/position/${resolvedParams.id}`,
    }

    return {
      title: `${job.jobTitle} - ${job.companyName} 채용 공고 - Poromy`,
      description: `${job.companyName}의 ${job.jobTitle} 채용 공고입니다.`,
      openGraph: {
        title: `${job.jobTitle} - ${job.companyName} 채용 공고 - Poromy`,
        description: `${job.companyName}의 ${job.jobTitle} 채용 공고입니다.`,
        url: `https://poromy.ai.kr/position/${resolvedParams.id}`,
        siteName: 'Poromy',
        images: [
          {
            url: job.logoUrl,
            width: 1200,
            height: 630,
            alt: `${job.companyName} 로고`,
          },
        ],
        locale: 'ko_KR',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${job.jobTitle} - ${job.companyName} 채용 공고 - Poromy`,
        description: `${job.companyName}의 ${job.jobTitle} 채용 공고입니다.`,
        images: [job.logoUrl],
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

export default async function PositionPage({ params, searchParams }: Props) {
  try {
    const resolvedParams = await params
    const resolvedSearchParams = await searchParams
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
