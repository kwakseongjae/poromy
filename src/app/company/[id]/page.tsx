'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { decrypt } from '@/utils/crypto'
import { companies } from '@/constants/company.data'
import type { Company } from '@/types/company'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronIcon } from '@/assets'
import Script from 'next/script'

export default function CompanyDetail() {
  const params = useParams()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ChevronIcon className="mr-1 h-4 w-4 rotate-270" />
            홈으로 돌아가기
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg">
              {company.logoUrl && (
                <Image
                  src={company.logoUrl}
                  alt={`${company.name} 로고`}
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

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              회사 소개
            </h2>
            <p className="whitespace-pre-line text-gray-700">
              {company.description}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              AI 분석 프롬프트
            </h2>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-gray-700">
                {company.name}에 대한 AI 분석 프롬프트를 생성해 드립니다. 아래
                버튼을 클릭하여 맞춤형 프롬프트를 받아보세요.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="bg-primary hover:bg-primary-dark rounded-lg px-6 py-3 text-white shadow-sm transition-colors">
              AI 분석 프롬프트 생성하기
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
