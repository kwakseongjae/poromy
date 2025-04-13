import { HomeContainer } from '@/components/home/HomeContainer'
import { Section } from '@/components/home/Section'
import JobList from '@/components/position/JobList'
import CompanyCarousel from '@/components/company/CompanyCarousel'
import { jobs } from '@/constants/job.data'
import { companies } from '@/constants/company.data'
import Script from 'next/script'
import InquiryList from '@/components/inquiry/InquiryList'
import { NotificationMessage } from '@/components/common/NotificationMessage'
import HomeCarousel from '@/components/home/HomeCarousel'

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Poromy - AI 프롬프트 아카이브',
  description: '채용 공고와 기업 분석을 위한 AI 프롬프트 아카이브',
  mainEntity: [
    {
      '@type': 'ItemList',
      name: '채용 공고 별 프롬프트',
      itemListElement: jobs.map((job, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'JobPosting',
          title: job.jobTitle,
          companyName: job.companyName,
          jobLocation:
            job.conditions.find(
              (c) =>
                c.includes('서울') ||
                c.includes('성남') ||
                c.includes('수원') ||
                c.includes('대전') ||
                c.includes('제주') ||
                c.includes('판교')
            ) || '미지정',
          employmentType:
            job.conditions.find(
              (c) => c.includes('신입') || c.includes('경력')
            ) || '미지정',
          educationRequirements:
            job.conditions.find(
              (c) =>
                c.includes('대졸') || c.includes('석사') || c.includes('박사')
            ) || '미지정',
          url: `/position/${job.id}`,
        },
      })),
    },
    {
      '@type': 'ItemList',
      name: '인기 기업 분석 프롬프트',
      itemListElement: companies.map((company, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Organization',
          name: company.name,
          description: company.description,
          url: `/company/${company.id}`,
        },
      })),
    },
  ],
}

export default function Home() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeCarousel />
      <HomeContainer>
        <Section title="채용 공고 별 프롬프트" viewAllLink="/position">
          <JobList />
        </Section>

        <Section title="인기 기업 분석 프롬프트">
          <CompanyCarousel />
        </Section>

        <Section title="프롬프트 분석 요청 게시판">
          <NotificationMessage message="요청하신 공고 및 기업 프롬프트 분석은 24시간 이내에 검토 후 답변해 드립니다." />
          <InquiryList />
        </Section>
      </HomeContainer>
    </>
  )
}
