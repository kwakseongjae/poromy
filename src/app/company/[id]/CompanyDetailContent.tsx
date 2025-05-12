'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { decrypt } from '@/utils/crypto'
import { companies } from '@/constants/company.data'
import type { Company } from '@/types/company'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { BuildingsIcon, PersonIcon, SalesIcon } from '@/assets'
import PromptContainer from '@/components/common/PromptContainer'

export default function CompanyDetailContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'intro' | 'prompt'>(
    (searchParams.get('tab') as 'intro' | 'prompt') || 'intro'
  )
  const [promptContent, setPromptContent] = useState<string>('')
  const [isPromptLoading, setIsPromptLoading] = useState(false)

  useEffect(() => {
    const currentTab = searchParams.get('tab') as 'intro' | 'prompt'
    if (!currentTab || !['intro', 'prompt'].includes(currentTab)) {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set('tab', 'intro')
      router.replace(`?${newParams.toString()}`)
    }
  }, [router, searchParams])

  const handleTabChange = (tab: 'intro' | 'prompt') => {
    setActiveTab(tab)
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('tab', tab)
    router.replace(`?${newParams.toString()}`)
  }

  useEffect(() => {
    try {
      const encryptedId = params.id as string
      const decryptedId = decrypt(encryptedId)
      const foundCompany = companies.find((c) => c.id === decryptedId)

      if (foundCompany) {
        setCompany(foundCompany)
        // 프롬프트 데이터 프리패칭
        if (foundCompany.prompt) {
          setIsPromptLoading(true)
          foundCompany.prompt().then((prompt) => {
            setPromptContent(prompt)
            setIsPromptLoading(false)
          })
        }
      } else {
        setError('회사를 찾을 수 없습니다.')
      }
    } catch (err) {
      setError('잘못된 URL입니다.')
      console.error('Error decrypting company ID:', err)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  // 구조화된 데이터 생성
  const structuredData = company
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: company.name,
        description: company.description,
        industry: company.industry,
        employeeCount: company.employeeCount,
        foundingDate: company.founded,
        location: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: company.headquarters,
          },
        },
        url: `https://poromy.ai.kr/company/${company.id}`,
        logo: company.logoUrl,
        sameAs: company.website,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.5',
          reviewCount: '100',
        },
        offers: {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI 자소서 프롬프트',
            description:
              'ChatGPT, Claude 등 AI 모델을 활용한 맞춤형 자소서 작성 프롬프트',
          },
        },
      }
    : null

  if (loading) {
    return (
      <div className="bg-background flex min-h-[calc(100vh-4rem)] flex-col">
        {/* Company Introduction Section Skeleton */}
        <div className="w-full bg-white">
          <div className="mx-auto w-4/5 pt-8">
            <div className="mb-4 flex items-center">
              <div className="relative h-16 w-16 animate-pulse overflow-hidden rounded-lg bg-gray-200" />
              <div className="ml-4">
                <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-16 animate-pulse rounded-sm bg-gray-200"
                />
              ))}
            </div>
            <div className="flex gap-8 pt-8">
              <div className="h-10 w-16 animate-pulse rounded bg-gray-200" />
              <div className="h-10 w-16 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
        <div className="w-full border-t border-gray-300"></div>
        {/* Content Section Skeleton */}
        <div className="mx-auto w-4/5 py-6">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex flex-col lg:hidden">
              {/* Company information section skeleton */}
              <div className="flex flex-col gap-8 px-8 py-10">
                <div className="flex flex-col gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 animate-pulse rounded bg-gray-200" />
                        <div className="mt-2 h-4 w-16 animate-pulse rounded bg-gray-200" />
                      </div>
                      <div className="pt-3">
                        <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full border-t border-gray-200"></div>
              {/* Company detail information section skeleton */}
              <div className="flex w-full flex-col px-8 py-10">
                <div className="grid grid-cols-1 gap-y-4">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                      <div className="ml-4 h-4 w-48 animate-pulse rounded bg-gray-200" />
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium text-gray-700">
          {error || '회사를 찾을 수 없습니다.'}
        </p>
        <Link href="/" className="text-primary hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <>
      {structuredData && (
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <div className="bg-background flex min-h-[calc(100vh-4rem)] flex-col">
        {/* Company Introduction Section */}
        <div className="w-full bg-white">
          <div className="mx-auto w-4/5 pt-8">
            <div className="mb-4 flex items-center">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                {company.imageUrl ? (
                  <Image
                    src={company.imageUrl}
                    alt={`${company.name} 이미지`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 px-1">
                    <span className="text-xs text-gray-500">
                      No preview available
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {company.name}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {company.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm bg-gray-100 px-2 py-1 text-sm text-gray-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex gap-8 pt-8">
              <button
                onClick={() => handleTabChange('intro')}
                className={`cursor-pointer border-b-2 px-4 py-2 text-lg transition-colors ${
                  activeTab === 'intro'
                    ? 'border-black font-bold'
                    : 'border-transparent'
                }`}
                aria-label="회사 소개 탭"
              >
                소개
              </button>
              <button
                onClick={() => handleTabChange('prompt')}
                className={`cursor-pointer border-b-2 px-4 py-2 text-lg transition-colors ${
                  activeTab === 'prompt'
                    ? 'border-black font-bold'
                    : 'border-transparent'
                }`}
                aria-label="프롬프트 탭"
              >
                프롬프트
              </button>
            </div>
          </div>
        </div>
        <div className="w-full border-t border-gray-300"></div>
        {/* Content Section */}
        <div className="mx-auto w-4/5 py-6">
          <div className="rounded-lg border border-gray-200 bg-white">
            {activeTab === 'intro' && (
              <>
                {/* Mobile Layout */}
                <div className="flex flex-col lg:hidden">
                  {/* Company information section */}
                  <div className="flex flex-col gap-8 px-8 py-10">
                    <div className="flex flex-col gap-8">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <BuildingsIcon className="h-12 w-12" fill="#9A9999" />
                          <p className="text-text-disabled mt-2 text-xs">
                            기업규모
                          </p>
                        </div>
                        <p className="pt-3 text-xl font-semibold whitespace-nowrap">
                          {company.size}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <PersonIcon className="h-12 w-12" stroke="#9A9999" />
                          <p className="text-text-disabled mt-2 text-xs">
                            사원수
                          </p>
                        </div>
                        <div className="flex flex-col items-center pt-3">
                          <p className="text-xl font-semibold whitespace-nowrap">
                            {company.employeeCount}
                          </p>
                          <p className="text-text-disabled text-xs">
                            {company.employeeCountDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <SalesIcon className="h-12 w-12" fill="#9A9999" />
                          <p className="text-text-disabled mt-2 text-xs">
                            매출액
                          </p>
                        </div>
                        <div className="flex flex-col items-center pt-3">
                          <p className="text-xl font-semibold whitespace-nowrap">
                            {company.revenue}
                          </p>
                          <p className="text-text-disabled text-xs">
                            {company.revenueDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full border-t border-gray-200"></div>
                  {/* Company detail information section */}
                  <div className="flex w-full flex-col px-8 py-10">
                    <div className="grid grid-cols-1 gap-y-4">
                      <div className="flex items-center">
                        <span className="text-text-disabled w-24 text-sm whitespace-nowrap">
                          홈페이지
                        </span>
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                          tabIndex={0}
                        >
                          {company.website.replace('https://', '')}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <span className="text-text-disabled w-24 text-sm whitespace-nowrap">
                          산업
                        </span>
                        <span>{company.industry}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-text-disabled w-24 text-sm whitespace-nowrap">
                          신입사원 초임
                        </span>
                        <span>{company.entryLevelSalary}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-text-disabled w-24 text-sm whitespace-nowrap">
                          대표자명
                        </span>
                        <span>{company.ceo}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-text-disabled w-24 text-sm whitespace-nowrap">
                          본사
                        </span>
                        <span>{company.headquarters}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-text-disabled w-24 text-sm whitespace-nowrap">
                          법인시장구분
                        </span>
                        <span>{company.marketType}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-text-disabled w-24 text-sm whitespace-nowrap">
                          설립
                        </span>
                        <span>{company.founded}</span>
                      </div>
                    </div>
                    <p className="pt-5 text-sm">{company.description}</p>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex">
                  {/* Company information section */}
                  <div className="flex flex-col gap-8 px-8 py-12">
                    <div className="flex gap-12">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <BuildingsIcon className="h-12 w-12" fill="#9A9999" />
                          <p className="text-text-disabled mt-2 text-xs">
                            기업규모
                          </p>
                        </div>
                        <p className="pt-3 text-xl font-semibold whitespace-nowrap">
                          {company.size}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <PersonIcon className="h-12 w-12" stroke="#9A9999" />
                          <p className="text-text-disabled mt-2 text-xs">
                            사원수
                          </p>
                        </div>
                        <div className="flex flex-col items-center pt-3">
                          <p className="text-xl font-semibold whitespace-nowrap">
                            {company.employeeCount}
                          </p>
                          <p className="text-text-disabled text-xs">
                            {company.employeeCountDate}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <SalesIcon className="h-12 w-12" fill="#9A9999" />
                        <p className="text-text-disabled mt-2 text-xs">
                          매출액
                        </p>
                      </div>
                      <div className="flex flex-col items-center pt-3">
                        <p className="text-xl font-semibold whitespace-nowrap">
                          {company.revenue}
                        </p>
                        <p className="text-text-disabled text-xs">
                          {company.revenueDate}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Company detail information section */}
                  <div className="flex w-full flex-col border-l border-gray-200 px-8 py-6">
                    {/* Single row items */}
                    <div className="mb-4 flex items-center">
                      <span className="text-text-disabled w-24 text-sm whitespace-nowrap">
                        홈페이지
                      </span>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                        tabIndex={0}
                      >
                        {company.website.replace('https://', '')}
                      </a>
                    </div>
                    <div className="mb-4 flex items-center">
                      <span className="text-text-disabled w-24 text-sm whitespace-nowrap">
                        산업
                      </span>
                      <span>{company.industry}</span>
                    </div>
                    <div className="mb-4 flex items-center">
                      <span className="text-text-disabled w-24 text-sm whitespace-nowrap">
                        신입사원 초임
                      </span>
                      <span>{company.entryLevelSalary}</span>
                    </div>
                    {/* Other information - 2 column grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div className="flex items-center">
                        <span className="text-text-disabled w-24 text-sm whitespace-nowrap">
                          대표자명
                        </span>
                        <span>{company.ceo}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-text-disabled w-12 text-sm whitespace-nowrap">
                          본사
                        </span>
                        <span>{company.headquarters}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-text-disabled w-24 text-sm whitespace-nowrap">
                          법인시장구분
                        </span>
                        <span>{company.marketType}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-text-disabled w-12 text-sm whitespace-nowrap">
                          설립
                        </span>
                        <span>{company.founded}</span>
                      </div>
                    </div>
                    <p className="py-5 text-sm">{company.description}</p>
                  </div>
                </div>
              </>
            )}
            {activeTab === 'prompt' && (
              <div className="p-6">
                {isPromptLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                  </div>
                ) : (
                  <PromptContainer
                    type="company"
                    title={`${company.name} 프롬프트`}
                    description={`${company.name}의 채용 공고에 대한 AI 프롬프트입니다. 아래 버튼을 클릭하여 프롬프트를 복사하세요.`}
                    prompt={promptContent}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
