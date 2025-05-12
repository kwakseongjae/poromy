'use client'

import { useState, useEffect } from 'react'
import { companies } from '@/constants/company.data'
import SearchBar from '@/components/common/SearchBar'
import Image from 'next/image'
import Link from 'next/link'
import { encrypt } from '@/utils/crypto'
import { useSearchParams } from 'next/navigation'

type CompanyType = 'all' | 'large' | 'medium' | 'small' | 'startup'

export default function CompanyPage() {
  const searchParams = useSearchParams()
  const [companyType, setCompanyType] = useState<CompanyType>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const searchQuery = searchParams.get('query') || ''

  // Filter companies based on search query and company type
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = searchQuery
      ? company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true

    if (companyType === 'all') return matchesSearch
    return matchesSearch && company.type === companyType
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Section */}
      <section className="mb-6">
        <h1 className="mb-6 text-center text-3xl font-bold">
          원하는 기업 정보를 찾아보세요
        </h1>
        <div className="mx-auto flex justify-center">
          <SearchBar
            placeholder="기업명, 산업, 키워드 등을 검색해보세요"
            size="large"
          />
        </div>
      </section>

      {/* Filter Section */}
      <section className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setCompanyType('all')}
            className={`rounded-full px-4 py-2 text-sm ${
              companyType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
            aria-label="모든 기업 보기"
            tabIndex={0}
          >
            전체
          </button>
          <button
            onClick={() => setCompanyType('large')}
            className={`rounded-full px-4 py-2 text-sm ${
              companyType === 'large'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
            aria-label="대기업 보기"
            tabIndex={0}
          >
            대기업
          </button>
          <button
            onClick={() => setCompanyType('medium')}
            className={`rounded-full px-4 py-2 text-sm ${
              companyType === 'medium'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
            aria-label="중견기업 보기"
            tabIndex={0}
          >
            중견기업
          </button>
          <button
            onClick={() => setCompanyType('small')}
            className={`rounded-full px-4 py-2 text-sm ${
              companyType === 'small'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
            aria-label="중소기업 보기"
            tabIndex={0}
          >
            중소기업
          </button>
          <button
            onClick={() => setCompanyType('startup')}
            className={`rounded-full px-4 py-2 text-sm ${
              companyType === 'startup'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
            aria-label="스타트업 보기"
            tabIndex={0}
          >
            스타트업
          </button>
        </div>
      </section>

      {/* Company Grid */}
      <section className="mb-8">
        {currentCompanies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-gray-600">
              {searchQuery
                ? `'${searchQuery}'에 대한 검색 결과가 없습니다.`
                : '아직 등록된 기업이 없습니다.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {currentCompanies.map((company) => {
              const encryptedId = encrypt(company.id)
              return (
                <Link
                  key={company.id}
                  href={`/company/${encryptedId}`}
                  className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:border-blue-500 hover:shadow-lg"
                >
                  <div className="flex h-full flex-col p-4">
                    <div className="mb-4 flex items-center">
                      <div className="relative h-16 w-16 overflow-hidden">
                        {company.imageUrl ? (
                          <Image
                            src={company.imageUrl}
                            alt={`${company.name} 로고`}
                            fill
                            className="rounded-lg object-contain"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100">
                            <span className="text-gray-400">로고 없음</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h2 className="group-hover:text-text-secondary text-lg font-semibold text-gray-900">
                          {company.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {company.thumbnailDescription}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {company.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="flex justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  currentPage === page
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-200 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
