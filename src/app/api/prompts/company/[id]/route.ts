import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id.toLowerCase()

    const filePath = path.join(
      process.cwd(),
      'public',
      'prompts',
      'company',
      `${id}.md`
    )

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      return Response.json({ prompt: content })
    }

    const defaultPath = path.join(
      process.cwd(),
      'public',
      'prompts',
      'company',
      'default.md'
    )

    if (fs.existsSync(defaultPath)) {
      const content = fs.readFileSync(defaultPath, 'utf-8')
      return Response.json({ prompt: content })
    }

    return Response.json({ error: 'Prompt not found' }, { status: 404 })
  } catch (error) {
    console.error('Error reading prompt file:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
