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
}

// Simple in-memory cache (consider using Redis in production)
const cache = new Map<
  string,
  { data: LinkPreviewResponse; timestamp: number }
>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour cache

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
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
      timeout: 3000,
    })

    // Store in cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching link preview:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
