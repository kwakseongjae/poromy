import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getUserFromSession, getClaims } from './supabase-auth-helpers'

// 📈 성능 최적화: 전역 클라이언트 캐싱으로 Cold Start 방지
let cachedServerClient: any = null
let cachedAdminClient: any = null

export async function createClient() {
  // 미들웨어와 서버 컴포넌트에서는 매번 새로운 클라이언트 생성
  // 캐싱을 제거하여 각 요청마다 올바른 쿠키 정보를 사용하도록 함

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

  // 캐싱 제거 - 각 요청마다 새로운 클라이언트 생성
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
 * Performance-optimized version of getUser that uses JWT claims when possible
 * This avoids a network round trip when we only need basic user info
 * 
 * @param forceRefresh - Force a fresh fetch from the server (default: false)
 * @returns User object from JWT claims or fresh from server
 */
export async function getOptimizedUser(forceRefresh: boolean = false) {
  const supabase = await createClient()

  try {
    // First, try to get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return null
    }

    // If not forcing refresh, try to get user from JWT claims
    if (!forceRefresh) {
      const userFromJWT = getUserFromSession(session)
      if (userFromJWT) {
        return userFromJWT
      }
    }

    // If we need fresh data or JWT parsing failed, fall back to getUser()
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
 * Get JWT claims directly without making a network call
 * Useful for checking custom claims, roles, permissions, etc.
 */
export async function getOptimizedClaims() {
  const supabase = await createClient()

  try {
    // Get the session which contains the JWT
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return null
    }

    return getClaims(session)
  } catch (error) {
    console.error('Failed to get claims:', error)
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
