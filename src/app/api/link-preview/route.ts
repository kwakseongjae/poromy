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

// Simple in-memory cache (consider using Redis in production)
const cache = new Map<
  string,
  { data: LinkPreviewResponse; timestamp: number }
>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour cache
const TIMEOUT = 5000 // 5 seconds timeout

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({
        url,
        hasPreview: false,
        error: 'URL is required',
      })
    }

    // Check cache
    const cacheKey = url
    const cachedItem = cache.get(cacheKey)

    if (cachedItem && cachedItem.timestamp > Date.now() - CACHE_TTL) {
      return NextResponse.json(cachedItem.data)
    }

    // Fetch data if not in cache
    const data = await getLinkPreview(url, {
      headers: {
        'user-agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
      },
      timeout: TIMEOUT,
    })

    // Validate data
    if (!data || !data.url) {
      return NextResponse.json({
        url,
        hasPreview: false,
        error: 'No preview available',
      })
    }

    // Add hasPreview flag
    const responseData = {
      ...data,
      hasPreview: true,
    }

    // Store in cache
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now(),
    })

    return NextResponse.json(responseData)
  } catch (error) {
    // Log error for debugging but return generic message
    console.error('Error fetching link preview:', error)

    // Return a generic error response with 200 status
    return NextResponse.json({
      url: request.url,
      hasPreview: false,
      error: 'No preview available',
    })
  }
}
