'use client'

import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { InquiryCarousel } from '@/components/inquiry/InquiryCarousel'
import { Inquiry } from '@/types/inquiry'
import { useEffect, useState } from 'react'
import { InquiryProcessModal } from '@/components/inquiry/InquiryProcessModal'
import Link from 'next/link'
import { EditIcon } from '@/assets'

export const HomeInquiry = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInquiries = async () => {
      const supabase = createBrowserSupabaseClient()

      const { data, error } = await supabase
        .from('inquiries')
        .select(
          `
          id,
          title,
          content,
          url,
          status,
          created_at,
          user_id,
          profiles!user_id (
            id,
            email,
            nickname
          )
        `
        )
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('문의 목록 조회 오류:', error)
        return
      }

      const typedInquiries = data.map((inquiry) => ({
        ...inquiry,
        user: inquiry.profiles || null,
        answers: [],
      })) as Inquiry[]

      setInquiries(typedInquiries)
      setIsLoading(false)
    }

    fetchInquiries()
  }, [])

  return (
    <>
      <div className="flex items-start gap-2 text-gray-500">
        <InquiryProcessModal />

        <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
          <p className="whitespace-pre-line">
            요청하신 공고 및 기업 프롬프트 분석은{' '}
            <span className="text-text-secondary">24시간 이내</span>에 검토 후
            답변해 드립니다.
            <br />
            <span className="text-text-secondary">30초</span>만 투자하여 맞춤
            공고 프롬프트를 받아보세요!
          </p>
          <div className="flex justify-end">
            <Link
              href="/inquiry/new"
              className="flex items-center rounded-md bg-[#3182f6] px-4 py-2 text-white transition-colors hover:bg-blue-600 hover:text-gray-200"
            >
              <EditIcon className="mr-1 h-5 w-5" />
              분석요청 등록
            </Link>
          </div>
        </div>
      </div>
      <InquiryCarousel inquiries={inquiries} isLoading={isLoading} />
    </>
  )
}
