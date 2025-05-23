import { notFound } from 'next/navigation'
import LinkPreview from '@/components/LinkPreview'
import AnswerForm from '@/components/inquiry/AnswerForm'
import { createClient } from '@/lib/supabase-server'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import Image from 'next/image'
import { AdminProfileImage, LinkIcon } from '@/assets'
import { formatDate } from '@/utils/date'
import { Suspense } from 'react'

interface InquiryDetailPageProps {
  params: Promise<{
    id: string
  }>
}

interface Answer {
  id: string
  inquiry_id: string
  admin_id: string
  content: string
  url: string | null
  created_at: string
  profiles?: {
    nickname: string | null
  }
  admin?: {
    nickname: string
  }
}

interface Inquiry {
  id: string
  user_id: string
  title: string
  content: string
  status: string
  created_at: string
  url: string | null
  profiles?: {
    nickname: string | null
  }
  user?: {
    nickname: string
    email?: string
  }
  answers?: Answer[]
}

// Static params generation with optimizations
export async function generateStaticParams() {
  const supabase = createBrowserSupabaseClient()
  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(100) // 최근 100개만 미리 빌드

  return (
    inquiries?.map((inquiry: any) => ({
      id: inquiry.id,
    })) || []
  )
}

// 동적 라우트 설정 - ISR 활용
export const dynamic = 'auto'
export const revalidate = 300 // 5분마다 재검증

// 데이터 fetching 최적화 함수
const fetchInquiryData = async (supabase: any, id: string) => {
  // 문의와 답변 데이터를 병렬로 가져오기
  const [
    { data: inquiry, error: inquiryError },
    { data: answers, error: answersError },
  ] = await Promise.all([
    supabase.from('inquiries').select('*').eq('id', id).single(),
    supabase
      .from('answers')
      .select('*, profiles!admin_id(nickname)')
      .eq('inquiry_id', id)
      .order('created_at', { ascending: true }),
  ])

  if (inquiryError || !inquiry) {
    return null
  }

  // 사용자 정보와 관리자 정보를 병렬로 가져오기
  const adminIds =
    answers?.map((answer: any) => answer.admin_id).filter(Boolean) || []

  const [{ data: userProfile }, { data: adminProfiles }] = await Promise.all([
    supabase
      .from('profiles')
      .select('nickname, email')
      .eq('id', inquiry.user_id)
      .single(),
    adminIds.length > 0
      ? supabase.from('profiles').select('id, nickname').in('id', adminIds)
      : { data: [] },
  ])

  // 답변이 있으면 상태 업데이트
  if (answers && answers.length > 0 && inquiry.status === 'pending') {
    await supabase.from('inquiries').update({ status: 'answered' }).eq('id', id)
    inquiry.status = 'answered'
  }

  // 관리자 프로필 맵 생성
  const adminProfileMap = (adminProfiles || []).reduce(
    (map: any, profile: any) => {
      map[profile.id] = profile
      return map
    },
    {} as Record<string, any>
  )

  return {
    ...inquiry,
    user: {
      nickname: userProfile?.nickname || '사용자',
      email: userProfile?.email,
    },
    answers: (answers || []).map((answer: any) => ({
      ...answer,
      admin: {
        nickname:
          adminProfileMap[answer.admin_id]?.nickname ||
          answer.profiles?.nickname ||
          '관리자',
      },
    })),
  }
}

// 로딩 컴포넌트
const InquiryDetailSkeleton = () => (
  <article className="mx-auto max-w-3xl px-4 py-8">
    <header className="mb-8">
      <div className="mb-4 h-8 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="flex items-center gap-4">
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
      </div>
    </header>
    <div className="space-y-4">
      <div className="h-32 w-full animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
    </div>
  </article>
)

export default async function InquiryDetailPage({
  params,
}: InquiryDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  try {
    const formattedInquiry = await fetchInquiryData(supabase, id)

    if (!formattedInquiry) {
      notFound()
    }

    return (
      <Suspense fallback={<InquiryDetailSkeleton />}>
        <article className="mx-auto max-w-3xl px-4 py-8">
          {/* 헤더 */}
          <header className="mb-8">
            <h1 className="mb-4 text-3xl font-bold">
              {formattedInquiry.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{formattedInquiry.user?.nickname}</span>
              <span>·</span>
              <time dateTime={formattedInquiry.created_at}>
                {formatDate(formattedInquiry.created_at)}
              </time>
              <span>·</span>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  formattedInquiry.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {formattedInquiry.status === 'pending' ? '대기중' : '답변완료'}
              </span>
            </div>
          </header>

          {/* 본문 */}
          <div className="prose prose-lg max-w-none">
            {/* 링크 프리뷰 - Suspense로 감싸서 독립적 로딩 */}
            {formattedInquiry.url && (
              <Suspense
                fallback={
                  <div className="my-8 h-32 animate-pulse rounded-lg bg-gray-100" />
                }
              >
                <div className="my-8">
                  <LinkPreview url={formattedInquiry.url} />
                </div>
              </Suspense>
            )}
            <div className="whitespace-pre-wrap">
              {formattedInquiry.content}
            </div>
          </div>

          {/* 구분선 */}
          <div className="my-8 h-[1px] bg-gray-200" />

          {/* 답변 섹션 */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">답변</h2>

            {/* 답변 작성 폼 */}
            <AnswerForm
              inquiryId={formattedInquiry.id}
              userEmail={formattedInquiry.user.email || ''}
              inquiryTitle={formattedInquiry.title}
              userNickname={formattedInquiry.user.nickname}
            />

            {/* 답변 리스트 */}
            <div className="mt-6 space-y-4">
              {formattedInquiry.answers &&
              formattedInquiry.answers.length > 0 ? (
                formattedInquiry.answers.map((answer: Answer) => (
                  <div key={answer.id} className="rounded-lg bg-[#F9FAFB] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={AdminProfileImage}
                          alt={answer.admin?.nickname || '관리자'}
                          width={40}
                          height={40}
                          className="aspect-square h-10 w-10 rounded-full object-cover shadow-md"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {answer.admin?.nickname}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(answer.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm whitespace-pre-wrap text-gray-700">
                      {answer.content}
                    </div>
                    {answer.url && (
                      <div className="mt-2 flex items-center text-sm text-blue-600">
                        <LinkIcon className="mr-1 h-4 w-4" />
                        <a
                          href={answer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          참고 링크
                        </a>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-lg bg-gray-50 p-4 text-center text-gray-500">
                  아직 답변이 없습니다.
                </div>
              )}
            </div>
          </div>
        </article>
      </Suspense>
    )
  } catch (error) {
    console.error('Error loading inquiry:', error)
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          문의를 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해 주세요.
        </div>
      </div>
    )
  }
}
