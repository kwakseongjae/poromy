import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import InquiryList from '@/components/inquiry/InquiryList'
import { Inquiry } from '@/types/inquiry'
import { EditIcon } from '@/assets'
import { InquiryProcessModal } from '@/components/inquiry/InquiryProcessModal'

interface Profile {
  id: string
  email: string
  nickname: string
}

interface AdminProfile {
  id: string
  nickname: string
}

export default async function InquiriesPage() {
  const supabase = await createClient()

  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 관리자 확인
  let isAdmin = false
  if (user) {
    const { data: adminData } = await supabase
      .from('administrators')
      .select('id')
      .eq('id', user.id)
      .single()

    isAdmin = Boolean(adminData)
  }

  // 문의 목록 가져오기
  const { data: inquiries, error: inquiriesError } = await supabase
    .from('inquiries')
    .select('id, title, content, url, status, created_at, user_id')
    .order('created_at', { ascending: false })

  if (inquiriesError) {
    console.error('문의 목록 조회 오류:', inquiriesError)
    return (
      <div className="p-6">문의 목록을 불러오는 중 오류가 발생했습니다</div>
    )
  }

  // 사용자 정보 가져오기 (profiles에서 먼저 시도, 없으면 auth.users에서 가져옴)
  const userIds = [
    ...new Set(inquiries?.map((inquiry) => inquiry.user_id) || []),
  ]

  // profiles 테이블에서 조회
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, nickname')
    .in('id', userIds.length > 0 ? userIds : ['no-id'])

  // auth.users 테이블에서도 조회
  const { data: authUsers, error: authUsersError } = await supabase
    .from('auth.users')
    .select('id, email, raw_user_meta_data')
    .in('id', userIds.length > 0 ? userIds : ['no-id'])

  // 두 데이터 소스를 결합
  const combinedProfiles = []
  for (const userId of userIds) {
    // 먼저 profiles 테이블에서 찾기
    const profile = profiles?.find((p) => p.id === userId)
    if (profile) {
      combinedProfiles.push(profile)
      continue
    }

    // profiles에 없으면 auth.users에서 찾기
    const authUser = authUsers?.find((u) => u.id === userId)
    if (authUser) {
      combinedProfiles.push({
        id: authUser.id,
        email: authUser.email,
        nickname: authUser.raw_user_meta_data?.nickname || '사용자',
      })
    } else {
      // 둘 다 없으면 기본값 제공
      combinedProfiles.push({
        id: userId,
        email: '정보 없음',
        nickname: `사용자 ${userId.substring(0, 5)}...`,
      })
    }
  }

  // userMap 생성
  const userMap = combinedProfiles.reduce<Record<string, Profile>>(
    (map, profile) => {
      map[profile.id] = profile
      return map
    },
    {}
  )

  // 답변 정보 가져오기
  const inquiryIds = inquiries?.map((inquiry) => inquiry.id) || []

  const { data: answers, error: answersError } = await supabase
    .from('answers')
    .select('id, content, url, created_at, admin_id, inquiry_id')
    .in('inquiry_id', inquiryIds.length > 0 ? inquiryIds : [])

  if (answersError) {
    console.error('답변 정보 조회 오류:', answersError)
    return (
      <div className="p-6">답변 정보를 불러오는 중 오류가 발생했습니다</div>
    )
  }

  // 답변이 있는 문의 상태 업데이트
  for (const inquiry of inquiries || []) {
    const hasAnswers = answers?.some(
      (answer) => answer.inquiry_id === inquiry.id
    )

    if (hasAnswers && inquiry.status === 'pending') {
      await supabase
        .from('inquiries')
        .update({ status: 'answered' })
        .eq('id', inquiry.id)

      inquiry.status = 'answered'
    }
  }

  // 관리자 정보 가져오기
  const adminIds = [...new Set(answers?.map((answer) => answer.admin_id) || [])]

  const { data: adminProfiles, error: adminProfilesError } = await supabase
    .from('profiles')
    .select('id, nickname')
    .in('id', adminIds.length > 0 ? adminIds : [])

  if (adminProfilesError) {
    console.error('관리자 정보 조회 오류:', adminProfilesError)
    return (
      <div className="p-6">관리자 정보를 불러오는 중 오류가 발생했습니다</div>
    )
  }

  // 관리자 맵 생성 (ID로 빠른 조회)
  const adminMap = (adminProfiles || []).reduce<Record<string, AdminProfile>>(
    (map, profile) => {
      map[profile.id] = profile
      return map
    },
    {}
  )

  // 데이터 조합
  const combinedInquiries: Inquiry[] = (inquiries || []).map((inquiry) => {
    // 사용자 정보 가져오기
    const user = userMap[inquiry.user_id]

    // 답변 정보 가져오기 및 가공
    const inquiryAnswers = (answers || []).filter(
      (answer) => answer.inquiry_id === inquiry.id
    )

    const formattedAnswers = inquiryAnswers.map((answer) => {
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

    // 완성된 문의 객체 반환
    const combinedInquiry: Inquiry = {
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
      answers: formattedAnswers || [],
    }

    return combinedInquiry
  })

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">분석요청 목록</h1>
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
        <Link
          href="/inquiry/new"
          className="flex items-center rounded-md bg-[#3182f6] px-4 py-2 whitespace-nowrap text-white transition-colors hover:bg-blue-600 hover:text-gray-200"
        >
          <EditIcon className="mr-1 h-5 w-5" />새 문의 등록
        </Link>
      </div>

      <InquiryList initialInquiries={combinedInquiries} />
    </div>
  )
}
