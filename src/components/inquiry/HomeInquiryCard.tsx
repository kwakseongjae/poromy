import Link from 'next/link'
import { Inquiry } from '@/types/inquiry'
import { formatDate } from '@/lib/utils'
import LinkPreviewThumbnail from '@/components/LinkPreviewThumbnail'

interface HomeInquiryCardProps {
  inquiry: Inquiry
}

export const HomeInquiryCard = ({ inquiry }: HomeInquiryCardProps) => {
  return (
    <Link
      href={`/inquiry/${inquiry.id}`}
      className="group hover:border-primary block h-full overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
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
