import { createClient, getOptimizedUser } from '@/lib/supabase-server'
import Link from 'next/link'
import InquiryList from '@/components/inquiry/InquiryList'
import { Inquiry } from '@/types/inquiry'
import { EditIcon } from '@/assets'
import { InquiryProcessModal } from '@/components/inquiry/InquiryProcessModal'
import { NotificationMessage } from '@/components/common/NotificationMessage'
import { Suspense } from 'react'

interface Profile {
  id: string
  email: string
  nickname: string
}

interface AdminProfile {
  id: string
  nickname: string
}

// 로딩 컴포넌트
const InquiryPageSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-lg bg-gray-100" />
      ))}
    </div>
  </div>
)

// 데이터 fetching 최적화 함수
const fetchInquiryData = async (supabase: any) => {
  // 병렬로 모든 데이터 가져오기
  // Performance optimization: Get user from JWT first
  const user = await getOptimizedUser()
  
  const { data: inquiries, error: inquiriesError } = await supabase
    .from('inquiries')
    .select('id, title, content, url, status, created_at, user_id')
    .order('created_at', { ascending: false })

  if (inquiriesError) {
    throw new Error('Failed to fetch inquiries')
  }

  if (!inquiries || inquiries.length === 0) {
    return {
      inquiries: [],
      isAdmin: false,
      userMap: {},
      answers: [],
      adminMap: {},
    }
  }

  const userIds = [
    ...new Set(inquiries.map((inquiry: any) => inquiry.user_id)),
  ] as string[]

  // 관리자 확인과 관련 데이터를 병렬로 처리
  const [
    adminData,
    { data: profiles },
    { data: authUsers },
    { data: answers },
  ] = await Promise.all([
    user
      ? supabase.from('administrators').select('id').eq('id', user.id).single()
      : { data: null },
    supabase.from('profiles').select('id, email, nickname').in('id', userIds),
    supabase
      .from('auth.users')
      .select('id, email, raw_user_meta_data')
      .in('id', userIds),
    supabase
      .from('answers')
      .select('id, content, url, created_at, admin_id, inquiry_id')
      .in(
        'inquiry_id',
        inquiries.map((i: any) => i.id)
      ),
  ])

  const isAdmin = Boolean(adminData?.data)

  // 사용자 정보 결합
  const combinedProfiles = userIds.map((userId: string) => {
    const profile = profiles?.find((p: any) => p.id === userId)
    if (profile) return profile

    const authUser = authUsers?.find((u: any) => u.id === userId)
    if (authUser) {
      return {
        id: authUser.id,
        email: authUser.email,
        nickname: authUser.raw_user_meta_data?.nickname || '사용자',
      }
    }

    return {
      id: userId,
      email: '정보 없음',
      nickname: `사용자 ${userId.substring(0, 5)}...`,
    }
  })

  const userMap = combinedProfiles.reduce<Record<string, Profile>>(
    (map, profile) => {
      map[profile.id] = profile
      return map
    },
    {}
  )

  // 관리자 정보 처리
  const adminIds = [
    ...new Set(answers?.map((answer: any) => answer.admin_id) || []),
  ]
  const { data: adminProfiles } =
    adminIds.length > 0
      ? await supabase
          .from('profiles')
          .select('id, nickname')
          .in('id', adminIds)
      : { data: [] }

  const adminMap = (adminProfiles || []).reduce(
    (map: any, profile: any) => {
      map[profile.id] = profile
      return map
    },
    {} as Record<string, AdminProfile>
  )

  return {
    inquiries,
    isAdmin,
    userMap,
    answers: answers || [],
    adminMap,
  }
}

export default async function InquiriesPage() {
  const supabase = await createClient()

  try {
    const { inquiries, isAdmin, userMap, answers, adminMap } =
      await fetchInquiryData(supabase)

    // 답변이 있는 문의 상태 업데이트 (배치 처리)
    const inquiriesWithAnswers = inquiries.filter(
      (inquiry: any) =>
        answers.some((answer: any) => answer.inquiry_id === inquiry.id) &&
        inquiry.status === 'pending'
    )

    if (inquiriesWithAnswers.length > 0) {
      await supabase
        .from('inquiries')
        .update({ status: 'answered' })
        .in(
          'id',
          inquiriesWithAnswers.map((i: any) => i.id)
        )
    }

    // 최종 데이터 조합
    const combinedInquiries: Inquiry[] = inquiries.map((inquiry: any) => {
      const user = userMap[inquiry.user_id]
      const inquiryAnswers = answers.filter(
        (answer: any) => answer.inquiry_id === inquiry.id
      )

      const formattedAnswers = inquiryAnswers.map((answer: any) => {
        const admin = adminMap[answer.admin_id] || { nickname: '관리자' }
        return {
          id: answer.id,
          content: answer.content,
          url: answer.url,
          created_at: answer.created_at,
          admin_id: answer.admin_id,
          inquiry_id: answer.inquiry_id,
          admin: {
            nickname: admin.nickname || '관리자',
          },
        }
      })

      return {
        id: inquiry.id,
        title: inquiry.title || '',
        content: inquiry.content || '',
        url: inquiry.url,
        status:
          inquiryAnswers.length > 0 ? 'answered' : inquiry.status || 'pending',
        created_at: inquiry.created_at,
        user_id: inquiry.user_id,
        user: {
          id: user?.id || '',
          email: user?.email || '',
          nickname: user?.nickname || '알 수 없음',
        },
        answers: formattedAnswers,
      }
    })

    return (
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">문의 게시판</h1>
          <Link
            href="/inquiry/new"
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <EditIcon className="h-4 w-4" />새 문의 작성
          </Link>
        </div>

        {/* 문의 프로세스 안내 */}
        <div className="mb-6">
          <div className="flex items-start gap-2 text-gray-500">
            <InquiryProcessModal />

            <p className="whitespace-pre-line">
              요청하신 공고 및 기업 프롬프트 분석은{' '}
              <span className="text-text-secondary">24시간 이내</span>에 검토 후
              답변해 드립니다.
              <br />
              <span className="text-text-secondary">30초</span>만 투자하여 맞춤
              공고 프롬프트를 받아보세요!
            </p>
          </div>
        </div>

        {/* 문의 목록 */}
        <Suspense fallback={<InquiryPageSkeleton />}>
          <InquiryList initialInquiries={combinedInquiries} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error loading inquiries:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          문의 목록을 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해
          주세요.
        </div>
      </div>
    )
  }
}
