import { NextRequest, NextResponse } from 'next/server'
import { getJobById } from '@/lib/supabase-jobs'

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

    return NextResponse.json({ job: jobWithPrompt })
  } catch (error) {
    console.error('Error in /api/jobs/[id]:', error)
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 })
  }
}
