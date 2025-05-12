import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id
    const filePath = path.join(
      process.cwd(),
      'public',
      'prompts',
      'position',
      `${id}.md`
    )

    // Check if position-specific prompt exists
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      return NextResponse.json({ prompt: content })
    }

    return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
  } catch (error) {
    console.error('Error reading prompt file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
