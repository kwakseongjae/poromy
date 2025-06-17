import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// 📈 성능 최적화: 전역 클라이언트 캐싱으로 Cold Start 방지
let cachedServerClient: any = null
let cachedAdminClient: any = null

export async function createClient() {
  // 이미 생성된 클라이언트가 있다면 재사용 (연결 재활용)
  if (cachedServerClient) {
    return cachedServerClient
  }

  const cookieStore = await cookies()

  const client = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'X-Timezone': 'Asia/Seoul',
          Connection: 'keep-alive', // 연결 재사용
        },
      },
      // 📊 성능 최적화 설정
      auth: {
        persistSession: false, // 서버에서 세션 지속성 비활성화
        autoRefreshToken: false, // 자동 토큰 갱신 비활성화 (서버용)
      },
    }
  )

  // 클라이언트 캐싱 (동일한 요청 사이클에서 재사용)
  cachedServerClient = client
  return client
}

export const createAdminClient = () => {
  // 관리자 클라이언트도 캐싱으로 재사용
  if (cachedAdminClient) {
    return cachedAdminClient
  }

  const client = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'X-Timezone': 'Asia/Seoul',
          Connection: 'keep-alive', // 연결 재사용
        },
      },
      // 📈 성능 최적화: 관리자 클라이언트 설정
      realtime: {
        params: {
          eventsPerSecond: 10, // 실시간 이벤트 제한으로 성능 향상
        },
      },
    }
  )

  cachedAdminClient = client
  return client
}

export async function getUser() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Auth error:', error)
      return null
    }
    return data.user
  } catch (error) {
    console.error('Failed to get user:', error)
    return null
  }
}

/**
 * 📊 연결 캐시 초기화 함수 (필요 시 사용)
 * 개발 환경에서 hot reload 시 캐시 초기화에 활용
 */
export function clearConnectionCache() {
  cachedServerClient = null
  cachedAdminClient = null
}
