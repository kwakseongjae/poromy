/**
 * Job type definition
 * Represents a job posting entity with its properties
 */
export type Job = {
  id: string
  companyName: string
  jobTitle: string
  conditions: string[]
  positionDescription: string
  mainTask: string
  qualifications: string[]
  preferredQualifications: string[]
  logoUrl: string
  url: string
  prompt: () => Promise<string>
  uploadedAt: string // ISO date string
  deadline: string // ISO date string or '상시 채용'
  jobType: JobType
}

export type JobType =
  | 'IT-개발'
  | 'AI-데이터'
  | '게임'
  | '디자인'
  | '기획-전략'
  | '마케팅-광고'
  | '상품기획-MD'
  | '영업'
  | '무역-물류'
  | '운송-배송'
  | '법률-법무'
  | 'HR-총무'
  | '회계-재무-세무'
  | '증권-운용'
  | '은행-카드-보험'
  | '엔지니어링-R&D'
  | '건설-건축'
  | '생산-기능직'
  | '의료-보건'
  | '공공-복지'
  | '교육'
  | '미디어-엔터'
  | '고객상담-TM'
  | '서비스'
  | '식음료'
