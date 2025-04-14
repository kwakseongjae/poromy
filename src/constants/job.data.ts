import type { Job } from '@/types/job'

/**
 * Job data
 * Array containing job posting information from various companies
 * @property {string} id - Unique identifier for the job posting
 * @property {string} companyName - Name of the company
 * @property {string} jobTitle - Title of the job position
 * @property {string[]} conditions - Job requirements (experience, education, location, etc.)
 * @property {string} logoUrl - URL of the company logo image
 */
export const jobs: Job[] = [
  {
    id: '1',
    companyName: '한화생명',
    jobTitle: '신규사원 모집',
    conditions: ['신입', '대졸', '서울'],
    logoUrl: '/images/company/hanwha-life.png',
    url: 'https://www.hanwhalife.com/recruit',
  },
  {
    id: '2',
    companyName: '네이버',
    jobTitle: '백엔드 개발자 모집',
    conditions: ['경력 3년↑', '학력무관', '성남'],
    logoUrl: '/images/company/naver.jpg',
    url: 'https://www.naver.com',
  },
  {
    id: '3',
    companyName: '현대오토에버',
    jobTitle: '자율주행 시스템 개발',
    conditions: ['경력', '석사이상', '화상면접가능'],
    logoUrl: '/images/company/hyundai-autoever.jpg',
    url: 'https://www.hyundai-autoever.com/recruit',
  },
  {
    id: '4',
    companyName: '삼성전자',
    jobTitle: 'AI 엔지니어 채용',
    conditions: ['신입/경력', '수원'],
    logoUrl: '/images/company/samsung.jpg',
    url: 'https://www.samsung.com/recruit',
  },
  {
    id: '5',
    companyName: 'LG전자',
    jobTitle: '배터리 연구원 모집',
    conditions: ['경력 5년↑', '박사우대', '대전'],
    logoUrl: '/images/company/lg.jpg',
    url: 'https://www.lg.com/recruit',
  },
  {
    id: '6',
    companyName: '카카오뱅크',
    jobTitle: '프론트엔드 개발자',
    conditions: ['경력', '재택근무', '제주/판교'],
    logoUrl: '/images/company/kakao-bank.jpg',
    url: 'https://www.kakao-bank.com/recruit',
  },
]
