import type { JobType } from '@/types/job'

/**
 * Get the display name for a job type in Korean
 */
export const getJobTypeDisplayName = (jobType: JobType): string => {
  const displayNames: Record<JobType, string> = {
    'IT-개발': 'IT/개발',
    'AI-데이터': 'AI/데이터',
    게임: '게임',
    디자인: '디자인',
    '기획-전략': '기획/전략',
    '마케팅-광고': '마케팅/광고',
    '상품기획-MD': '상품기획/MD',
    영업: '영업',
    '무역-물류': '무역/물류',
    '운송-배송': '운송/배송',
    '법률-법무': '법률/법무',
    'HR-총무': 'HR/총무',
    '회계-재무-세무': '회계/재무/세무',
    '증권-운용': '증권/운용',
    '은행-카드-보험': '은행/카드/보험',
    '엔지니어링-R&D': '엔지니어링/R&D',
    '건설-건축': '건설/건축',
    '생산-기능직': '생산/기능직',
    '의료-보건': '의료/보건',
    '공공-복지': '공공/복지',
    교육: '교육',
    '미디어-엔터': '미디어/엔터',
    '고객상담-TM': '고객상담/TM',
    서비스: '서비스',
    식음료: '식음료',
  }
  return displayNames[jobType] || jobType
}

/**
 * Format deadline string to Korean format
 */
export const formatDeadline = (deadline: string): string => {
  if (deadline === '상시 채용' || deadline === '마감') return deadline

  // YYYY-MM-DD 또는 YYYY-MM-DD HH:mm 형태 지원
  const dateMatch = deadline.match(
    /(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/
  )
  if (!dateMatch) return deadline

  const [, , month, day, hour, minute] = dateMatch
  const monthNum = Number(month)
  const dayNum = Number(day)
  let result = `${monthNum}월 ${dayNum}일`

  if (hour && minute) {
    result += ` ${hour}:${minute}`
  }

  return result
}

/**
 * Calculate D-day label for deadline
 */
export const getDeadlineLabel = (deadline: string): string => {
  if (deadline === '상시 채용') return '상시채용'

  const now = new Date()
  const end = new Date(deadline)

  if (now > end) return '마감'

  // 날짜가 오늘이고, 아직 마감 시간이 안 지났으면 D-0
  const isSameDay =
    now.getFullYear() === end.getFullYear() &&
    now.getMonth() === end.getMonth() &&
    now.getDate() === end.getDate()

  if (isSameDay) return 'D-0'

  // 미래면 D-n
  const todayMidnight = new Date(now)
  todayMidnight.setHours(0, 0, 0, 0)
  const endMidnight = new Date(end)
  endMidnight.setHours(0, 0, 0, 0)
  const diff = Math.ceil(
    (endMidnight.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24)
  )
  return `D-${diff}`
}

/**
 * Check if a job is new (uploaded within 24 hours)
 */
export const isJobNew = (uploadedAt: string): boolean => {
  const uploadedAtDate = new Date(uploadedAt)
  const now = new Date()
  const diffMs = now.getTime() - uploadedAtDate.getTime()
  return diffMs >= 0 && diffMs < 24 * 60 * 60 * 1000
}
