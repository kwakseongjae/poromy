import { NextRequest, NextResponse } from 'next/server'
import { insertJob, updateJob, deleteJob } from '@/lib/supabase-jobs'
import { createClient } from '@/lib/supabase-server'
import { revalidateTag, revalidatePath } from 'next/cache'
import type { Job } from '@/types/job'
import { AdminService } from '@/services/admin.service'
import { handleAdminApiError, AdminErrorHelpers } from '@/utils/admin-errors'

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

// 관리자 권한 확인 - AdminService 사용
async function checkAdminPermission() {
  try {
    const { user, isAdmin } = await AdminService.getCurrentAdminServer()
    return isAdmin
  } catch (error) {
    console.error('Error checking admin permission:', error)
    return false
  }
}

// POST: 채용공고 추가/업데이트
export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const adminCheck = await AdminService.requireAdmin(request)
    if (adminCheck.error) {
      return adminCheck.error
    }

    const body = await request.json()
    const { job, promptContent } = body

    if (!job) {
      throw AdminErrorHelpers.validationError('Job data is required')
    }

    // 새로운 job 추가 (id는 autoincrement)
    const result = await insertJob({ ...job, promptContent })

    if (!result) {
      throw AdminErrorHelpers.operationFailed('Failed to save job')
    }

    // 캐시 무효화 - 새로운 채용공고가 추가되었으므로 모든 관련 캐시 갱신
    await invalidateJobsCache(result.jobType, result.companyName)

    return NextResponse.json({
      message: 'Job saved successfully',
      job: result,
      cacheInvalidated: true,
    })
  } catch (error) {
    return handleAdminApiError(error)
  }
}

// DELETE: 채용공고 삭제
export async function DELETE(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const adminCheck = await AdminService.requireAdmin(request)
    if (adminCheck.error) {
      return adminCheck.error
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      throw AdminErrorHelpers.validationError('Job ID is required')
    }

    const jobId = parseInt(id, 10)
    if (isNaN(jobId)) {
      throw AdminErrorHelpers.validationError('Invalid job ID')
    }

    const success = await deleteJob(jobId)

    if (!success) {
      throw AdminErrorHelpers.operationFailed('Failed to delete job')
    }

    // 캐시 무효화 - 채용공고가 삭제되었으므로 모든 관련 캐시 갱신
    await invalidateJobsCache()

    return NextResponse.json({
      message: 'Job deleted successfully',
      cacheInvalidated: true,
    })
  } catch (error) {
    return handleAdminApiError(error)
  }
}
