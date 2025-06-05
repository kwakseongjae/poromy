import Link from 'next/link'
import { Inquiry } from '@/types/inquiry'
import { formatDate } from '@/lib/utils'
import LinkPreviewThumbnail from '@/components/LinkPreviewThumbnail'

interface HomeInquiryCardProps {
  inquiry: Inquiry
}

export const HomeInquiryCard = ({ inquiry }: HomeInquiryCardProps) => {
  // 상태에 따른 태그 정보
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          text: '대기중',
          className:
            'bg-yellow-100 text-yellow-800 flex flex-shrink-0 items-center justify-center rounded-full px-3 py-2 text-center text-xs leading-none whitespace-nowrap',
        }
      case 'answered':
        return {
          text: '답변완료',
          className:
            'bg-green-100 text-green-800 flex flex-shrink-0 items-center justify-center rounded-full px-3 py-2 text-center text-xs leading-none whitespace-nowrap',
        }
      default:
        return null
    }
  }

  const statusTag = getStatusTag(inquiry.status)

  return (
    <Link
      href={`/inquiry/${inquiry.id}`}
      className="group hover:border-primary block h-full overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {/* 상태 태그 - 우측 상단 */}
        {statusTag && (
          <div
            className={`absolute top-2 right-2 z-10 rounded-full px-2 py-1 text-xs font-medium ${statusTag.className}`}
          >
            {statusTag.text}
          </div>
        )}

        {inquiry.url ? (
          <div className="absolute inset-0">
            <LinkPreviewThumbnail
              url={inquiry.url}
              className="h-full w-full transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">이미지 없음</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 h-14 overflow-hidden text-lg font-semibold text-gray-900">
          {inquiry.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="whitespace-nowrap">
            {formatDate(inquiry.created_at)}
          </span>
          <span className="inline-block max-w-[120px] truncate">
            {inquiry.user?.nickname || '익명'}
          </span>
        </div>
      </div>
    </Link>
  )
}
