import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { AdminService } from '@/services/admin.service'

const KOREAN_NAMES = [
  '권민성',
  '김대현',
  '김서현',
  '이상영',
  '김영한',
  '김철수',
  '이영희',
  '박민수',
  '최지우',
  '정다은',
  '한지민',
  '서준호',
  '유진아',
  '강하늘',
]
const ENGLISH_NAMES = [
  'highjune',
  'mungyun',
  'skywalker',
  'bluecat',
  'minty',
  'starfish',
  'rainbow',
  'sunnyday',
  'moonlight',
  'forest',
  'rivera',
  'mountain',
  'alice',
  'bob',
  'charlie',
  'david',
  'eve',
  'frank',
  'grace',
  'henry',
  'ivy',
  'jack',
]
const ENGLISH_NUM = [
  'mungyun1234',
  'bluecat22',
  'skywalker1',
  'forest99',
  'mountain2',
  'alice77',
  'bob2024',
  'charlie88',
  'david007',
  'eve999',
]

const KOREAN_NUM = ['박민수2024', '최지우88', '정다은007']

const MIXED = [
  'dev고수',
  '코딩왕',
  '프론트마스터',
  '백엔드짱',
  'AI초보',
  'React러버',
  'Next지기',
  'TypeScripter',
  '코딩하는곰',
  '데이터마스터',
]

function getRandomNickname() {
  const pools = [KOREAN_NAMES, ENGLISH_NAMES, ENGLISH_NUM, KOREAN_NUM, MIXED]
  const pool = pools[Math.floor(Math.random() * pools.length)]
  return pool[Math.floor(Math.random() * pool.length)]
}

export async function POST(req: NextRequest) {
  console.log('[add-test-users] API 호출 시작')
  
  try {
    // 관리자 권한 확인
    console.log('[add-test-users] 관리자 권한 확인 중...')
    const adminCheck = await AdminService.requireAdmin(req)
    if (adminCheck.error) {
      console.log('[add-test-users] 관리자 권한 없음')
      return adminCheck.error
    }
    console.log('[add-test-users] 관리자 권한 확인됨')

    const body = await req.json()
    console.log('[add-test-users] 요청 데이터:', body)
    
    const { count } = body
    if (!count || typeof count !== 'number' || count < 1 || count > 50) {
      console.log('[add-test-users] 잘못된 count 값:', count)
      return NextResponse.json(
        { error: '1~50 사이의 숫자를 입력하세요.' },
        { status: 400 }
      )
    }

    console.log('[add-test-users] Supabase Admin 클라이언트 생성 중...')
    console.log('[add-test-users] 환경 변수 확인:', {
      SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    })
    
    const supabase = createAdminClient()
    console.log('[add-test-users] Supabase Admin 클라이언트 생성 완료')
    let created = 0
    let errors: string[] = []

    for (let i = 0; i < count; i++) {
      const email = `test${Date.now()}_${Math.floor(Math.random() * 10000)}@test.test`
      // 안전한 랜덤 패스워드 생성 (환경 변수 사용 또는 랜덤 생성)
      const password = process.env.TEST_USER_PASSWORD || 
        `Test${Math.random().toString(36).substring(2, 10)}!${Date.now().toString().slice(-4)}`
      const nickname = getRandomNickname()
      
      try {
        // 1. 유저 생성 (이메일 인증)
        const { data: user, error } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { nickname },
        })
        
        if (error || !user?.user?.id) {
          console.error('User creation error:', error)
          errors.push(`${email}: ${error?.message || 'User creation failed'}`)
          continue
        }
        
        // 2. profiles에 추가 (is_test_user 필드 제거, 적절한 기본값 설정)
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: user.user.id,
            email,
            nickname,
            is_verified: true, // 테스트 유저는 검증된 상태로 생성
            is_admin: false,   // 테스트 유저는 일반 유저
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        
        if (profileError) {
          console.error('Profile creation error:', profileError)
          errors.push(`${email}: ${profileError.message}`)
          continue
        }
        
        created++
      } catch (userError) {
        console.error('Error creating user:', userError)
        errors.push(`${email}: ${userError instanceof Error ? userError.message : 'Unknown error'}`)
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { created, error: `${errors.length}명 실패: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}` },
        { status: created > 0 ? 200 : 500 } // 부분 성공시 200 반환
      )
    }
    return NextResponse.json({ created })
  } catch (error) {
    console.error('Error in add-test-users API:', error)
    return NextResponse.json(
      { error: `서버 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
