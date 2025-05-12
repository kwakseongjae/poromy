'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface LinkPreviewData {
  url: string
  images?: string[]
}

interface LinkPreviewThumbnailProps {
  url: string
  className?: string
}

const getProxyImageUrl = (originalUrl: string) => {
  return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`
}

const LinkPreviewThumbnail = ({
  url,
  className = '',
}: LinkPreviewThumbnailProps) => {
  const [preview, setPreview] = useState<LinkPreviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPreview = async () => {
    if (!url) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/link-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!data.hasPreview || !data.images?.length) {
        setError('No preview available')
        return
      }

      setPreview(data)
    } catch {
      setError('No preview available')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const loadPreview = async () => {
      if (!mounted) return
      await fetchPreview()
    }

    loadPreview()

    return () => {
      mounted = false
    }
  }, [url])

  if (loading) {
    return (
      <div
        className={`relative aspect-video animate-pulse rounded-lg bg-gray-100 ${className}`}
      />
    )
  }

  if (error || !preview?.images?.length) {
    return (
      <div
        className={`relative flex aspect-video items-center justify-center rounded-lg bg-gray-100 ${className}`}
      >
        <span className="text-xs text-gray-500">No preview available</span>
      </div>
    )
  }

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-lg ${className}`}
    >
      <Image
        src={getProxyImageUrl(preview.images[0])}
        alt="Link thumbnail"
        fill
        className="!h-full !w-full object-cover object-center"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        priority
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}

export default LinkPreviewThumbnail
