import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import {
  createClient as createServerClient,
  createAdminClient,
} from '@/lib/supabase-server'
import type { Job, JobType } from '@/types/job'

/**
 * 실행 환경에 따라 적절한 Supabase 클라이언트를 반환하는 함수
 * - 브라우저 환경: 클라이언트 사이드 인증이 가능한 브라우저 클라이언트 사용
 * - 서버 환경: 서버 사이드 렌더링을 위한 서버 클라이언트 사용
 * @returns {Promise<SupabaseClient>} 환경에 맞는 Supabase 클라이언트 인스턴스
 */
const getSupabaseClient = async () => {
  // 브라우저 환경 체크 (window 객체가 존재하는지 확인)
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드에서 실행 중인 경우
    return createBrowserSupabaseClient()
  }

  // 서버 사이드에서 실행 중인 경우 (SSR, API 라우트 등)
  return await createServerClient()
}

/**
 * 관리자 권한이 필요한 작업을 위한 Admin 클라이언트 반환 함수
 * - 서버 환경에서만 사용 가능
 * - 데이터베이스에 대한 전체 읽기/쓰기 권한을 가짐
 * @returns {SupabaseClient} Admin 권한을 가진 Supabase 클라이언트
 */
const getAdminClient = () => {
  return createAdminClient()
}

/**
 * Supabase 데이터베이스의 원시 데이터를 애플리케이션의 Job 타입으로 변환하는 함수
 * - 데이터베이스의 snake_case 필드명을 camelCase로 변환
 * - 빈 값들을 기본값으로 처리
 * - prompt 필드를 함수로 래핑하여 지연 로딩 구현
 * @param {any} supabaseJob - Supabase에서 가져온 원시 job 데이터
 * @returns {Job} 타입 안전성이 보장된 Job 객체
 */
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
    // 로고 URL이 없는 경우 빈 문자열로 기본값 설정
    logoUrl: supabaseJob.logo_url || '',
    // 채용공고 URL이 없는 경우 빈 문자열로 기본값 설정
    url: supabaseJob.url || '',
    uploadedAt: supabaseJob.uploaded_at,
    deadline: supabaseJob.deadline,
    // 프롬프트를 함수로 래핑하여 필요할 때만 로드되도록 구현
    // 이는 메모리 효율성을 위한 지연 로딩 패턴
    prompt: () =>
      Promise.resolve(
        supabaseJob.prompt_content || '아직 등록된 프롬프트가 없습니다.'
      ),
  }
}

/**
 * 모든 채용공고를 최신순으로 가져오는 함수
 * - 페이지네이션 없이 전체 데이터를 반환
 * - 관리자 페이지나 전체 데이터가 필요한 경우에 사용
 * @returns {Promise<Job[]>} 모든 채용공고 배열 (최신순 정렬)
 */
export const getAllJobs = async (): Promise<Job[]> => {
  try {
    // 환경에 맞는 Supabase 클라이언트 가져오기
    const supabase = await getSupabaseClient()

    // jobs 테이블에서 모든 데이터를 최신순(id 역순)으로 조회
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('id', { ascending: false })

    // 에러 발생 시 로그 출력 후 빈 배열 반환
    if (error) {
      console.error('Error fetching jobs:', error)
      return []
    }

    // 원시 데이터를 Job 타입으로 변환하여 반환
    return data.map(convertSupabaseJobToJob)
  } catch (error) {
    // 예외 발생 시 로그 출력 후 빈 배열 반환
    console.error('Error in getAllJobs:', error)
    return []
  }
}

/**
 * 페이지 기반 페이지네이션으로 채용공고를 가져오는 함수
 * - 전통적인 페이지 기반 네비게이션에 사용
 * - 총 개수와 다음 페이지 존재 여부도 함께 반환
 * @param {number} page - 페이지 번호 (1부터 시작)
 * @param {number} limit - 페이지당 항목 수 (기본값: 10)
 * @returns {Promise<{jobs: Job[], totalCount: number, hasMore: boolean}>} 페이지네이션 결과
 */
