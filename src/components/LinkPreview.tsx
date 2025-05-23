'use client'

import { useState, useEffect, useRef } from 'react'
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

// Client-side caching to prevent duplicate requests
const clientCache = new Map<string, Promise<LinkPreviewData | null>>()
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

const fetchWithCache = async (url: string): Promise<LinkPreviewData | null> => {
  const cacheKey = url.toLowerCase().trim()

  // Return cached promise if exists
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!
  }

  // Create new request promise
  const requestPromise = (async () => {
    try {
      const response = await fetch('/api/link-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
        // Add signal for request timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (!data.hasPreview) {
        return null
      }

      return data
    } catch (error) {
      console.error('Link preview fetch error:', error)
      return null
    }
  })()

  // Cache the promise
  clientCache.set(cacheKey, requestPromise)

  // Auto-cleanup cache after duration
  setTimeout(() => {
    clientCache.delete(cacheKey)
  }, CACHE_DURATION)

  return requestPromise
}

const LinkPreview = ({ url, className = '' }: LinkPreviewProps) => {
  const [preview, setPreview] = useState<LinkPreviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

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

  // Fetch preview data when visible
  useEffect(() => {
    if (!isVisible || !url) return

    let mounted = true

    const loadPreview = async () => {
      if (!mounted) return

      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()

      setLoading(true)
      setError(null)

      try {
        const data = await fetchWithCache(url)

        if (!mounted) return

        if (!data) {
          setError('No preview available')
          return
        }

        setPreview(data)
      } catch (err) {
        if (mounted && !abortControllerRef.current?.signal.aborted) {
          setError('Failed to load preview')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadPreview()

    return () => {
      mounted = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [url, isVisible])

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
            {error || 'Preview unavailable - Click to visit'}
          </div>
        </div>
      </a>
    )
  }

  // Full preview
  return (
    <a
      ref={containerRef as any}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} hover:shadow-md`}
      aria-label={`Visit link: ${preview.title || url}`}
    >
      <div className="flex flex-col sm:flex-row">
        {preview.images && preview.images.length > 0 && (
          <div className="relative h-32 w-full sm:h-auto sm:w-48">
            <Image
              src={getProxyImageUrl(preview.images[0])}
              alt={preview.title || 'Link preview image'}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 192px"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              onError={(e) => {
                // Hide image on error
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
        <div className="flex-1 p-4">
          {preview.title && (
            <h3 className="mb-1 line-clamp-2 text-base font-medium text-gray-900">
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
