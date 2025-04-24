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
  width?: number
  height?: number
}

const getProxyImageUrl = (originalUrl: string) => {
  return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`
}

const LinkPreviewThumbnail = ({
  url,
  className = '',
  width = 200,
  height = 120,
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

      if (!response.ok) {
        throw new Error('Failed to fetch link preview')
      }

      const data = await response.json()
      setPreview(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPreview()
  }, [url])

  if (loading) {
    return (
      <div
        className={`animate-pulse rounded-lg bg-gray-100 ${className}`}
        style={{ width, height }}
      />
    )
  }

  if (error || !preview?.images?.length) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-gray-100 ${className}`}
        style={{ width, height }}
      >
        <span className="text-xs text-gray-500">No preview available</span>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ width, height }}
    >
      <Image
        src={getProxyImageUrl(preview.images[0])}
        alt="Link thumbnail"
        fill
        className="object-cover"
        sizes={`${width}px`}
      />
    </div>
  )
}

export default LinkPreviewThumbnail
