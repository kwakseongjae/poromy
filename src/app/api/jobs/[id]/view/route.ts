import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const jobId = parseInt(id, 10)

    if (isNaN(jobId)) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 })
    }

    // Use admin client to bypass RLS for view counting
    const supabase = createAdminClient()

    // First get current view count, then increment
    const { data: currentJob, error: fetchError } = await supabase
      .from('jobs')
      .select('views')
      .eq('id', jobId)
      .single()

    if (fetchError) {
      console.error('Error fetching current views:', fetchError)
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    const newViewCount = (currentJob.views || 0) + 1

    // Update with new view count
    const { data, error } = await supabase
      .from('jobs')
      .update({ views: newViewCount })
      .eq('id', jobId)
      .select('views')
      .single()

    if (error) {
      console.error('Error incrementing view count:', error)
      return NextResponse.json(
        { error: 'Failed to increment view count' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, views: data.views },
      {
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    )
  } catch (error) {
    console.error('Error in /api/jobs/[id]/view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}