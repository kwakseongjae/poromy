import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

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
  const { count } = await req.json()
  if (!count || typeof count !== 'number' || count < 1 || count > 50) {
    return NextResponse.json(
      { error: '1~50 사이의 숫자를 입력하세요.' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()
  let created = 0
  let errors: string[] = []

  for (let i = 0; i < count; i++) {
    const email = `test${Date.now()}_${Math.floor(Math.random() * 10000)}@test.test`
    const password = 'tjdwls5013'
    const nickname = getRandomNickname()
    // 1. 유저 생성 (이메일 인증)
    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nickname },
    })
    if (error || !user?.user?.id) {
      errors.push(email)
      continue
    }
    // 2. profiles에 추가
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: user.user.id,
        email,
        nickname,
        is_test_user: true,
      },
    ])
    if (profileError) {
      errors.push(email)
      continue
    }
    created++
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { created, error: `${errors.length}명 실패: ${errors.join(', ')}` },
      { status: 500 }
    )
  }
  return NextResponse.json({ created })
}
