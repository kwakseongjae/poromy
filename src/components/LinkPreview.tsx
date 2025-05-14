'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getProxyImageUrl } from '@/utils/image'

interface LinkPreviewData {
  url: string
  title?: string
  description?: string
  images?: string[]
  mediaType?: string
  contentType?: string
  favicons?: string[]
}

interface LinkPreviewProps {
  url: string
  className?: string
}

const LinkPreview = ({ url, className = '' }: LinkPreviewProps) => {
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

      if (!data.hasPreview) {
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
      <div className={`animate-pulse rounded-lg bg-gray-100 p-4 ${className}`}>
        <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
      </div>
    )
  }

  if (error) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 ${className}`}
      >
        <div className="truncate text-sm text-gray-500">{url}</div>
        <div className="mt-1 text-sm text-red-500">Preview unavailable</div>
      </a>
    )
  }

  if (!preview) return null

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block overflow-hidden rounded-lg border border-gray-200 transition-all hover:border-gray-300 hover:shadow-md ${className}`}
    >
      <div className="flex flex-col sm:flex-row">
        {preview.images && preview.images.length > 0 && (
          <div className="relative h-32 w-full sm:h-auto sm:w-48">
            <Image
              src={getProxyImageUrl(preview.images[0])}
              alt={preview.title || 'Link preview'}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 192px"
            />
          </div>
        )}
        <div className="flex-1 p-4">
          {preview.title && (
            <h3 className="mb-1 line-clamp-1 text-base font-medium text-gray-900">
              {preview.title}
            </h3>
          )}
          {preview.description && (
            <p className="mb-2 line-clamp-2 text-sm text-gray-600">
              {preview.description}
            </p>
          )}
          <div className="truncate text-xs text-gray-500">
            {new URL(url).hostname}
          </div>
        </div>
      </div>
    </a>
  )
}

export default LinkPreview
