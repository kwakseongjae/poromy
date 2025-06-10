import { NextRequest, NextResponse } from 'next/server'
import { getJobById } from '@/lib/supabase-jobs'

// 캐싱 비활성화
export const revalidate = 0
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const jobId = parseInt(id, 10)

    if (isNaN(jobId)) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 })
    }

    const job = await getJobById(jobId)

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Get prompt content
    const promptContent = await job.prompt()

    // Return job data with prompt content included
    const jobWithPrompt = {
      ...job,
      prompt: promptContent,
    }

    const response = NextResponse.json({ job: jobWithPrompt })

    // 캐싱 완전 비활성화
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    )
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Error in /api/jobs/[id]:', error)
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 })
  }
}
