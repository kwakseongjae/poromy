'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { getProxyImageUrl, getMinimalBlurDataURL } from '@/utils/image'
import { useLinkPreview } from '@/lib/react-query/hooks'

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

// Note: Caching is now handled by React Query

const LinkPreview = ({ url, className = '' }: LinkPreviewProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use React Query hook for link preview data
  const {
    data: preview,
    isLoading: loading,
    error,
  } = useLinkPreview(url, isVisible && !!url)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '200px', // Load when element is 200px away from viewport
        threshold: 0.1,
      }
    )

    const currentRef = containerRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const baseClasses = `block overflow-hidden rounded-lg border border-gray-200 transition-all hover:border-gray-300 ${className}`

  // Show skeleton while not visible
  if (!isVisible) {
    return (
      <div
        ref={containerRef}
        className={`${baseClasses} h-32 animate-pulse bg-gray-100`}
      />
    )
  }

  // Loading state
  if (loading) {
    return (
      <div ref={containerRef} className={`${baseClasses} bg-gray-100`}>
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-32 w-full animate-pulse bg-gray-200 sm:h-auto sm:w-48" />
          <div className="flex-1 p-4">
            <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="mb-2 h-3 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  // Error state - show basic link
  if (error || !preview) {
    return (
      <a
        ref={containerRef as any}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} hover:shadow-md`}
        aria-label={`Visit link: ${url}`}
      >
        <div className="p-4">
          <div className="truncate text-sm text-gray-600">{url}</div>
          <div className="mt-1 text-sm text-gray-500">
            {error?.message || error?.toString() || 'Preview unavailable - Click to visit'}
          </div>
        </div>
      </a>
    )
  }

  const previewData = preview?.preview || preview

  // Full preview
  return (
    <a
      ref={containerRef as any}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} hover:shadow-md`}
      aria-label={`Visit link: ${previewData?.title || url}`}
    >
      <div className="flex flex-col sm:flex-row">
        {previewData?.images && previewData.images.length > 0 && (
          <div className="relative h-32 w-full sm:h-auto sm:w-48">
            <Image
              src={getProxyImageUrl(previewData.images[0])}
              alt={previewData.title || 'Link preview image'}
              fill
              className="object-cover"
              sizes="192px"
              loading="lazy"
              placeholder="blur"
              blurDataURL={getMinimalBlurDataURL()}
              quality={60}
              onError={(e) => {
                // Hide image on error
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
        <div className="flex-1 p-4">
          {previewData.title && (
            <h3 className="mb-1 line-clamp-2 text-base font-medium text-gray-900">
              {previewData.title}
            </h3>
          )}
          {previewData.description && (
            <p className="mb-2 line-clamp-2 text-sm text-gray-600">
              {previewData.description}
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
