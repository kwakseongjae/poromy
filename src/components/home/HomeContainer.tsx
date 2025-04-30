import { ReactNode } from 'react'

type HomeContainerProps = {
  children: ReactNode
}

/**
 * Container component for the home page
 * Provides consistent padding and layout for the home page content
 */
export const HomeContainer = ({ children }: HomeContainerProps) => {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <div className="flex flex-col gap-12">{children}</div>
    </div>
  )
}
