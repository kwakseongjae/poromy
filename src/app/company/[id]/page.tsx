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

export default function CompanyDetail() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'intro' | 'prompt'>(
    (searchParams.get('tab') as 'intro' | 'prompt') || 'intro'
  )

  useEffect(() => {
    if (!searchParams.get('tab')) {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set('tab', 'intro')
      router.push(`?${newParams.toString()}`)
    }
  }, [router, searchParams])

  const handleTabChange = (tab: 'intro' | 'prompt') => {
    setActiveTab(tab)
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('tab', tab)
    router.push(`?${newParams.toString()}`)
  }

  useEffect(() => {
    try {
      const encryptedId = params.id as string
      const decryptedId = decrypt(encryptedId)
      const foundCompany = companies.find((c) => c.id === decryptedId)

      if (foundCompany) {
        setCompany(foundCompany)
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
        url: window.location.href,
      }
    : null

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
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
        <div className="bg-white px-32 pt-8">
          <div className="mb-4 flex items-center">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg">
              {company.imageUrl && (
                <Image
                  src={company.imageUrl}
                  alt={`${company.name} 이미지`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              )}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {company.name}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {['#혁신', '#기술', '#미래', '#성장', '#파트너'].map((keyword) => (
              <span
                key={keyword}
                className="rounded-sm bg-gray-100 px-2 py-1 text-sm text-gray-500"
              >
                {keyword}
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
        <div className="w-full border-t border-gray-300"></div>
        {/* Content Section */}
        <div className="px-32 py-6">
          <div className="rounded-lg border border-gray-200 bg-white py-4">
            {activeTab === 'intro' && (
              <div className="flex min-h-64">
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
                        대기업
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
                          32,390명
                        </p>
                        <p className="text-text-disabled text-xs">2024.12</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <SalesIcon className="h-12 w-12" fill="#9A9999" />
                      <p className="text-text-disabled mt-2 text-xs">매출액</p>
                    </div>
                    <div className="flex flex-col items-center pt-3">
                      <p className="text-xl font-semibold whitespace-nowrap">
                        55조 7,363억
                      </p>
                      <p className="text-text-disabled text-xs">2024.12</p>
                    </div>
                  </div>
                </div>
                {/* Company detail information section */}
                <div className="flex w-full flex-col border-l border-gray-200 px-12 py-6">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-text-disabled text-sm">
                        홈페이지
                      </span>
                      <a
                        href="https://www.skhynix.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                        tabIndex={0}
                      >
                        www.skhynix.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-disabled text-sm">산업</span>
                      <span>반도체/전자기기 제조업</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-disabled text-sm">
                        대표자명
                      </span>
                      <span>곽노정</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-disabled text-sm">본사</span>
                      <span>경기도 이천시</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-disabled text-sm">
                        법인시장구분
                      </span>
                      <span>코스피</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-disabled text-sm">설립</span>
                      <span>1949</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-disabled text-sm">
                        연봉정보
                      </span>
                      <span>3,047만원 ~ 1.3억원</span>
                    </div>
                  </div>
                  <p className="py-5 text-sm">
                    SK하이닉스는 반도체 전문기업으로 반도체, 컴퓨터, 통신기기
                    제조 등의 사업을 영위하고 있습니다. 특히 1999년 LG반도체와의
                    합병을 통하여 세계 최대의 DRAM 생산능력을 확보하였으며, R&D
                    분야에서도 세계 최고 수준의 경쟁력을 보유하고 있습니다.
                  </p>
                </div>
              </div>
            )}
            {activeTab === 'prompt' && <></>}
          </div>
        </div>
      </div>
    </>
  )
}
