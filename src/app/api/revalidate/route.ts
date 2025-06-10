import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 필요한 정보 추출
    const body = await request.json()
    const { tags, paths, secret } = body

    // API 보안을 위한 secret key 검증
    const serverSecret = process.env.REVALIDATION_SECRET
    const publicSecret = process.env.NEXT_PUBLIC_REVALIDATION_SECRET

    if (secret !== serverSecret && secret !== publicSecret) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    // Authorization 헤더가 있는 경우에만 사용자 권한 확인 (클라이언트 사이드 호출)
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')

      try {
        const supabase = createBrowserSupabaseClient()
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(token)

        if (error || !user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        if (!profile?.is_admin) {
          return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          )
        }
      } catch (authError) {
        console.error('Auth error:', authError)
        return NextResponse.json(
          { error: 'Auth validation failed' },
          { status: 401 }
        )
      }
    }
    // Authorization 헤더가 없는 경우 서버 사이드 호출로 간주하고 secret만으로 인증

    // 태그 기반 캐시 무효화
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag)
        console.log(`Cache tag revalidated: ${tag}`)
      }
    }

    // 경로 기반 캐시 무효화
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path)
        console.log(`Path revalidated: ${path}`)
      }
    }

    return NextResponse.json({
      revalidated: true,
      revalidatedTags: tags || [],
      revalidatedPaths: paths || [],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 }
    )
  }
}
