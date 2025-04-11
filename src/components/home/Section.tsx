import { ReactNode } from 'react'
import { SectionHeader } from './SectionHeader'

type SectionProps = {
  title: string
  viewAllLink?: string
  viewAllText?: string
  children: ReactNode
}

/**
 * Reusable section component with header and content
 */
export const Section = ({
  title,
  viewAllLink,
  viewAllText,
  children,
}: SectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title={title}
        viewAllLink={viewAllLink}
        viewAllText={viewAllText}
      />
      {children}
    </div>
  )
}
