// 환경 변수 확인을 통한 조건부 로딩
const isProduction = process.env.NODE_ENV === 'production'
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export { GA_MEASUREMENT_ID }

// gtag 함수 존재 여부를 캐시
let gtagExists: boolean | null = null

const checkGtagExists = (): boolean => {
  if (gtagExists !== null) return gtagExists

  if (typeof window === 'undefined') {
    gtagExists = false
    return false
  }

  gtagExists = typeof window.gtag === 'function'
  return gtagExists
}

// 페이지뷰 추적 (메모이제이션 적용)
let lastPageview = ''
export const pageview = (url: string) => {
  // 프로덕션 환경이 아니거나 같은 URL이면 추적하지 않음
  if (!isProduction || !GA_MEASUREMENT_ID || url === lastPageview) return

  if (checkGtagExists()) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    })
    lastPageview = url
  }
}

// 이벤트 추적
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  if (!isProduction || !GA_MEASUREMENT_ID) return

  if (checkGtagExists()) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      non_interaction: false,
    })
  }
}

// 네비게이션 클릭 이벤트 추적 (디바운싱 적용)
let lastClickTime = 0
const DEBOUNCE_DELAY = 300

export const trackNavigationClick = (linkName: string, linkUrl: string) => {
  const now = Date.now()
  if (now - lastClickTime < DEBOUNCE_DELAY) return

  lastClickTime = now
  event({
    action: 'navigation_click',
    category: 'Navigation',
    label: `${linkName} (${linkUrl})`,
  })
}

// 체류 시간 추적 (최소 시간 필터링)
const MIN_ENGAGEMENT_TIME = 3 // 3초 이상만 추적
export const trackEngagement = (duration: number) => {
  if (duration < MIN_ENGAGEMENT_TIME) return

  event({
    action: 'engagement',
    category: 'User Engagement',
    label: 'Time on Page',
    value: duration,
  })
}
