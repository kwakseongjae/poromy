'use client'
import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import InquiryCard from '@/components/inquiry/InquiryCard'
import { Inquiry } from '@/types/inquiry'
import { useSupabase } from '@/contexts/SupabaseContext'
import Link from 'next/link'
import SearchBar from '@/components/common/SearchBar'
import { useSearchParams } from 'next/navigation'

interface InquiryListProps {
  initialInquiries: Inquiry[]
}

export default function InquiryList({ initialInquiries }: InquiryListProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered' | 'my'>(
    'all'
  )
  const supabase = createBrowserSupabaseClient()
  const { user } = useSupabase()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('query') || ''

  // 관리자 상태 확인
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  // 관리자 권한 확인
  useEffect(() => {
    if (!user) {
      setIsAdmin(false)
      return
    }

    supabase
      .from('administrators')
      .select('id')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setIsAdmin(Boolean(data)))
  }, [user, supabase])

  // 컴포넌트 마운트 시 초기 데이터 설정
  useEffect(() => {
    setInquiries(initialInquiries || [])
  }, [initialInquiries])

  // 필터링된 문의 목록
  const filteredInquiries = inquiries.filter((inquiry) => {
    // 검색어 필터링
    const matchesSearch = searchQuery
      ? inquiry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inquiry.url &&
          inquiry.url.toLowerCase().includes(searchQuery.toLowerCase()))
      : true

    // 상태 필터링
    if (filter === 'all') return matchesSearch
    if (filter === 'pending')
      return inquiry.status === 'pending' && matchesSearch
    if (filter === 'answered')
      return inquiry.status === 'answered' && matchesSearch
    if (filter === 'my') return inquiry.user_id === user?.id && matchesSearch
    return matchesSearch
  })

  // 모든 사용자가 모든 문의를 볼 수 있도록 수정
  const visibleInquiries = filteredInquiries

  // 답변 추가 후 목록 갱신
  const handleAnswerAdded = async (inquiryId: string) => {
    try {
      // 1. 기본 문의 정보 가져오기
      const { data: inquiryData, error: inquiryError } = await supabase
        .from('inquiries')
        .select('id, title, content, url, status, created_at, user_id')
        .eq('id', inquiryId)
        .single()

      if (inquiryError || !inquiryData) {
        console.error('문의 정보 조회 오류:', inquiryError)
        return
      }

      // 2. 사용자 정보 가져오기
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email, nickname')
        .eq('id', inquiryData.user_id)
        .single()

      if (userError) {
        console.error('사용자 정보 조회 오류:', userError)
      }

      // 3. 답변 목록 가져오기
      const { data: answersData, error: answersError } = await supabase
        .from('answers')
        .select('id, content, url, created_at, admin_id, inquiry_id')
        .eq('inquiry_id', inquiryId)

      if (answersError) {
        console.error('답변 목록 조회 오류:', answersError)
      }

      // 4. 관리자 정보 가져오기
      const adminIds = [
        ...new Set((answersData || []).map((answer) => answer.admin_id)),
      ]
      const { data: adminData } =
        adminIds.length > 0
          ? await supabase
              .from('profiles')
              .select('id, nickname')
              .in('id', adminIds)
          : { data: [] }

      // 5. 답변에 관리자 정보 추가
      const formattedAnswers = (answersData || []).map((answer) => {
        const admin = (adminData || []).find(
          (profile) => profile.id === answer.admin_id
        )
        return {
          ...answer,
          admin: {
            nickname: admin?.nickname || '관리자',
          },
        }
      })

      // 6. 상태 업데이트 (답변이 있으면 'answered'로 설정)
      if (formattedAnswers.length > 0 && inquiryData.status === 'pending') {
        await supabase
          .from('inquiries')
          .update({ status: 'answered' })
          .eq('id', inquiryId)

        inquiryData.status = 'answered'
      }

      // 7. 갱신된 문의 객체 생성
      const updatedInquiry = {
        ...inquiryData,
        user: {
          email: userData?.email || '',
          nickname: userData?.nickname || '알 수 없음',
        },
        answers: formattedAnswers,
      }

      // 8. 상태 업데이트
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === inquiryId ? (updatedInquiry as Inquiry) : item
        )
      )
    } catch (error) {
      console.error('문의 갱신 중 오류 발생:', error)
    }
  }

  return (
    <div>
      {/* 필터 버튼과 검색바 */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-md px-3 py-2 text-sm ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            전체 ({inquiries.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`rounded-md px-3 py-2 text-sm ${
              filter === 'pending'
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            답변 대기중 (
            {inquiries.filter((i) => i.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('answered')}
            className={`rounded-md px-3 py-2 text-sm ${
              filter === 'answered'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            답변 완료 ({inquiries.filter((i) => i.status === 'answered').length}
            )
          </button>
          {user && (
            <button
              onClick={() => setFilter('my')}
              className={`rounded-md px-3 py-2 text-sm ${
                filter === 'my'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              내 문의 ({inquiries.filter((i) => i.user_id === user.id).length})
            </button>
          )}
        </div>
        <div className="hidden flex-1 sm:block">
          <SearchBar placeholder="관심있는 채용공고 URL, 직무 또는 기업을 검색해보세요" />
        </div>
        <div className="w-full min-w-[300px] flex-1 sm:hidden">
          <SearchBar
            placeholder="관심있는 채용공고 URL, 직무 또는 기업을 검색해보세요"
            size="large"
          />
        </div>
      </div>

      {/* 문의 목록 */}
      {visibleInquiries.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleInquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">
            {filter === 'all'
              ? '등록된 문의가 없습니다.'
              : filter === 'pending'
                ? '대기 중인 문의가 없습니다.'
                : filter === 'answered'
                  ? '답변 완료된 문의가 없습니다.'
                  : '내 문의가 없습니다.'}
          </p>
          {filter !== 'all' && (
            <Link
              href="/inquiry/new"
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              새로운 문의를 등록해 보세요!
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
