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
    <div className="px-12 py-10">
      <div className="flex flex-col gap-12">{children}</div>
    </div>
  )
}
