import type { Job } from '@/types/job'
import { getPositionPrompt } from '@/utils/prompt'

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
    companyName: '크리에이트립',
    jobTitle: '프론트엔드 엔지니어',
    conditions: ['프론트엔드', '경력 2-5년', '서울 강남구'],
    positionDescription:
      '글로벌 K-콘텐츠&커머스 플랫폼에서 프론트엔드 개발을 담당합니다. 월 활성사용자 130만 명을 보유한 No.1 K-플랫폼에서 React, Next.js 등 최신 기술을 활용한 웹 서비스 개발 업무를 수행합니다.',
    mainTask:
      '스쿼드에서 서비스 프론트엔드 개발 및 운영, 또는 코어팀에서 DX(Developer Experience) 향상 업무를 담당합니다. React, Next.js 등 최신 프론트엔드 기술을 활용한 웹 서비스 개발, LLM 등 AI 기술을 활용한 PoC 및 DX 개선 실험, 팀원들과의 적극적인 협업 및 코드 리뷰, 기술 문서화 업무를 수행합니다.',
    qualifications: [
      '2~5년 이상의 프론트엔드 개발 경력(혹은 그에 준하는 실력)',
      'React 및 Next.js 기반의 서비스 개발 경험',
      'tailwindcss, styled-components 등 CSS-in-JS 또는 유틸리티 퍼스트 CSS 프레임워크 경험',
      'vite, storybook 등 프론트엔드 개발 생산성 도구 사용 경험',
      'Git 기반 협업 및 코드 리뷰, 테스트 코드 작성 경험',
      '빠르게 변화하는 환경에 유연하게 적응하고, 실험을 두려워하지 않는 마인드셋',
      '다양한 의견을 경청하며, 논리적이고 주도적으로 문제를 해결하는 능력',
      '동료와의 원활한 커뮤니케이션을 통한 지식 공유에 적극적인 자세',
    ],
    preferredQualifications: [
      'GraphQL, Apollo Client를 활용한 데이터 연동 경험',
      '오픈소스 프로젝트 기여 경험',
      'LLM 등 AI 기술을 활용한 프로덕트 개발 또는 PoC 경험',
      '빠른 실험과 반복이 중요한 스타트업/애자일 조직 경험',
      'UI/UX 디테일, 웹 성능 최적화, 다국어(i18n) 서비스 개발 경험',
      '실무적으로 바로 임팩트를 낼 수 있는 능력과 빠른 성장곡선을 보여준 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-15/306dd11b-93e8-4014-8c41-784aefbd6e2c.png',
    url: 'https://www.wanted.co.kr/wd/282961?client_id=ubRphx9ewFwQvQV3kyJjjFSp&utm_source=zighang&utm_medium=referral',
    prompt: () => getPositionPrompt('1'),
  },
  {
    id: '2',
    companyName: '피카부랩스',
    jobTitle: 'ML 엔지니어',
    conditions: ['ML엔지니어', '경력 2년 이상', '서울 강남구'],
    positionDescription:
      'On-Device AI 기술을 통해 세상을 바꿀 기술을 함께 만들어갈 ML Engineer를 모집합니다. 미국 시장 진출을 준비하는 글로벌 팀과 함께 AI 모델 개발 및 최적화 업무를 담당합니다.',
    mainTask:
      'Hugging Face, PyTorch 등 최신 ML 라이브러리를 활용한 AI 모델 개발 및 최적화, 오픈소스 LLM을 이용한 RAG 기반의 에이전트 개발 및 파인튜닝, 엣지 디바이스 대상의 Inference 성능 최적화 (Quantization, Distillation, Pruning 등), Python 기반 ML 백엔드 시스템 구축 및 유지보수를 담당합니다.',
    qualifications: [
      'AI 서비스 개발에 대한 경험(2년 이상 혹은 그에 준하는 실력)',
      '영어로 소통할 수 있는 능력',
      'Hugging Face, PyTorch 등 ML 라이브러리 활용 경험',
      'Python 기반 개발 경험',
      '오픈소스 LLM 활용 경험',
    ],
    preferredQualifications: [
      'AI 툴을 자연스럽게 활용하고 최적화할 수 있는 능력',
      '자동화와 도구 활용을 통한 생산성 향상 경험',
      'AI를 비판적으로 검증하고 판단할 수 있는 능력',
      'RAG 기반 에이전트 개발 경험',
      '엣지 디바이스 Inference 최적화 경험 (Quantization, Distillation, Pruning)',
      '글로벌 팀 협업 경험',
      'On-Device AI 기술 관련 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-05-14/294f97fd-41c0-4d15-9bc6-9f9ed57e2a42.png',
    url: 'https://www.wanted.co.kr/wd/282928?client_id=ubRphx9ewFwQvQV3kyJjjFSp&utm_source=zighang&utm_medium=referral',
    prompt: () => getPositionPrompt('2'),
  },
  {
    id: '3',
    companyName: '산군',
    jobTitle: '웹 백엔드 개발자',
    conditions: ['백엔드', '신입~10년차', '서울'],
    positionDescription:
      'SpringBoot 기반 웹 서비스 및 API 서버 개발을 담당하며, 대용량 데이터 처리와 AI 모델 연동 시스템을 구축합니다. PostgreSQL, Kafka, Spring Batch 등을 활용한 실시간 데이터 파이프라인 개발 업무를 수행합니다.',
    mainTask:
      'SpringBoot 기반의 웹 서비스 및 API 서버 개발, PostgreSQL, Kafka, Spring Batch, Elasticsearch, Redis를 활용한 대용량 데이터 처리 및 비동기 시스템 구현, AI 모델과 연동된 데이터 로직 개발 및 운영, 실시간 및 정기 데이터 수집·가공·제공 파이프라인 설계 및 개발, 서비스 성능 개선, 장애 대응, 시스템 안정성 향상을 위한 구조 개선 및 리팩토링, 퍼블리셔가 제작한 HTML/CSS 기반 UI와의 JSP/백엔드 연동 개발을 담당합니다.',
    qualifications: [
      '3년 이상의 소프트웨어 엔지니어링 경험 혹은 그에 준하는 개발 능력',
      'Java 및 SpringBoot 기반 웹 서비스 개발 경험',
      'PostgreSQL 또는 유사 RDBMS 기반의 쿼리 튜닝 및 데이터 모델링 경험',
      'RESTful API 설계 및 개발 경험',
      '시스템 구조 개선, 리팩토링을 즐기는 분',
      '빠르게 개발하고 배포하는 조직에서 주도적으로 일해본 경험',
    ],
    preferredQualifications: [
      'Spring Batch를 활용한 정기/대량 데이터 처리 경험',
      'Kafka 또는 메시지 브로커 기반의 비동기 시스템 운영 경험',
      'JSP 기반 서비스의 유지보수 및 리팩토링 경험',
      '대용량 데이터 처리 또는 동시성 제어 경험',
      'Docker, Jenkins 등 DevOps 환경 구축 경험',
      'Elasticsearch, Redis 활용 경험',
      'AI 모델 연동 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-03-18/816dd6f7-1f2f-43e4-bead-8e2bb6a8bef6.jpg',
    url: 'https://groupby.kr/positions/5005?utm_source=zighang&utm_medium=referral&client_id=seeunbag30%40gmail.com&zighang_source_url=https%3A%2F%2Fzighang.com%2Frecruitment%2F96b858bb-8b1f-47d7-8393-bbc82ecf6ef9&parentPositionTypes=17&positionTypes=1&positionTypes=11&positionTypes=33&careerTypes=2&minExperience=2&maxExperience=5',
    prompt: () => getPositionPrompt('3'),
  },
  {
    id: '4',
    companyName: '솔로트립',
    jobTitle: '[교육파트] 프론트엔드 개발자 (Cursor AI)',
    conditions: ['프론트엔드', '경력 1-3년', '서울 강동구'],
    positionDescription:
      '여행을 사랑하는 사람들을 위한 플랫폼 솔로트립에서 프론트엔드 개발자 교육 멘토로서 Cursor AI를 활용한 개발 업무를 담당합니다. 생성형 AI 도구를 적극 활용하여 업무 효율을 높이고, 미래 동료 개발자들을 위한 멘토링을 진행합니다.',
    mainTask:
      'Cursor AI를 도입한 프론트엔드 교육 멘토 역할 수행, Cursor AI를 활용한 사용자 인터페이스 개발, Cursor AI로 생성된 솔로트립 플랫폼의 유지보수 및 추가 개발, 생성형 AI를 현재 개발 프로세스에 도입하기 위한 연구 및 스터디, 프론트엔드 코드의 최적화 및 유지보수, UI 개발을 담당합니다.',
    qualifications: [
      'HTML, CSS, JavaScript에 대한 깊은 이해',
      'React, Vue.js 등 프론트엔드 프레임워크 경험',
      '협업을 위한 원활한 커뮤니케이션 능력',
      '1-3년의 프론트엔드 개발 경력',
    ],
    preferredQualifications: [
      'Cursor AI 등 다양한 생성형 AI 툴 사용 경험',
      '디자인 툴(Figma, Sketch) 사용 경험',
      '다양한 디바이스에 대한 반응형 웹 개발 경험',
      '교육 또는 멘토링 경험',
      '여행 플랫폼 개발 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-05-14/72a03e58-eb54-4488-9066-0142e49f8d96.png',
    url: 'https://www.wanted.co.kr/wd/282997?client_id=ubRphx9ewFwQvQV3kyJjjFSp&utm_source=zighang&utm_medium=referral',
    prompt: () => getPositionPrompt('4'),
  },
  {
    id: '5',
    companyName: 'NAVER Cloud',
    jobTitle: '환자향 진료기록 생성 모델 개발 (체험형 인턴)',
    conditions: ['AI/ML', '신입', '성남', '인턴'],
    positionDescription:
      '의료 분야 전문가들과 협력하여 헬스케어 전반의 AI 기술을 연구하는 NAVER Cloud에서 환자향 진료기록 생성 모델 개발 업무를 담당하는 체험형 인턴을 모집합니다. 의무기록 등 헬스케어 도메인 데이터를 활용한 AI 서비스 개발에 참여합니다.',
    mainTask:
      '의료 도메인의 다양한 데이터 수집 및 전처리, 여러 AI 오픈소스 모델들의 도메인 특화 성능 비교 분석, AI 어플리케이션 제작 과정 체험 및 서비스 품질 분석을 담당합니다. 약 3개월간의 인턴십을 통해 헬스케어 AI 개발 전반을 경험하게 됩니다.',
    qualifications: [
      '국내/외 정규 대학(학사) 재학생 또는 기 졸업자',
      '인턴십 기간(약 3개월) 동안 Full-Time 근무 가능',
      '인공지능 관련 수업 이수',
      'Python 프로그래밍 능력 보유',
      '자연어처리(NLP) 관련 인공지능 프로젝트 수행 경험',
    ],
    preferredQualifications: [
      'PyTorch 경험',
      'AI/ML 분야 학술실적 보유',
      'AI/ML 분야 해커톤 경진대회 수상 이력',
      '헬스케어 도메인 관련 프로젝트 경험',
      '의료 데이터 처리 경험',
      '머신러닝 모델 성능 분석 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-08-01/9709da8f-5648-444f-b23c-4b9f633b9e5f.png',
    url: 'https://recruit.navercloudcorp.com/rcrt/view.do?annoId=30003399&lang=ko&utm_source=zighang&utm_medium=referral',
    prompt: () => getPositionPrompt('5'),
  },
  {
    id: '6',
    companyName: '넵튠(Neptune)',
    jobTitle: '플랫폼개발팀 백엔드개발자',
    conditions: ['백엔드', '경력 2-5년', '서울 강남구'],
    positionDescription:
      '게임과 광고 플랫폼을 개발하는 넵튠에서 플랫폼개발팀 백엔드개발자를 모집합니다. Golang을 주력으로 하는 미프/KLAT 서비스의 백엔드 개발 및 운영을 담당하며, 다양한 데이터베이스와 클라우드 인프라를 활용하여 서비스를 구축합니다.',
    mainTask:
      'Golang으로 개발된 미프/KLAT 서비스의 백엔드 서버 개발 및 운영, 백엔드 기능 개발부터 클라우드 인프라 운영까지 다양한 업무 수행, CockroachDB, MySQL, Redis, DynamoDB 등 다양한 데이터베이스의 특성을 이해하고 장단점에 따라 혼용, Node.js로 구현된 레거시 코드를 Golang으로 전환, 팀 내 다른 프로젝트 백업 업무를 담당합니다.',
    qualifications: [
      '2년 ~ 5년 이하의 백엔드 개발 경험',
      '기존 코드를 빠르게 이해하고 디버깅을 통해 수정할 수 있는 능력',
      'Golang 사용경험 또는 여러 프로그래밍 언어 사용에 대한 두려움이 없는 분',
      'API 서버 개발 경험',
      '기본적인 Database, Linux 시스템 이용 능력',
      'Docker 관련 기본적인 이해 및 사용 경험',
      'AWS, GCP 등 클라우드 인프라 사용 경험',
      '원활한 커뮤니케이션 및 협업 능력',
    ],
    preferredQualifications: [
      '머신러닝 관련 역량 보유',
      'Terraform 관련 역량 보유',
      '침입탐지, 보안 관련 역량 보유',
      '게임 서비스 개발 경험',
      '대용량 트래픽 처리 경험',
      '마이크로서비스 아키텍처 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-04-29/32f4f384-1256-4efd-bb27-aa8cb69083e9.png',
    url: 'https://www.wanted.co.kr/wd/282976?client_id=ubRphx9ewFwQvQV3kyJjjFSp&utm_source=zighang&utm_medium=referral',
    prompt: () => getPositionPrompt('6'),
  },
]
