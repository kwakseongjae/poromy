'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { pageview } from '@/lib/gtag'

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url =
        searchParams.size > 0
          ? `${pathname}?${searchParams.toString()}`
          : pathname
      pageview(url)
    }
  }, [pathname, searchParams])

  return null
}
