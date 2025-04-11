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
    <div className="flex justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="text-text-secondary cursor-pointer text-sm font-semibold"
        >
          {viewAllText}
        </Link>
      )}
    </div>
  )
}
