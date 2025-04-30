'use client'

import Link from 'next/link'
import { Inquiry } from '@/types/inquiry'
import LinkPreviewThumbnail from '@/components/LinkPreviewThumbnail'

interface InquiryCardProps {
  inquiry: Inquiry
}

export default function InquiryCard({ inquiry }: InquiryCardProps) {
  // 날짜 포맷팅 함수 - 년월일만 표시
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  return (
    <Link href={`/inquiry/${inquiry.id}`}>
      <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* 문의 헤더 */}
        <div className="h-28 p-4">
          <div className="flex h-full">
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div className="flex items-start justify-between">
                <h3 className="group-hover:text-text-secondary line-clamp-2 max-w-full overflow-hidden text-lg font-medium transition-colors">
                  {inquiry.title}
                </h3>
                <span
                  className={`ml-2 flex flex-shrink-0 items-center justify-center rounded-full px-3 py-2 text-center text-xs leading-none whitespace-nowrap ${
                    inquiry.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {inquiry.status === 'pending' ? '대기중' : '답변완료'}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="whitespace-nowrap">
                  {formatDate(inquiry.created_at)}
                </span>
                <span className="mx-1">·</span>
                <span className="truncate">{inquiry.user?.nickname}</span>
              </div>
            </div>
            {inquiry.url && (
              <div className="ml-4 flex-shrink-0">
                <LinkPreviewThumbnail
                  url={inquiry.url}
                  className="h-20 w-30 rounded object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
