import { NextResponse } from 'next/server'
import { getLinkPreview } from 'link-preview-js'

interface LinkPreviewResponse {
  url: string
  title?: string
  description?: string
  images?: string[]
  mediaType?: string
  contentType?: string
  favicons?: string[]
  hasPreview?: boolean
}

// Enhanced in-memory cache with LRU behavior
class LRUCache<T> {
  private cache = new Map<
    string,
    { data: T; timestamp: number; accessCount: number }
  >()
  private maxSize: number
  private ttl: number

  constructor(maxSize = 200, ttl = 1000 * 60 * 60) {
    // 1 hour TTL, 200 items max
    this.maxSize = maxSize
    this.ttl = ttl
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    // Check if expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    // Update access count and timestamp
    item.accessCount++
    this.cache.delete(key)
    this.cache.set(key, item) // Move to end (most recently used)

    return item.data
  }

  set(key: string, data: T): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 1,
    })
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    return item !== null
  }
}

// Global cache and request deduplication
const cache = new LRUCache<LinkPreviewResponse>()
const pendingRequests = new Map<string, Promise<LinkPreviewResponse>>()

const TIMEOUT = 8000 // 8 seconds timeout
const RETRY_ATTEMPTS = 2

// Utility function to extract domain for rate limiting
const getDomain = (url: string): string => {
  try {
    return new URL(url).hostname
  } catch {
    return 'unknown'
  }
}

// Simple rate limiting per domain
const rateLimiter = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX = 20 // 20 requests per minute per domain (increased from 10)

const isRateLimited = (domain: string): boolean => {
  const now = Date.now()
  const limit = rateLimiter.get(domain)

  if (!limit || now > limit.resetTime) {
    rateLimiter.set(domain, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (limit.count >= RATE_LIMIT_MAX) {
    console.log(`Rate limited domain: ${domain}, count: ${limit.count}`) // 디버깅용 로그
    return true
  }

  limit.count++
  return false
}

const fetchLinkPreviewWithRetry = async (
  url: string,
  attempts = 0
): Promise<LinkPreviewResponse> => {
  try {
    console.log(`Fetching link preview (attempt ${attempts + 1}):`, url) // 디버깅용 로그

    const data = await getLinkPreview(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (compatible; LinkPreviewBot/1.0; +https://poromy.ai)',
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.5',
        'accept-encoding': 'gzip, deflate',
        'cache-control': 'no-cache',
      },
      timeout: TIMEOUT,
      followRedirects: 'follow', // 리디렉션 자동 처리 (manual에서 변경)
    })

    console.log('Link preview raw data:', data) // 디버깅용 로그

    if (!data || !data.url) {
      console.log('No data or URL in response for:', url)
      return {
        url,
        hasPreview: false,
        title: 'No preview available',
      }
    }

    // 이미지 검증을 더 관대하게 변경
    const validImages =
      (data as any).images?.filter((img: string) => {
        try {
          const imageUrl = new URL(img)
          return imageUrl.protocol === 'http:' || imageUrl.protocol === 'https:'
        } catch {
          return false
        }
      }) || []

    const result = {
      url: data.url,
      title: (data as any).title || undefined,
      description: (data as any).description || undefined,
      images: validImages.slice(0, 3), // Limit to 3 images max
      mediaType: data.mediaType,
      contentType: data.contentType,
      favicons: data.favicons || [],
      hasPreview: true,
    }

    console.log('Processed link preview result:', result) // 디버깅용 로그
    return result
  } catch (error) {
    console.error(
      `Link preview attempt ${attempts + 1} failed for ${url}:`,
      error
    )

    // Retry logic
    if (attempts < RETRY_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempts + 1))) // Exponential backoff
      return fetchLinkPreviewWithRetry(url, attempts + 1)
    }

    return {
      url,
      hasPreview: false,
      title: 'Preview unavailable',
      description: 'Unable to load preview for this link',
    }
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        {
          url: '',
          hasPreview: false,
          error: 'URL is required',
        },
        { status: 400 }
      )
    }

    // Validate URL format
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return NextResponse.json(
        {
          url,
          hasPreview: false,
          error: 'Invalid URL format',
        },
        { status: 400 }
      )
    }

    // Block potentially dangerous protocols
    if (!['http:', 'https:'].includes(validUrl.protocol)) {
      return NextResponse.json(
        {
          url,
          hasPreview: false,
          error: 'Unsupported protocol',
        },
        { status: 400 }
      )
    }

    const cacheKey = url.toLowerCase().trim()
    const domain = getDomain(url)

    // Check rate limiting
    if (isRateLimited(domain)) {
      return NextResponse.json(
        {
          url,
          hasPreview: false,
          error: 'Rate limit exceeded',
        },
        { status: 429 }
      )
    }

    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      })
    }

    // Check if request is already pending (deduplication)
    if (pendingRequests.has(cacheKey)) {
      const pendingData = await pendingRequests.get(cacheKey)!
      return NextResponse.json(pendingData, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      })
    }

    // Create new request
    const requestPromise = fetchLinkPreviewWithRetry(url)
    pendingRequests.set(cacheKey, requestPromise)

    try {
      const responseData = await requestPromise

      // Store in cache
      cache.set(cacheKey, responseData)

      return NextResponse.json(responseData, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      })
    } finally {
      // Clean up pending request
      pendingRequests.delete(cacheKey)
    }
  } catch (error) {
    console.error('Unexpected error in link preview:', error)

    return NextResponse.json(
      {
        url: '',
        hasPreview: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// Add OPTIONS method for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
