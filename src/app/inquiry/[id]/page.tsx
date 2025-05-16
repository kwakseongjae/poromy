import { notFound } from 'next/navigation'
import LinkPreview from '@/components/LinkPreview'
import AnswerForm from '@/components/inquiry/AnswerForm'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import Image from 'next/image'
import { AdminProfileImage, LinkIcon } from '@/assets'
import { formatDate } from '@/utils/date'

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
  }
  answers?: Answer[]
}

// 정적 파라미터 생성
export async function generateStaticParams() {
  const supabase = createBrowserSupabaseClient()

  const { data: inquiries } = await supabase.from('inquiries').select('id')

  return (
    inquiries?.map((inquiry) => ({
      id: inquiry.id,
    })) || []
  )
}

// 동적 라우트 설정
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function InquiryDetailPage({
  params,
}: InquiryDetailPageProps) {
  const { id } = await params
  const supabase = createBrowserSupabaseClient()

  try {
    // 문의 정보 가져오기
    const { data: inquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single()

    if (inquiryError || !inquiry) {
      console.error('Error fetching inquiry:', inquiryError)
      notFound()
    }

    // 사용자 정보 가져오기
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('nickname, email')
      .eq('id', inquiry.user_id)
      .single()

    // 답변 정보 가져오기
    const { data: answers, error: answersError } = await supabase
      .from('answers')
      .select('*, profiles!admin_id(nickname)')
      .eq('inquiry_id', id)
      .order('created_at', { ascending: true })

    if (answersError) {
      console.error('Error fetching answers:', answersError)
    }

    // 답변이 있는 경우 문의 상태 업데이트
    if (answers && answers.length > 0 && inquiry.status === 'pending') {
      await supabase
        .from('inquiries')
        .update({ status: 'answered' })
        .eq('id', id)
      inquiry.status = 'answered'
    }

    // 응답 구조 변환
    const formattedInquiry = {
      ...inquiry,
      user: {
        nickname: userProfile?.nickname || '사용자',
        email: userProfile?.email,
      },
      answers: (answers || []).map((answer) => ({
        ...answer,
        admin: {
          nickname: answer.profiles?.nickname || '관리자',
        },
      })),
    }

    // 렌더링 로직
    return (
      <article className="mx-auto max-w-3xl px-4 py-8">
        {/* 헤더 */}
        <header className="mb-8">
          <h1 className="mb-4 text-3xl font-bold">{formattedInquiry.title}</h1>
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
          {/* 링크 프리뷰 */}
          {formattedInquiry.url && (
            <div className="my-8">
              <LinkPreview url={formattedInquiry.url} />
            </div>
          )}
          <div className="whitespace-pre-wrap">{formattedInquiry.content}</div>
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
            {formattedInquiry.answers && formattedInquiry.answers.length > 0 ? (
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
                    <div className="mt-2">
                      <a
                        href={answer.url}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        target={answer.url.startsWith('/') ? '_self' : '_blank'}
                        rel={
                          answer.url.startsWith('/')
                            ? ''
                            : 'noopener noreferrer'
                        }
                        tabIndex={0}
                        aria-label={`링크: ${answer.url}`}
                      >
                        <LinkIcon className="h-4 w-4" />
                        <span className="break-all">{answer.url}</span>
                      </a>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500">
                등록된 답변이 없습니다.
              </p>
            )}
          </div>
        </div>
      </article>
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    notFound()
  }
}
