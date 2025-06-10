import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import {
  createClient as createServerClient,
  createAdminClient,
} from '@/lib/supabase-server'
import type { Job, JobType } from '@/types/job'

// Supabase에서 가져온 job 데이터 타입
interface SupabaseJob {
  id: number
  company_name: string
  job_title: string
  conditions: string[]
  job_type: JobType
  position_description: string
  main_task: string
  qualifications: string[]
  preferred_qualifications: string[]
  logo_url?: string
  url?: string
  prompt_content?: string
  uploaded_at: string
  deadline: string
  created_at: string
  updated_at: string
}

// 적절한 Supabase 클라이언트를 가져오는 헬퍼 함수
const getSupabaseClient = async () => {
  // 브라우저 환경에서는 브라우저 클라이언트 사용
  if (typeof window !== 'undefined') {
    return createBrowserSupabaseClient()
  }

  // 서버 환경에서는 서버 클라이언트 사용
  return await createServerClient()
}

// Admin 클라이언트가 필요한 경우 (서버에서만 사용)
const getAdminClient = () => {
  return createAdminClient()
}

// Supabase 데이터를 Job 타입으로 변환
const convertSupabaseJobToJob = (supabaseJob: any): Job => {
  return {
    id: supabaseJob.id,
    companyName: supabaseJob.company_name,
    jobTitle: supabaseJob.job_title,
    conditions: supabaseJob.conditions,
    jobType: supabaseJob.job_type as JobType,
    positionDescription: supabaseJob.position_description,
    mainTask: supabaseJob.main_task,
    qualifications: supabaseJob.qualifications,
    preferredQualifications: supabaseJob.preferred_qualifications,
    logoUrl: supabaseJob.logo_url || '',
    url: supabaseJob.url || '',
    uploadedAt: supabaseJob.uploaded_at,
    deadline: supabaseJob.deadline,
    prompt: () =>
      Promise.resolve(
        supabaseJob.prompt_content || '아직 등록된 프롬프트가 없습니다.'
      ),
  }
}

// 모든 채용공고 가져오기
export const getAllJobs = async (): Promise<Job[]> => {
  try {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Error fetching jobs:', error)
      return []
    }

    return data.map(convertSupabaseJobToJob)
  } catch (error) {
    console.error('Error in getAllJobs:', error)
    return []
  }
}

// 페이지네이션으로 채용공고 가져오기
export const getJobsPaginated = async (
  page: number = 1,
  limit: number = 10
): Promise<{ jobs: Job[]; totalCount: number; hasMore: boolean }> => {
  try {
    const supabase = await getSupabaseClient()

    // offset 계산
    const from = (page - 1) * limit
    const to = from + limit - 1

    // 총 개수 가져오기
    const { count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })

    // 페이지네이션된 데이터 가져오기
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('id', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Error fetching paginated jobs:', error)
      return { jobs: [], totalCount: 0, hasMore: false }
    }

    const totalCount = count || 0
    const hasMore = page * limit < totalCount

    return {
      jobs: data.map(convertSupabaseJobToJob),
      totalCount,
      hasMore,
    }
  } catch (error) {
    console.error('Error in getJobsPaginated:', error)
    return { jobs: [], totalCount: 0, hasMore: false }
  }
}

// 최신 채용공고 제한된 개수로 가져오기 (메인 페이지용)
export const getLatestJobs = async (limit: number = 10): Promise<Job[]> => {
  try {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('id', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching latest jobs:', error)
      return []
    }

    return data.map(convertSupabaseJobToJob)
  } catch (error) {
    console.error('Error in getLatestJobs:', error)
    return []
  }
}

// 오프셋 기반 페이지네이션으로 채용공고 가져오기 (무한스크롤용)
export const getJobsWithOffset = async (
  offset: number = 0,
  limit: number = 10
): Promise<{ jobs: Job[]; totalCount: number; hasMore: boolean }> => {
  try {
    const supabase = await getSupabaseClient()

    // 총 개수 가져오기
    const { count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })

    // 오프셋 기반으로 데이터 가져오기
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching jobs with offset:', error)
      return { jobs: [], totalCount: 0, hasMore: false }
    }

    const totalCount = count || 0
    const hasMore = offset + limit < totalCount

    return {
      jobs: data.map(convertSupabaseJobToJob),
      totalCount,
      hasMore,
    }
  } catch (error) {
    console.error('Error in getJobsWithOffset:', error)
    return { jobs: [], totalCount: 0, hasMore: false }
  }
}

// ID로 채용공고 가져오기
export const getJobById = async (id: number): Promise<Job | null> => {
  try {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching job by id:', error)
      return null
    }

    return convertSupabaseJobToJob(data)
  } catch (error) {
    console.error('Error in getJobById:', error)
    return null
  }
}

// 회사명으로 채용공고 가져오기
export const getJobsByCompany = async (companyName: string): Promise<Job[]> => {
  try {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_name', companyName)
      .order('id', { ascending: false })

    if (error) {
      console.error('Error fetching jobs by company:', error)
      return []
    }

    return data.map(convertSupabaseJobToJob)
  } catch (error) {
    console.error('Error in getJobsByCompany:', error)
    return []
  }
}

// 직무 타입으로 채용공고 가져오기
export const getJobsByType = async (jobType: JobType): Promise<Job[]> => {
  try {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_type', jobType)
      .order('id', { ascending: false })

    if (error) {
      console.error('Error fetching jobs by type:', error)
      return []
    }

    return data.map(convertSupabaseJobToJob)
  } catch (error) {
    console.error('Error in getJobsByType:', error)
    return []
  }
}