export const getJobsPaginated = async (
  page: number = 1,
  limit: number = 10
): Promise<{ jobs: Job[]; totalCount: number; hasMore: boolean }> => {
  try {
    const supabase = await getSupabaseClient()

    // 페이지 번호를 기반으로 시작 인덱스와 끝 인덱스 계산
    // 예: page=1, limit=10 → from=0, to=9
    const from = (page - 1) * limit
    const to = from + limit - 1

    // 전체 항목 수를 먼저 조회 (헤드 온리 요청으로 데이터는 가져오지 않음)
    const { count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })

    // 계산된 범위에 해당하는 데이터만 조회
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
    // 다음 페이지가 있는지 계산 (현재 페이지 * 항목수 < 전체 개수)
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

/**
 * 최신 채용공고를 제한된 개수만큼 가져오는 함수
 * - 메인 페이지의 "최신 채용공고" 섹션에서 사용
 * - 빠른 로딩을 위해 필요한 만큼만 조회
 * @param {number} limit - 가져올 최대 항목 수 (기본값: 10)
 * @returns {Promise<Job[]>} 최신 채용공고 배열
 */
export const getLatestJobs = async (limit: number = 10): Promise<Job[]> => {
  try {
    const supabase = await getSupabaseClient()

    // 최신순 정렬 후 제한된 개수만 조회
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

/**
 * 오프셋 기반 페이지네이션으로 채용공고를 가져오는 함수
 * - 무한 스크롤 구현에 적합
 * - 페이지 번호 대신 시작 위치(offset)를 직접 지정
 * @param {number} offset - 시작 위치 (기본값: 0)
 * @param {number} limit - 가져올 항목 수 (기본값: 10)
 * @returns {Promise<{jobs: Job[], totalCount: number, hasMore: boolean}>} 오프셋 기반 결과
 */
export const getJobsWithOffset = async (
  offset: number = 0,
  limit: number = 10
): Promise<{ jobs: Job[]; totalCount: number; hasMore: boolean }> => {
  try {
    const supabase = await getSupabaseClient()

    // 전체 항목 수 조회
    const { count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })

    // 오프셋부터 limit 개수만큼 데이터 조회
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
    // 더 가져올 데이터가 있는지 확인
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

/**
 * 특정 ID의 채용공고를 가져오는 함수
 * - 채용공고 상세 페이지에서 사용
 * - 단일 레코드 조회이므로 .single() 메서드 사용
 * @param {number} id - 조회할 채용공고의 ID
 * @returns {Promise<Job | null>} 해당 채용공고 또는 null (없는 경우)
 */
export const getJobById = async (id: number): Promise<Job | null> => {
  try {
    const supabase = await getSupabaseClient()

    // ID가 일치하는 단일 레코드 조회
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

/**
 * 특정 회사의 모든 채용공고를 가져오는 함수
 * - 회사별 채용공고 목록 페이지에서 사용
 * - 회사명 기준으로 필터링하여 최신순 정렬
 * @param {string} companyName - 조회할 회사명 (정확히 일치해야 함)
 * @returns {Promise<Job[]>} 해당 회사의 채용공고 배열
 */
export const getJobsByCompany = async (companyName: string): Promise<Job[]> => {
  try {
    const supabase = await getSupabaseClient()

    // 회사명이 정확히 일치하는 채용공고들을 최신순으로 조회
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

/**
 * 특정 직무 타입의 채용공고를 가져오는 함수
 * - 직무별 채용공고 목록 페이지에서 사용
 * - 개발자, 디자이너, 마케터 등 직무 타입별 필터링
 * @param {JobType} jobType - 조회할 직무 타입
 * @returns {Promise<Job[]>} 해당 직무의 채용공고 배열
 */
export const getJobsByType = async (jobType: JobType): Promise<Job[]> => {
  try {
    const supabase = await getSupabaseClient()

    // 직무 타입이 일치하는 채용공고들을 최신순으로 조회
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

/**
 * 키워드 기반 채용공고 검색 함수
 * - 전체 텍스트 검색 기능 제공
 * - 회사명, 직무명, 직무 설명에서 부분 일치 검색 (대소문자 구분 없음)
 * @param {string} query - 검색할 키워드
 * @returns {Promise<Job[]>} 검색 결과에 해당하는 채용공고 배열
 */
export const searchJobs = async (query: string): Promise<Job[]> => {
  try {
    const supabase = await getSupabaseClient()

    // OR 조건으로 여러 필드에서 부분 일치 검색 (ilike: 대소문자 구분 없는 LIKE)
    // %query% 패턴으로 키워드가 포함된 모든 레코드 검색
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

/**
 * 검색어로 채용공고를 페이지네이션하여 조회하는 함수
 * - 페이지 기반 검색 (모바일용)
 * @param {string} query - 검색어
 * @param {number} page - 페이지 번호 (1부터 시작)
 * @param {number} limit - 페이지당 아이템 수
 * @returns {Promise<{ jobs: Job[]; totalCount: number; hasMore: boolean }>}
 */
export const searchJobsPaginated = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<{ jobs: Job[]; totalCount: number; hasMore: boolean }> => {
  try {
    const supabase = await getSupabaseClient()
    const offset = (page - 1) * limit

    // 전체 데이터를 가져와서 클라이언트 사이드에서 포괄적 검색 수행
    const { data: allData, error: searchError } = await supabase
      .from('jobs')
      .select('*')
      .order('id', { ascending: false })

    if (searchError) {
      console.error('Error searching jobs with pagination:', searchError)
      return { jobs: [], totalCount: 0, hasMore: false }
    }

    // 모든 필드를 포함하여 클라이언트 사이드에서 포괄적 검색 필터링
    const filteredData = (allData || []).filter((job: any) => {
      const queryLower = query.toLowerCase()

      // 기본 텍스트 필드 검색
      const textFieldMatch =
        job.company_name?.toLowerCase().includes(queryLower) ||
        job.job_title?.toLowerCase().includes(queryLower) ||
        job.position_description?.toLowerCase().includes(queryLower) ||
        job.main_task?.toLowerCase().includes(queryLower)

      // 배열 필드 검색 - 각 배열의 요소들을 개별적으로 확인
      const conditionsMatch =
        job.conditions && Array.isArray(job.conditions)
          ? job.conditions.some(
              (condition: string) =>
                condition &&
                typeof condition === 'string' &&
                condition.toLowerCase().includes(queryLower)
            )
          : false

      const qualificationsMatch =
        job.qualifications && Array.isArray(job.qualifications)
          ? job.qualifications.some(
              (qualification: string) =>
                qualification &&
                typeof qualification === 'string' &&
                qualification.toLowerCase().includes(queryLower)
            )
          : false

      const preferredQualificationsMatch =
        job.preferred_qualifications &&
        Array.isArray(job.preferred_qualifications)
          ? job.preferred_qualifications.some(
              (qualification: string) =>
                qualification &&
                typeof qualification === 'string' &&
                qualification.toLowerCase().includes(queryLower)
            )
          : false

      return (
        textFieldMatch ||
        conditionsMatch ||
        qualificationsMatch ||
        preferredQualificationsMatch
      )
    })

    // 페이지네이션 적용
    const data = filteredData.slice(offset, offset + limit)
    const totalCount = filteredData.length
    const hasMore = offset + limit < totalCount

    const jobs = data?.map(convertSupabaseJobToJob) || []

    return { jobs, totalCount, hasMore }
  } catch (error) {
    console.error('Error in searchJobsPaginated:', error)
    return { jobs: [], totalCount: 0, hasMore: false }
  }
}

/**
 * 검색어로 채용공고를 오프셋 기반으로 조회하는 함수
 * - 오프셋 기반 검색 (데스크탑 무한스크롤용)
 * @param {string} query - 검색어
 * @param {number} offset - 시작 오프셋
 * @param {number} limit - 가져올 아이템 수
 * @returns {Promise<{ jobs: Job[]; totalCount: number; hasMore: boolean }>}
 */
export const searchJobsWithOffset = async (
  query: string,
  offset: number = 0,
  limit: number = 20
): Promise<{ jobs: Job[]; totalCount: number; hasMore: boolean }> => {
  try {
    const supabase = await getSupabaseClient()

    // 전체 데이터를 가져와서 클라이언트 사이드에서 포괄적 검색 수행
    const { data: allData, error: searchError } = await supabase
      .from('jobs')
      .select('*')
      .order('id', { ascending: false })

    if (searchError) {
      console.error('Error searching jobs with offset:', searchError)
      return { jobs: [], totalCount: 0, hasMore: false }
    }

    // 모든 필드를 포함하여 클라이언트 사이드에서 포괄적 검색 필터링
    const filteredData = (allData || []).filter((job: any) => {
      const queryLower = query.toLowerCase()

      // 기본 텍스트 필드 검색
      const textFieldMatch =
        job.company_name?.toLowerCase().includes(queryLower) ||
        job.job_title?.toLowerCase().includes(queryLower) ||
        job.position_description?.toLowerCase().includes(queryLower) ||
        job.main_task?.toLowerCase().includes(queryLower)

      // 배열 필드 검색 - 각 배열의 요소들을 개별적으로 확인
      const conditionsMatch =
        job.conditions && Array.isArray(job.conditions)
          ? job.conditions.some(
              (condition: string) =>
                condition &&
                typeof condition === 'string' &&
                condition.toLowerCase().includes(queryLower)
            )
          : false

      const qualificationsMatch =
        job.qualifications && Array.isArray(job.qualifications)
          ? job.qualifications.some(
              (qualification: string) =>
                qualification &&
                typeof qualification === 'string' &&
                qualification.toLowerCase().includes(queryLower)
            )
          : false

      const preferredQualificationsMatch =
        job.preferred_qualifications &&
        Array.isArray(job.preferred_qualifications)
          ? job.preferred_qualifications.some(
              (qualification: string) =>
                qualification &&
                typeof qualification === 'string' &&
                qualification.toLowerCase().includes(queryLower)
            )
          : false

      return (
        textFieldMatch ||
        conditionsMatch ||
        qualificationsMatch ||
        preferredQualificationsMatch
      )
    })

    // 오프셋 기반 페이지네이션 적용
    const data = filteredData.slice(offset, offset + limit)
    const totalCount = filteredData.length
    const hasMore = offset + limit < totalCount

    const jobs = data?.map(convertSupabaseJobToJob) || []

    return { jobs, totalCount, hasMore }
  } catch (error) {
    console.error('Error in searchJobsWithOffset:', error)
    return { jobs: [], totalCount: 0, hasMore: false }
  }
}

/**
 * 새로운 채용공고를 데이터베이스에 추가하는 함수 (관리자 전용)
 * - 관리자만 접근 가능한 기능
 * - Admin 클라이언트를 사용하여 권한 확인 없이 직접 삽입
 * - 프롬프트 내용도 함께 저장 가능
 * @param {Omit<Job, 'id' | 'prompt'> & { promptContent?: string }} job - 추가할 채용공고 데이터
 * @returns {Promise<Job | null>} 추가된 채용공고 또는 null (실패 시)
 */
export const insertJob = async (
  job: Omit<Job, 'id' | 'prompt'> & { promptContent?: string }
): Promise<Job | null> => {
  try {
    // 관리자 권한이 필요한 작업이므로 Admin 클라이언트 사용
    const supabase = getAdminClient()

    // 애플리케이션의 camelCase 필드를 데이터베이스의 snake_case로 변환
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

    // 데이터 삽입 후 삽입된 레코드를 다시 조회하여 반환
    const { data, error } = await supabase
      .from('jobs')
      .insert(supabaseJob)
      .select()
      .single()

    if (error) {
      console.error('Error inserting job:', error)
      return null
    }

    // 삽입된 데이터를 Job 타입으로 변환하여 반환
    return convertSupabaseJobToJob(data)
  } catch (error) {
    console.error('Error in insertJob:', error)
    return null
  }
}

/**
 * 기존 채용공고를 업데이트하는 함수 (관리자 전용)
 * - 부분 업데이트 지원 (변경된 필드만 전달 가능)
 * - undefined 값은 무시하고, 명시적으로 전달된 필드만 업데이트
 * @param {number} id - 업데이트할 채용공고의 ID
 * @param {Partial<Omit<Job, 'id' | 'prompt'>> & { promptContent?: string }} updates - 업데이트할 필드들
 * @returns {Promise<boolean>} 업데이트 성공 여부
 */
export const updateJob = async (
  id: number,
  updates: Partial<Omit<Job, 'id' | 'prompt'>> & { promptContent?: string }
): Promise<boolean> => {
  try {
    // 관리자 권한이 필요한 작업이므로 Admin 클라이언트 사용
    const supabase = getAdminClient()

    // 업데이트할 필드들만 포함하는 객체 생성
    // undefined 값은 제외하여 실제로 변경하고자 하는 필드만 업데이트
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
    // logoUrl과 url은 빈 문자열도 유효한 값이므로 !== undefined로 체크
    if (updates.logoUrl !== undefined)
      supabaseUpdates.logo_url = updates.logoUrl
    if (updates.url !== undefined) supabaseUpdates.url = updates.url
    if (updates.promptContent !== undefined)
      supabaseUpdates.prompt_content = updates.promptContent
    if (updates.uploadedAt) supabaseUpdates.uploaded_at = updates.uploadedAt
    if (updates.deadline) supabaseUpdates.deadline = updates.deadline

    // 지정된 ID의 레코드를 업데이트
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

/**
 * 채용공고를 삭제하는 함수 (관리자 전용)
 * - 물리적 삭제 (데이터베이스에서 완전히 제거)
 * - 복구 불가능하므로 신중하게 사용해야 함
 * @param {number} id - 삭제할 채용공고의 ID
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
export const deleteJob = async (id: number): Promise<boolean> => {
  try {
    // 관리자 권한이 필요한 작업이므로 Admin 클라이언트 사용
    const supabase = getAdminClient()

    // 지정된 ID의 레코드를 삭제
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

/**
 * 전체 채용공고 개수를 조회하는 함수
 * - 통계나 페이지네이션 정보를 위해 사용
 * - 실제 데이터는 가져오지 않고 개수만 조회하여 성능 최적화
 * @returns {Promise<number>} 전체 채용공고 개수
 */
export const getJobsCount = async (): Promise<number> => {
  try {
    const supabase = await getSupabaseClient()

    // 헤드 온리 요청으로 개수만 조회 (데이터는 가져오지 않음)
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

/**
 * 현재 데이터베이스에 등록된 모든 직무 타입을 조회하는 함수
 * - 필터링 UI나 카테고리 목록 생성에 사용
 * - 중복 제거를 통해 고유한 직무 타입만 반환
 * @returns {Promise<JobType[]>} 사용 가능한 직무 타입 배열
 */
export const getAvailableJobTypes = async (): Promise<JobType[]> => {
  try {
    const supabase = await getSupabaseClient()

    // job_type 필드만 조회하여 네트워크 트래픽 최소화
    const { data, error } = await supabase
      .from('jobs')
      .select('job_type')
      .order('job_type')

    if (error) {
      console.error('Error fetching job types:', error)
      return []
    }

    if (!data) return []

    // Set을 사용하여 중복 제거 후 배열로 변환
    const uniqueTypes = [
      ...new Set(data.map((item: { job_type: string }) => item.job_type)),
    ] as JobType[]

    return uniqueTypes
  } catch (error) {
    console.error('Error in getAvailableJobTypes:', error)
    return []
  }
}

/**
 * 현재 데이터베이스에 등록된 모든 회사명을 조회하는 함수
 * - 회사별 필터링이나 자동완성 기능에 사용
 * - 중복 제거를 통해 고유한 회사명만 반환
 * @returns {Promise<string[]>} 등록된 회사명 배열
 */
export const getCompanyNames = async (): Promise<string[]> => {
  try {
    const supabase = await getSupabaseClient()

    // company_name 필드만 조회하여 네트워크 트래픽 최소화
    const { data, error } = await supabase
      .from('jobs')
      .select('company_name')
      .order('company_name')

    if (error) {
      console.error('Error fetching company names:', error)
      return []
    }

    // Set을 사용하여 중복 제거 후 배열로 변환
    const uniqueCompanies = Array.from(
      new Set(data.map((item: { company_name: string }) => item.company_name))
    ) as string[]

    return uniqueCompanies
  } catch (error) {
    console.error('Error in getCompanyNames:', error)
    return []
  }
}

/**
 * 특정 채용공고의 프롬프트 내용만 조회하는 함수
 * - 프롬프트가 필요한 시점에 개별적으로 로드
 * - 메인 채용공고 데이터와 분리하여 성능 최적화
 * @param {number} id - 프롬프트를 조회할 채용공고의 ID
 * @returns {Promise<string>} 프롬프트 내용 또는 기본 메시지
 */
export const getJobPrompt = async (id: number): Promise<string> => {
  try {
    const supabase = await getSupabaseClient()

    // prompt_content 필드만 조회하여 네트워크 사용량 최소화
    const { data, error } = await supabase
      .from('jobs')
      .select('prompt_content')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching job prompt:', error)
      return '프롬프트를 불러올 수 없습니다.'
    }

    // 프롬프트가 없는 경우 기본 메시지 반환
    return data.prompt_content || '아직 등록된 프롬프트가 없습니다.'
  } catch (error) {
    console.error('Error in getJobPrompt:', error)
    return '프롬프트를 불러올 수 없습니다.'
  }
}
