import type { Job } from '@/types/job'
import companyPrompt from '@/templates/prompts/company.md'

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
    qualifications: [
      '대졸 이상 학력 소지자 (2025년 2월 졸업예정자 포함)',
      '영어 커뮤니케이션 가능자 (문서 작성 및 회화)',
      '해외여행에 결격사유가 없는 자',
      '병역필 또는 면제자 (남성의 경우)',
    ],
    preferredQualifications: [
      '금융/보험 관련 전공자',
      '컴퓨터 활용능력 우수자',
      '외국어 능력 우수자 (영어, 중국어 등)',
      '관련 자격증 보유자 (AFPK, CFP 등)',
    ],
    logoUrl: '/images/company/hanwha-life.png',
    url: 'https://www.hanwhalife.com/recruit',
    prompt: companyPrompt,
  },
  {
    id: '2',
    companyName: '네이버',
    jobTitle: '백엔드 개발자 모집',
    conditions: ['경력 3년↑', '학력무관', '성남'],
    qualifications: [
      '3년 이상의 백엔드 개발 경력 보유자',
      'Java/Spring 기반 서버 개발 경험',
      '대용량 트래픽 처리 경험',
      'SQL/NoSQL 데이터베이스 설계 및 최적화 경험',
      'RESTful API 설계 및 개발 경험',
    ],
    preferredQualifications: [
      '클라우드 환경(AWS, GCP 등) 기반 개발 경험',
      '마이크로서비스 아키텍처 설계 및 개발 경험',
      '오픈소스 프로젝트 기여 경험',
      'Kotlin, Go 등 추가 언어 활용 능력',
      '검색 엔진 관련 개발 경험',
    ],
    logoUrl: '/images/company/naver.jpg',
    url: 'https://www.naver.com',
    prompt: companyPrompt,
  },
  {
    id: '3',
    companyName: '현대오토에버',
    jobTitle: '자율주행 시스템 개발',
    conditions: ['경력', '석사이상', '화상면접가능'],
    qualifications: [
      '컴퓨터공학/전자공학/로보틱스 관련 석사 이상',
      '실시간 임베디드 시스템 개발 경험',
      'C/C++ 프로그래밍 능력',
      '리눅스 커널 및 디바이스 드라이버 개발 경험',
      'AUTOSAR, ISO 26262 표준 이해',
    ],
    preferredQualifications: [
      '자율주행 관련 프로젝트 경험',
      'ROS(Robot Operating System) 활용 경험',
      '딥러닝/머신러닝 알고리즘 활용 경험',
      '센서 퓨전(카메라, 라이다, 레이더 등) 경험',
      '관련 논문 게재 및 특허 보유자',
    ],
    logoUrl: '/images/company/hyundai-autoever.jpg',
    url: 'https://www.hyundai-autoever.com/recruit',
    prompt: companyPrompt,
  },
  {
    id: '4',
    companyName: '삼성전자',
    jobTitle: 'AI 엔지니어 채용',
    conditions: ['신입/경력', '수원'],
    qualifications: [
      '컴퓨터공학/인공지능 관련 학사 이상',
      '하나 이상의 프로그래밍 언어(Python, C++, Java 등) 능숙',
      '머신러닝/딥러닝 프레임워크(TensorFlow, PyTorch 등) 활용 경험',
      '데이터 분석 및 처리 능력',
    ],
    preferredQualifications: [
      'AI 관련 학회 논문 게재 경험',
      'Kaggle 등 AI 경진대회 참가 경험',
      '컴퓨터 비전, 자연어 처리, 음성인식 중 전문 분야 보유',
      '클라우드 환경에서 AI 서비스 개발 경험',
      '오픈소스 AI 프로젝트 기여 경험',
    ],
    logoUrl: '/images/company/samsung.jpg',
    url: 'https://www.samsung.com/recruit',
    prompt: companyPrompt,
  },
  {
    id: '5',
    companyName: 'LG전자',
    jobTitle: '배터리 연구원 모집',
    conditions: ['경력 5년↑', '박사우대', '대전'],
    qualifications: [
      '화학/재료공학/전기공학 관련 석사 이상(박사 우대)',
      '5년 이상의 리튬이온 배터리 연구 경험',
      '배터리 소재 분석 및 평가 경험',
      '배터리 안전성 및 성능 테스트 경험',
    ],
    preferredQualifications: [
      '배터리 관련 특허 및 논문 실적 보유자',
      '전고체 배터리 연구 경험',
      '대기업 배터리 연구소 근무 경험',
      '해외 연구소/대학 공동 연구 경험',
      '신소재 개발 및 적용 경험',
    ],
    logoUrl: '/images/company/lg.jpg',
    url: 'https://www.lg.com/recruit',
    prompt: companyPrompt,
  },
  {
    id: '6',
    companyName: '카카오뱅크',
    jobTitle: '프론트엔드 개발자',
    conditions: ['경력', '재택근무', '제주/판교'],
    qualifications: [
      '3년 이상의 프론트엔드 개발 경험',
      'JavaScript/TypeScript 능숙',
      'React, Vue 등 프론트엔드 프레임워크 활용 경험',
      'HTML5, CSS3 기반 웹표준 개발 능력',
      'RESTful API 연동 경험',
    ],
    preferredQualifications: [
      '금융 서비스 개발 경험',
      '모바일 웹/앱 개발 경험',
      '웹 성능 최적화 경험',
      'UX/UI 개선 경험',
      'GraphQL, Next.js 활용 경험',
      'Figma, Adobe XD 등 디자인 툴 활용 가능자',
    ],
    logoUrl: '/images/company/kakao-bank.jpg',
    url: 'https://www.kakao-bank.com/recruit',
    prompt: companyPrompt,
  },
]
