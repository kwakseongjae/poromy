'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ClientRedirectProps {
  to: string
}

export default function ClientRedirect({ to }: ClientRedirectProps) {
  const router = useRouter()

  useEffect(() => {
    router.push(to)
  }, [router, to])

  return null
}
