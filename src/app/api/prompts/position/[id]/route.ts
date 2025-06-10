import { NextResponse } from 'next/server'
import { getJobPrompt } from '@/lib/supabase-jobs'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id
    const prompt = await getJobPrompt(Number(id))

    return NextResponse.json({ prompt })
  } catch (error) {
    console.error('Error reading prompt:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
