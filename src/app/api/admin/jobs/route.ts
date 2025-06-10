import { NextRequest, NextResponse } from 'next/server'
import { insertJob, updateJob, deleteJob } from '@/lib/supabase-jobs'
import { createClient } from '@/lib/supabase-server'
import { revalidateTag, revalidatePath } from 'next/cache'
import type { Job } from '@/types/job'

// 캐시 무효화 함수
async function invalidateJobsCache(jobType?: string, companyName?: string) {
  try {
    // 기본 캐시 태그들 무효화
    revalidateTag('jobs')
    revalidateTag('jobs-all')
    revalidateTag('jobs-search')

    // 특정 타입 캐시 무효화
    if (jobType) {
      revalidateTag(`jobs-type-${jobType}`)
    }

    // 특정 회사 캐시 무효화
    if (companyName) {
      revalidateTag(`jobs-company-${companyName}`)
    }

    // 주요 페이지들 캐시 무효화
    revalidatePath('/')
    revalidatePath('/position')
    revalidatePath('/company')

    console.log('Cache invalidated for jobs')
  } catch (error) {
    console.error('Error invalidating cache:', error)
  }
}

// 관리자 권한 확인
async function checkAdminPermission() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return false
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return false
    }

    return profile.is_admin === true
  } catch (error) {
    console.error('Error checking admin permission:', error)
    return false
  }
}

// POST: 채용공고 추가/업데이트
export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const isAdmin = await checkAdminPermission()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { job, promptContent } = body

    if (!job) {
      return NextResponse.json(
        { error: 'Job data is required' },
        { status: 400 }
      )
    }

    // 새로운 job 추가 (id는 autoincrement)
    const result = await insertJob({ ...job, promptContent })

    if (!result) {
      return NextResponse.json({ error: 'Failed to save job' }, { status: 500 })
    }

    // 캐시 무효화 - 새로운 채용공고가 추가되었으므로 모든 관련 캐시 갱신
    await invalidateJobsCache(result.jobType, result.companyName)

    return NextResponse.json({
      message: 'Job saved successfully',
      job: result,
      cacheInvalidated: true,
    })
  } catch (error) {
    console.error('Error in POST /api/admin/jobs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: 채용공고 삭제
export async function DELETE(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const isAdmin = await checkAdminPermission()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    const jobId = parseInt(id, 10)
    if (isNaN(jobId)) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 })
    }

    const success = await deleteJob(jobId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete job' },
        { status: 500 }
      )
    }

    // 캐시 무효화 - 채용공고가 삭제되었으므로 모든 관련 캐시 갱신
    await invalidateJobsCache()

    return NextResponse.json({
      message: 'Job deleted successfully',
      cacheInvalidated: true,
    })
  } catch (error) {
    console.error('Error in DELETE /api/admin/jobs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
