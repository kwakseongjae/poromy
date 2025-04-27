import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return new NextResponse('Image URL is required', { status: 400 })
  }

  try {
    const response = await fetch(imageUrl)

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', {
        status: response.status,
      })
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    return new NextResponse('Error proxying image', { status: 500 })
  }
}
