import type { Job, JobType } from '@/types/job'
import { getPositionPrompt } from '@/utils/prompt'

/**
 * Job data
 * Array containing job posting information from various companies
 * @property {string} id - Unique identifier for the job posting
 * @property {string} companyName - Name of the company
 * @property {string} jobTitle - Title of the job position
 * @property {string[]} conditions - Job requirements (experience, education, location, etc.)
 * @property {string} logoUrl - URL of the company logo image
 * @property {JobType} jobType - Category of the job based on the field/domain
 * @property {string} uploadedAt - Date and time when the job posting was uploaded
 * @property {string} deadline - Date and time when the job posting will be closed
 * @property {string} positionDescription - Description of the job position
 * @property {string} mainTask - Main tasks of the job position
 * @property {string[]} qualifications - Qualifications required for the job position
 * @property {string[]} preferredQualifications - Preferred qualifications for the job position
 */
export const jobs = []

// Helper function to get display name for job type
export const getJobTypeDisplayName = (jobType: JobType) => {
  const displayNames: Record<JobType, string> = {
    'IT-개발': 'IT·개발',
    'AI-데이터': 'AI·데이터',
    게임: '게임',
    디자인: '디자인',
    '기획-전략': '기획·전략',
    '마케팅-광고': '마케팅·광고',
    '상품기획-MD': '상품기획·MD',
    영업: '영업',
    '무역-물류': '무역·물류',
    '운송-배송': '운송·배송',
    '법률-법무': '법률·법무',
    'HR-총무': 'HR·총무',
    '회계-재무-세무': '회계·재무·세무',
    '증권-운용': '증권·운용',
    '은행-카드-보험': '은행·카드·보험',
    '엔지니어링-R&D': '엔지니어링·R&D',
    '건설-건축': '건설·건축',
    '생산-기능직': '생산·기능직',
    '의료-보건': '의료·보건',
    '공공-복지': '공공·복지',
    교육: '교육',
    '미디어-엔터': '미디어·엔터',
    '고객상담-TM': '고객상담·TM',
    서비스: '서비스',
    식음료: '식음료',
  }
  return displayNames[jobType] || jobType
}
