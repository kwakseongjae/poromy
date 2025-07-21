'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import AdminGuard from '@/components/admin/AdminGuard'
import { useAllJobs, useDeleteJob, useCreateJob, useInvalidateJobsCache } from '@/hooks/useJobsQueries'
import type { Job, JobType } from '@/types/job'

// 빠른 업로드용 데이터 타입
interface QuickUploadData {
  id: string
  companyName: string
  jobTitle: string
  conditions: string[]
  jobType: JobType
  positionDescription: string
  mainTask: string
  qualifications: string[]
  preferredQualifications: string[]
  logoUrl: string
  url: string
  uploadedAt: string
  deadline: string
  promptContent: string
}

function AdminJobsContent() {
  const [message, setMessage] = useState('')
  const [quickUploadData, setQuickUploadData] = useState('')
  const [quickUploadPrompt, setQuickUploadPrompt] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [parsedJobData, setParsedJobData] = useState<QuickUploadData | null>(
    null
  )
  
  // React Query hooks
  const { data: jobs = [], isLoading: jobsLoading, error: jobsError } = useAllJobs()
  const deleteJobMutation = useDeleteJob()
  const createJobMutation = useCreateJob()
  const invalidateCache = useInvalidateJobsCache()

  // 에러 처리
  if (jobsError) {
    console.error('Error loading jobs:', jobsError)
    setMessage('채용공고를 불러오는 중 오류가 발생했습니다.')
  }

  // 채용공고 삭제
  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 채용공고를 삭제하시겠습니까?')) {
      return
    }

    try {
      await deleteJobMutation.mutateAsync(id)
      setMessage('채용공고가 삭제되었습니다.')
      console.log('Job deleted successfully')
    } catch (error) {
      console.error('Error deleting job:', error)
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      setMessage(`오류: ${errorMessage}`)
    }
  }

  // 빠른 업로드 데이터 파싱 - 안전한 방식으로 구현
  const parseQuickUploadData = () => {
    try {
      let jobData

      try {
        // 먼저 JSON.parse 시도
        jobData = JSON.parse(quickUploadData)
      } catch {
        // JSON.parse 실패 시 안전한 파싱 시도
        const cleanData = quickUploadData.trim()
        if (cleanData.startsWith('{') && cleanData.endsWith('}')) {
          // eval 대신 안전한 파싱 방법 사용
          // 1. 먼저 JavaScript 객체 리터럴을 JSON으로 변환 시도
          try {
            // 속성 이름에 따옴표 추가
            const jsonString = cleanData
              .replace(/(\w+):/g, '"$1":')
              // 작은따옴표를 큰따옴표로 변환
              .replace(/'/g, '"')
              // 후행 쉼표 제거
              .replace(/,\s*}/g, '}')
              .replace(/,\s*]/g, ']')
            
            jobData = JSON.parse(jsonString)
          } catch (parseError) {
            console.error('파싱 에러:', parseError)
            throw new Error('데이터 형식이 올바르지 않습니다. JSON 형식으로 입력해주세요.')
          }
        } else {
          throw new Error('올바른 형식이 아닙니다. 중괄호({})로 시작하고 끝나야 합니다.')
        }
      }

      // 다음 ID 계산 (가장 큰 ID + 1)
      const nextId =
        jobs.length > 0 ? Math.max(...jobs.map((job) => job.id)) + 1 : 1

      const parsedData: QuickUploadData = {
        id: nextId.toString(),
        companyName: jobData.companyName || '',
        jobTitle: jobData.jobTitle || '',
        conditions: Array.isArray(jobData.conditions) ? jobData.conditions : [],
        jobType: jobData.jobType || 'IT-개발',
        positionDescription: jobData.positionDescription || '',
        mainTask: jobData.mainTask || '',
        qualifications: Array.isArray(jobData.qualifications)
          ? jobData.qualifications
          : [],
        preferredQualifications: Array.isArray(jobData.preferredQualifications)
          ? jobData.preferredQualifications
          : [],
        logoUrl: jobData.logoUrl || '',
        url: jobData.url || '',
        uploadedAt: jobData.uploadedAt || new Date().toISOString(),
        deadline: jobData.deadline || '상시 채용',
        promptContent: quickUploadPrompt,
      }

      setParsedJobData(parsedData)
      setShowConfirmModal(true)
    } catch (error) {
      setMessage(
        '데이터를 파싱하는 중 오류가 발생했습니다. JavaScript 객체 형식 또는 JSON 형식인지 확인해주세요.'
      )
    }
  }

  // 빠른 업로드 확인
  const handleQuickUpload = async () => {
    if (!parsedJobData) return

    try {
      const job = {
        id: parsedJobData.id,
        companyName: parsedJobData.companyName,
        jobTitle: parsedJobData.jobTitle,
        conditions: parsedJobData.conditions,
        jobType: parsedJobData.jobType,
        positionDescription: parsedJobData.positionDescription,
        mainTask: parsedJobData.mainTask,
        qualifications: parsedJobData.qualifications,
        preferredQualifications: parsedJobData.preferredQualifications,
        logoUrl: parsedJobData.logoUrl,
        url: parsedJobData.url,
        uploadedAt: parsedJobData.uploadedAt,
        deadline: parsedJobData.deadline,
      }

      await createJobMutation.mutateAsync({
        job,
        promptContent: parsedJobData.promptContent,
      })
      
      setMessage('채용공고가 성공적으로 업로드되었습니다.')
      setQuickUploadData('')
      setQuickUploadPrompt('')
      setShowConfirmModal(false)
      setParsedJobData(null)
      console.log('Job created successfully')
    } catch (error) {
      console.error('Error uploading job:', error)
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      setMessage(`오류: ${errorMessage}`)
    }
  }

  // 빠른 업로드 취소
  const handleQuickUploadCancel = () => {
    setShowConfirmModal(false)
    setParsedJobData(null)
  }

  // 뮤테이션 로딩 상태
  const isLoading = createJobMutation.isPending || deleteJobMutation.isPending

  // 로딩 중인 경우 로딩 화면 표시
  if (jobsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">채용공고를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="mb-8 text-3xl font-bold text-gray-900">
              채용공고 관리
            </h1>

            {message && (
              <div
                className={`mb-4 rounded-md p-4 ${
                  message.includes('오류')
                    ? 'bg-red-50 text-red-700'
                    : 'bg-green-50 text-green-700'
                }`}
              >
                {message}
              </div>
            )}

            {/* 빠른 업로드 섹션 */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">빠른 데이터 업로드</h2>
              <p className="mb-4 text-sm text-gray-600">
                JavaScript 객체(따옴표 없음) 또는 JSON 형식과 마크다운
                프롬프트를 입력하여 빠르게 채용공고를 추가하세요. 두 형식 모두
                지원됩니다.
              </p>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    채용공고 데이터 (JavaScript 객체 또는 JSON 형식)
                  </label>
                  <textarea
                    rows={15}
                    className="w-full rounded-md border-gray-300 font-mono text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={quickUploadData}
                    onChange={(e) => setQuickUploadData(e.target.value)}
                    placeholder={`JavaScript 객체 형식 (따옴표 없이):
{
  companyName: '회사명',
  jobTitle: '직무 제목',
  conditions: ['조건1', '조건2'],
  jobType: 'IT-개발',
  positionDescription: '직무 설명',
  mainTask: '주요 업무',
  qualifications: ['자격1', '자격2'],
  preferredQualifications: ['우대1', '우대2'],
  logoUrl: '로고 URL',
  url: '채용 URL',
  uploadedAt: '2025-05-25T00:00:00+09:00',
  deadline: '2025-06-09T23:59:59+09:00'
}

또는 JSON 형식 (모든 키에 따옴표):
{
  "companyName": "회사명",
  "jobTitle": "직무 제목"
}`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    프롬프트 내용 (마크다운 형식)
                  </label>
                  <textarea
                    rows={15}
                    className="w-full rounded-md border-gray-300 font-mono text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={quickUploadPrompt}
                    onChange={(e) => setQuickUploadPrompt(e.target.value)}
                    placeholder="# 프롬프트 제목

당신은 해당 기업의 채용 담당자입니다...

## 기업 정보

...

## 작성 방향

..."
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={parseQuickUploadData}
                  disabled={
                    !quickUploadData.trim() || !quickUploadPrompt.trim()
                  }
                  className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  업로드 미리보기
                </button>
              </div>
            </div>

            <div className="mb-8 border-t border-gray-200 pt-8"></div>

            {/* 채용공고 목록 */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                채용공고 목록 ({jobs.length}개)
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        회사명
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        직무
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        타입
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        마감일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {jobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                          {job.id}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          {job.companyName}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          {job.jobTitle}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          {job.jobType}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          {job.deadline}
                        </td>
                        <td className="space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 확인 모달 */}
      {showConfirmModal && parsedJobData && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="px-6 py-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  업로드 데이터 확인
                </h3>
                <button
                  onClick={handleQuickUploadCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  다음 데이터로 채용공고가 생성됩니다. 확인 후 업로드하세요.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">기본 정보</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>ID:</strong> {parsedJobData.id}
                    </div>
                    <div>
                      <strong>회사명:</strong> {parsedJobData.companyName}
                    </div>
                    <div>
                      <strong>직무 제목:</strong> {parsedJobData.jobTitle}
                    </div>
                    <div>
                      <strong>직무 타입:</strong> {parsedJobData.jobType}
                    </div>
                    <div>
                      <strong>마감일:</strong> {parsedJobData.deadline}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium text-gray-900">조건</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>직무 조건:</strong>
                      <ul className="mt-1 list-inside list-disc">
                        {parsedJobData.conditions.map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="mb-2 font-medium text-gray-900">직무 설명</h4>
                  <p className="text-sm text-gray-700">
                    {parsedJobData.positionDescription}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <h4 className="mb-2 font-medium text-gray-900">주요 업무</h4>
                  <p className="text-sm text-gray-700">
                    {parsedJobData.mainTask}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 font-medium text-gray-900">
                    필수 자격요건
                  </h4>
                  <ul className="list-inside list-disc text-sm">
                    {parsedJobData.qualifications.map(
                      (qualification, index) => (
                        <li key={index}>{qualification}</li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 font-medium text-gray-900">우대 사항</h4>
                  <ul className="list-inside list-disc text-sm">
                    {parsedJobData.preferredQualifications.map(
                      (qualification, index) => (
                        <li key={index}>{qualification}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="md:col-span-2">
                  <h4 className="mb-2 font-medium text-gray-900">
                    프롬프트 내용 미리보기
                  </h4>
                  <div className="max-h-40 overflow-y-auto rounded bg-gray-50 p-3 text-sm">
                    <pre className="whitespace-pre-wrap">
                      {parsedJobData.promptContent.substring(0, 500)}...
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleQuickUploadCancel}
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                >
                  취소
                </button>
                <button
                  onClick={handleQuickUpload}
                  disabled={isLoading}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isLoading ? '업로드 중...' : '업로드 확인'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Export with AdminGuard wrapper
export default function AdminJobsPage() {
  return (
    <AdminGuard>
      <AdminJobsContent />
    </AdminGuard>
  )
}
