'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { getProxyImageUrl, getMinimalBlurDataURL } from '@/utils/image'

interface LinkPreviewData {
  url: string
  images?: string[]
}

interface LinkPreviewThumbnailProps {
  url: string
  className?: string
}

const requestCache = new Map<string, Promise<LinkPreviewData | null>>()
const CACHE_DURATION = 1000 * 60 * 10 // 10분

const fetchLinkPreview = async (
  url: string
): Promise<LinkPreviewData | null> => {
  const cacheKey = url.toLowerCase().trim()

  // 캐시된 요청이 있으면 반환
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!
  }

  // 새로운 요청 생성
  const requestPromise = (async () => {
    try {
      const response = await fetch('/api/link-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        console.error(
          'Link preview API error:',
          response.status,
          response.statusText
        )
        return null
      }

      const data = await response.json()

      if (!data.hasPreview) {
        return null
      }

      // 이미지가 없어도 미리보기 데이터가 있으면 반환 (이미지 요구사항 완화)
      return data
    } catch (error) {
      console.error('Link preview fetch error:', error)
      return null
    }
  })()

  // 캐시에 저장
  requestCache.set(cacheKey, requestPromise)

  // 캐시 정리
  setTimeout(() => {
    requestCache.delete(cacheKey)
  }, CACHE_DURATION)

  return requestPromise
}

const LinkPreviewThumbnail = ({
  url,
  className = '',
}: LinkPreviewThumbnailProps) => {
  const [preview, setPreview] = useState<LinkPreviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer - 더 빠른 로딩을 위해 설정 조정
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
        rootMargin: '200px', // 더 일찍 로드
        threshold: 0.1,
      }
    )

    const currentRef = imgRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  // 데이터 페칭
  useEffect(() => {
    if (!isVisible || !url) return

    let mounted = true

    const loadPreview = async () => {
      if (!mounted) return

      setLoading(true)
      setError(null)

      try {
        const data = await fetchLinkPreview(url)

        if (!mounted) return

        if (!data) {
          setError('No preview available')
          return
        }

        setPreview(data)
      } catch (err) {
        console.error('Preview load error:', err)
        if (mounted) {
          setError('No preview available')
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
    }
  }, [url, isVisible])

  const containerClasses = `relative aspect-video overflow-hidden rounded-lg ${className}`

  if (!isVisible) {
    return <div ref={imgRef} className={`${containerClasses} bg-gray-100`} />
  }

  if (loading) {
    return (
      <div
        ref={imgRef}
        className={`${containerClasses} animate-pulse bg-gray-100`}
      />
    )
  }

  // 이미지가 없어도 미리보기가 가능하면 기본 아이콘 표시 (에러 조건 완화)
  if (error || !preview) {
    return (
      <div
        ref={imgRef}
        className={`${containerClasses} flex items-center justify-center bg-gray-100`}
      >
        <span className="text-xs text-gray-500">No preview available</span>
      </div>
    )
  }

  // 이미지가 있으면 표시, 없으면 기본 링크 아이콘 표시
  if (preview.images && preview.images.length > 0) {
    return (
      <div ref={imgRef} className={containerClasses}>
        <Image
          src={getProxyImageUrl(preview.images[0])}
          alt="Link thumbnail"
          fill
          className="!h-full !w-full object-cover object-center"
          sizes="120px"
          style={{ objectFit: 'cover' }}
          loading="lazy"
          placeholder="blur"
          blurDataURL={getMinimalBlurDataURL()}
          quality={50}
          onError={() => {
            // 이미지 로드 실패 시 에러 상태로 변경
            setError('Image load failed')
          }}
        />
      </div>
    )
  }

  // 이미지가 없어도 미리보기 데이터가 있으면 링크 아이콘 표시
  return (
    <div
      ref={imgRef}
      className={`${containerClasses} flex items-center justify-center bg-gray-50`}
    >
      <svg
        className="h-6 w-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    </div>
  )
}

export default LinkPreviewThumbnail
