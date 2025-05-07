export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// 페이지뷰 추적
export const pageview = (url: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID!, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    })
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
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      non_interaction: false,
    })
  }
}

// 네비게이션 클릭 이벤트 추적
export const trackNavigationClick = (linkName: string, linkUrl: string) => {
  event({
    action: 'navigation_click',
    category: 'Navigation',
    label: `${linkName} (${linkUrl})`,
  })
}

// 체류 시간 추적
export const trackEngagement = (duration: number) => {
  event({
    action: 'engagement',
    category: 'User Engagement',
    label: 'Time on Page',
    value: duration,
  })
}
