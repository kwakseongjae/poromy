import Link from 'next/link'

type SectionHeaderProps = {
  title: string
  viewAllLink?: string
  viewAllText?: string
}

/**
 * Reusable section header component with optional "View All" link
 */
export const SectionHeader = ({
  title,
  viewAllLink,
  viewAllText = '전체 보기',
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">{title}</h2>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="text-text-secondary cursor-pointer text-sm font-semibold"
        >
          <span className="sr-only">{title} </span>
          {viewAllText}
        </Link>
      )}
    </div>
  )
}