// 검색으로 채용공고 가져오기
export const searchJobs = async (query: string): Promise<Job[]> => {
  try {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .or(
        `company_name.ilike.%${query}%,job_title.ilike.%${query}%,position_description.ilike.%${query}%`
      )
      .order('id', { ascending: false })

    if (error) {
      console.error('Error searching jobs:', error)
      return []
    }

    return data.map(convertSupabaseJobToJob)
  } catch (error) {
    console.error('Error in searchJobs:', error)
    return []
  }
}

// 채용공고 추가 (Admin 전용)
export const insertJob = async (
  job: Omit<Job, 'id' | 'prompt'> & { promptContent?: string }
): Promise<Job | null> => {
  try {
    // Admin 작업이므로 Admin 클라이언트 사용
    const supabase = getAdminClient()

    const supabaseJob = {
      company_name: job.companyName,
      job_title: job.jobTitle,
      conditions: job.conditions,
      job_type: job.jobType,
      position_description: job.positionDescription,
      main_task: job.mainTask,
      qualifications: job.qualifications,
      preferred_qualifications: job.preferredQualifications,
      logo_url: job.logoUrl,
      url: job.url,
      prompt_content: job.promptContent,
      uploaded_at: job.uploadedAt,
      deadline: job.deadline,
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert(supabaseJob)
      .select()
      .single()

    if (error) {
      console.error('Error inserting job:', error)
      return null
    }

    return convertSupabaseJobToJob(data)
  } catch (error) {
    console.error('Error in insertJob:', error)
    return null
  }
}

// 채용공고 업데이트 (Admin 전용)
export const updateJob = async (
  id: number,
  updates: Partial<Omit<Job, 'id' | 'prompt'>> & { promptContent?: string }
): Promise<boolean> => {
  try {
    // Admin 작업이므로 Admin 클라이언트 사용
    const supabase = getAdminClient()

    const supabaseUpdates: any = {}
    if (updates.companyName) supabaseUpdates.company_name = updates.companyName
    if (updates.jobTitle) supabaseUpdates.job_title = updates.jobTitle
    if (updates.conditions) supabaseUpdates.conditions = updates.conditions
    if (updates.jobType) supabaseUpdates.job_type = updates.jobType
    if (updates.positionDescription)
      supabaseUpdates.position_description = updates.positionDescription
    if (updates.mainTask) supabaseUpdates.main_task = updates.mainTask
    if (updates.qualifications)
      supabaseUpdates.qualifications = updates.qualifications
    if (updates.preferredQualifications)
      supabaseUpdates.preferred_qualifications = updates.preferredQualifications
    if (updates.logoUrl !== undefined)
      supabaseUpdates.logo_url = updates.logoUrl
    if (updates.url !== undefined) supabaseUpdates.url = updates.url
    if (updates.promptContent !== undefined)
      supabaseUpdates.prompt_content = updates.promptContent
    if (updates.uploadedAt) supabaseUpdates.uploaded_at = updates.uploadedAt
    if (updates.deadline) supabaseUpdates.deadline = updates.deadline

    const { error } = await supabase
      .from('jobs')
      .update(supabaseUpdates)
      .eq('id', id)

    if (error) {
      console.error('Error updating job:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateJob:', error)
    return false
  }
}

// 채용공고 삭제 (Admin 전용)
export const deleteJob = async (id: number): Promise<boolean> => {
  try {
    // Admin 작업이므로 Admin 클라이언트 사용
    const supabase = getAdminClient()

    const { error } = await supabase.from('jobs').delete().eq('id', id)

    if (error) {
      console.error('Error deleting job:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteJob:', error)
    return false
  }
}

// 채용공고 개수 가져오기
export const getJobsCount = async (): Promise<number> => {
  try {
    const supabase = await getSupabaseClient()

    const { count, error } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error fetching jobs count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error in getJobsCount:', error)
    return 0
  }
}

// 사용 가능한 직무 타입 가져오기
export const getAvailableJobTypes = async (): Promise<JobType[]> => {
  try {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
      .from('jobs')
      .select('job_type')
      .order('job_type')

    if (error) {
      console.error('Error fetching job types:', error)
      return []
    }

    // 중복 제거
    const uniqueTypes = Array.from(
      new Set(data.map((item) => item.job_type))
    ) as JobType[]

    return uniqueTypes
  } catch (error) {
    console.error('Error in getAvailableJobTypes:', error)
    return []
  }
}

// 회사명 목록 가져오기
export const getCompanyNames = async (): Promise<string[]> => {
  try {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
      .from('jobs')
      .select('company_name')
      .order('company_name')

    if (error) {
      console.error('Error fetching company names:', error)
      return []
    }

    // 중복 제거
    const uniqueCompanies = Array.from(
      new Set(data.map((item: { company_name: string }) => item.company_name))
    )

    return uniqueCompanies
  } catch (error) {
    console.error('Error in getCompanyNames:', error)
    return []
  }
}

// 특정 채용공고의 프롬프트 가져오기
export const getJobPrompt = async (id: number): Promise<string> => {
  try {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
      .from('jobs')
      .select('prompt_content')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching job prompt:', error)
      return '프롬프트를 불러올 수 없습니다.'
    }

    return data.prompt_content || '아직 등록된 프롬프트가 없습니다.'
  } catch (error) {
    console.error('Error in getJobPrompt:', error)
    return '프롬프트를 불러올 수 없습니다.'
  }
}
