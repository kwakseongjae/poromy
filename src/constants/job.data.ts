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
export const jobs: Job[] = [
  {
    id: '1',
    companyName: '크리에이트립',
    jobTitle: '프론트엔드 엔지니어',
    conditions: ['프론트엔드', '경력 2-5년', '서울 강남구'],
    jobType: 'IT-개발',
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
    url: 'https://www.wanted.co.kr/wd/282961',
    prompt: () => getPositionPrompt('1'),
    uploadedAt: '2025-05-14T22:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '2',
    companyName: '피카부랩스',
    jobTitle: 'ML 엔지니어',
    conditions: ['ML엔지니어', '경력 2년 이상', '서울 강남구'],
    jobType: 'AI-데이터',
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
    url: 'https://www.wanted.co.kr/wd/282928',
    prompt: () => getPositionPrompt('2'),
    uploadedAt: '2025-05-14T22:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '3',
    companyName: '산군',
    jobTitle: '웹 백엔드 개발자',
    conditions: ['백엔드', '신입~10년차', '서울'],
    jobType: 'IT-개발',
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
    url: 'https://groupby.kr/positions/5005',
    prompt: () => getPositionPrompt('3'),
    uploadedAt: '2025-05-14T22:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '4',
    companyName: '솔로트립',
    jobTitle: '[교육파트] 프론트엔드 개발자 (Cursor AI)',
    conditions: ['프론트엔드', '경력 1-3년', '서울 강동구'],
    jobType: 'IT-개발',
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
    url: 'https://www.wanted.co.kr/wd/282997',
    prompt: () => getPositionPrompt('4'),
    uploadedAt: '2025-05-14T22:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '5',
    companyName: 'NAVER Cloud',
    jobTitle: '환자향 진료기록 생성 모델 개발 (체험형 인턴)',
    conditions: ['AI/ML', '신입', '성남', '인턴'],
    jobType: 'AI-데이터',
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
    url: 'https://recruit.navercloudcorp.com/rcrt/view.do?annoId=30003399&lang=ko',
    prompt: () => getPositionPrompt('5'),
    uploadedAt: '2025-05-14T22:00:00+09:00',
    deadline: '2025-05-26T18:00:00+09:00',
  },
  {
    id: '6',
    companyName: '넵튠(Neptune)',
    jobTitle: '플랫폼개발팀 백엔드개발자',
    conditions: ['백엔드', '경력 2-5년', '서울 강남구'],
    jobType: 'IT-개발',
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
    url: 'https://www.wanted.co.kr/wd/282976',
    prompt: () => getPositionPrompt('6'),
    uploadedAt: '2025-05-14T22:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '7',
    companyName: '피카부랩스',
    jobTitle: '[인턴] AI 엔지니어',
    conditions: ['AI엔지니어', '신입', '서울 강남구', '인턴'],
    jobType: 'AI-데이터',
    positionDescription:
      '온디바이스 AI 모델을 경량화하고 최적화하는 피카부랩스에서 AI 엔지니어 인턴을 모집합니다. 현대, LG전자, Intel과 협업하여 경량 LLM으로 홈 IoT를 제어하는 sLAM 프로젝트에 참여하며, 3개월 인턴십 후 정규직 전환 가능성이 있습니다.',
    mainTask:
      '소형 LLM 모델(sLLM) 활용한 Intent 및 Slot 추출 모델 설계, 자연어 명령 → 액션 변환 모델 학습 및 튜닝, HuggingFace Transformers 및 ONNX 기반 경량화 모델 적용, 온디바이스 테스트를 위한 모델 최적화 (quantization, pruning 등)를 담당합니다. 3-6개월간의 인턴십을 통해 실질적인 AI 프로젝트에 기여하게 됩니다.',
    qualifications: [
      'Python, PyTorch 또는 TensorFlow 기반 딥러닝 프로젝트 경험',
      '자연어 처리(NLP) 관련 프로젝트 또는 과제 수행 경험',
      '학사 3학년 이상 또는 대학원 석박사 재학 중',
      '영어로 소통할 수 있는 능력 (해외 팀 협업)',
    ],
    preferredQualifications: [
      'AI 툴을 자연스럽게 활용하고 최적화할 수 있는 능력',
      '자동화와 도구 활용을 통한 생산성 향상 경험',
      'AI 결과를 비판적으로 검증하고 판단할 수 있는 능력',
      'HuggingFace Transformers 사용 경험',
      'ONNX 또는 모델 경량화 기술 경험',
      '온디바이스 AI 관련 프로젝트 경험',
      'LLM 또는 sLLM 활용 경험',
      'Intent Classification, Slot Filling 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-05-14/294f97fd-41c0-4d15-9bc6-9f9ed57e2a42.png',
    url: 'https://www.wanted.co.kr/wd/283066',
    prompt: () => getPositionPrompt('7'),
    uploadedAt: '2025-05-15T22:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '8',
    companyName: '아시아나IDT',
    jobTitle:
      'AI/빅데이터 연구개발 - 인공지능 엔지니어(AE) 및 데이터 과학자(DS)',
    conditions: ['AI/ML', '경력 2년 이상', '서울 종각'],
    jobType: 'AI-데이터',
    positionDescription:
      '아시아나IDT에서 AI/빅데이터 연구개발 분야의 인공지능 엔지니어(AE) 및 데이터 과학자(DS)를 모집합니다. 딥러닝, 자연어 처리, RAG/생성형AI(LLM) 기술을 활용한 연구개발 업무를 담당하며, 최신 AI 기술을 항공/여행 산업에 적용하는 업무를 수행합니다.',
    mainTask:
      '딥러닝 및 자연어 처리(NLP), RAG/생성형AI(LLM) 기술을 활용한 AI 솔루션 연구개발, PyTorch 또는 TensorFlow를 활용한 딥러닝 모델 개발 및 최적화, 항공/여행 도메인에 특화된 AI 서비스 구축, 빅데이터 분석 및 인사이트 도출, AI 모델의 성능 개선 및 최적화를 담당합니다.',
    qualifications: [
      '딥러닝 및 자연어 처리(NLP), RAG/생성형AI(LLM) 기술에 대한 심층적인 이해와 경험',
      'PyTorch 또는 TensorFlow와 같은 딥러닝 프레임워크 활용 능력',
      '경력 2년 이상',
      'Python 프로그래밍 능력',
    ],
    preferredQualifications: [
      '데이터 과학, 인공지능, 컴퓨터 공학, 통계학 석사 이상 또는 관련 분야 전문 지식 보유',
      '백엔드 설계 및 구현 경험',
      'Python을 포함한 다양한 프로그래밍 언어(R, Java 등) 능숙',
      'LLM 연구 또는 논문 저술 경험',
      'Hugging Face 모델 커스텀 개발 경험',
      'RLHF 적용 경험',
      'MLOps 구축 및 운영 경험',
      'CUDA 및 GPU 최적화 기술 보유',
      'RAG 시스템 구축 경험',
      '항공/여행 도메인 지식',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-01-26/5579eb4b-6912-40b5-8156-4c8089d740e9.png',
    url: 'https://asianaidt.recruiter.co.kr/app/jobnotice/view?systemKindCode=MRS2&jobnoticeSn=216557',
    prompt: () => getPositionPrompt('8'),
    uploadedAt: '2025-05-15T22:00:00+09:00',
    deadline: '2025-05-21T23:59:00+09:00',
  },
  {
    id: '9',
    companyName: '딥세일즈',
    jobTitle: '[인턴] 웹 크롤링/스크래핑 엔지니어',
    conditions: ['데이터엔지니어', '신입', '서울 강남구', '인턴'],
    jobType: 'AI-데이터',
    positionDescription:
      '머신러닝과 세일즈 빅데이터 기반의 세일즈 인텔리전스 SaaS 솔루션을 제공하는 딥세일즈에서 웹 크롤링/스크래핑 엔지니어 인턴을 모집합니다. 6개월 인턴 기간 후 정규직 전환 기회가 있으며, 빠르게 성장하는 스타트업에서 데이터 수집 기술을 전문적으로 발전시킬 수 있습니다.',
    mainTask:
      'Python 기반(BeautifulSoup, Selenium 등)의 웹 스크래핑 모듈 개발 및 유지보수, 다양한 웹사이트의 데이터 수집 및 구조 분석, 수집된 데이터의 기본적인 정제 및 관리, 스크래핑 과정에서 발생하는 이슈 해결 및 개선을 담당합니다. 세일즈 인텔리전스 서비스를 위한 핵심 데이터 수집 업무를 수행하게 됩니다.',
    qualifications: [
      'Python 프로그래밍 가능',
      'BeautifulSoup, Selenium 등 웹 스크래핑 라이브러리 사용 경험 또는 학습 경험',
      'HTML, CSS, 웹 요청/응답(HTTP)에 대한 기본적인 이해',
      '웹사이트 구조에 대한 이해',
      'GIT 등 버전 관리 시스템 사용 경험',
    ],
    preferredQualifications: [
      '개인 프로젝트 또는 스터디를 통한 웹 스크래핑 경험',
      '웹사이트의 동적 컨텐츠 로딩(Javascript)에 대한 기초적인 이해',
      '데이터 수집 및 처리에 대한 관심',
      '문제 해결 능력과 적극적인 커뮤니케이션 자세',
      'Scrapy 등 다른 스크래핑 프레임워크 경험',
      'API 활용 경험',
      '데이터베이스 활용 경험',
      '크롤링 봇 탐지 회피 기술 이해',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-24/91eb2b7f-f6cc-48b2-bc5a-c483ac0d0178.png',
    url: 'https://www.wanted.co.kr/wd/283236',
    prompt: () => getPositionPrompt('9'),
    uploadedAt: '2025-05-15T22:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '10',
    companyName: '마이리얼트립',
    jobTitle: 'Product Manager, FTN',
    conditions: ['PM', '경력 3년 이상', '서울'],
    jobType: '기획-전략',
    positionDescription:
      '마이리얼트립의 FTN(Fight To Non-Flight)팀에서 Product Manager를 모집합니다. 항공권 구매 고객에게 최적의 숙소 및 투어 상품을 제안하여 여행 전 과정의 경험을 완성하는 팀으로, 고객의 여정을 깊이 이해하고 비행 이후의 여행 경험까지 책임지는 업무를 담당합니다.',
    mainTask:
      '경영진 및 전사 주요 리더들과 긴밀한 소통을 통한 전략 수립, 명확한 가설 기반의 실행 가능한 To Do 도출 및 유의미한 성과 창출, 고객과 비즈니스에 대한 깊이 있는 이해를 바탕으로 한 문제 발굴 및 효과적인 솔루션 설계/실행, 빠른 실행력과 진취적이고 주도적인 방식으로 팀 리드, 제품/비즈니스/디자인/개발/데이터/마케팅/사업/운영 등 다양한 영역의 이해관계자와 협업을 주도하며 팀의 성과를 극대화합니다.',
    qualifications: [
      '3년 이상의 PM 경력 또는 이에 준하는 유사한 경험',
      '탁월한 커뮤니케이션 역량과 문제 해결 능력',
      '구체적인 문제와 직접적으로 기여한 성과 및 러닝을 명확히 설명할 수 있는 능력',
      '빠르게 변화하거나 도전적인 조직 환경에서 리더십을 발휘하여 의미 있는 성과를 도출한 경험',
      'AI를 비롯한 새로운 툴을 꾸준히 습득하고 업무 효율을 높일 수 있는 능동적 태도',
      '기존 방식으로 해결하기 어려운 문제에 대한 지속적 고민과 새로운 해법 모색 태도',
    ],
    preferredQualifications: [
      '숙소 도메인 경험',
      '이커머스 도메인 경험',
      '고객 지향 제품을 런칭해 본 경험',
      '여행 업계 경험',
      '크로스펑셔널 팀 리딩 경험',
      '데이터 기반 의사결정 경험',
      '스타트업 또는 빠르게 성장하는 조직 경험',
      'OKR/KPI 관리 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-10/dc51c564-2d75-4f8f-83f4-98d56396a233.png',
    url: 'https://careers.myrealtrip.com/recruit/157175',
    prompt: () => getPositionPrompt('10'),
    uploadedAt: '2025-05-15T22:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '11',
    companyName: '모요',
    jobTitle: 'Frontend Developer - Product',
    conditions: ['프론트엔드', '경력 3-10년', '서울 서초구'],
    jobType: 'IT-개발',
    positionDescription:
      '통신을 쉽고 정직하게 만들어가는 모요에서 Frontend Developer를 모집합니다. 약 2년 만에 MAU 50만명, 연 매출 약 35억을 달성한 빠르게 성장하는 회사에서 모요의 얼굴이 되는 웹사이트, 앱 내 웹뷰, 내부 어드민을 개발하며 고객에게 최적의 경험을 제공합니다.',
    mainTask:
      '모요의 얼굴이 되는 웹사이트, 앱 내 웹뷰, 내부 어드민 개발, 사용자에게 최적의 경험을 제공하기 위한 UI/UX 개선 및 기술적 선택, 고객이 겪는 UI/UX 불편함을 발견하고 능동적으로 개선, 팀원들과 함께 모요가 만들어갈 좋은 제품에 대한 고민, 문제 해결 중심의 접근을 통한 고객 중심 제품 설계 및 구현을 담당합니다. 스쿼드(Squad) 시스템 내에서 프로덕트 오너, 디자이너, 데이터 분석가와 협업합니다.',
    qualifications: [
      '만 3년 이상의 웹 프론트엔드 개발 경험',
      'TypeScript 또는 Flow 등 정적 타이핑 도구 사용 경험',
      'Redux 등 상태 관리 패턴을 실제 프로젝트에 적용한 경험',
      'Next.js 같은 SSR 프레임워크 사용 경험',
      '제품 목표를 이해하고, 사용자 중심으로 UI/UX 문제를 능동적으로 해결할 수 있는 능력',
    ],
    preferredQualifications: [
      '고객의 불편함을 발견하고 개선해 본 경험',
      '사용자 피드백을 바탕으로 빠르게 개선 사이클을 운영해 본 경험',
      '협업 과정에서 기술적 의견을 명확히 전달하고, 의사결정에 기여해 본 경험',
      '비즈니스 관점에서 제품을 빠르게 만들고 확장해나가는 것을 즐기는 분',
      '실험과 반복을 즐기고, 데이터를 기반으로 개선 방향을 도출하는 분',
      'React, Next.js, TypeScript 개발 경험',
      'Tailwind CSS, styled-components 사용 경험',
      '통신 업계 또는 핀테크 도메인 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-06/6cad3376-c67b-4e84-8fe2-15c129250e9f.png',
    url: 'https://www.wanted.co.kr/wd/216502',
    prompt: () => getPositionPrompt('11'),
    uploadedAt: '2025-05-15T22:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '12',
    companyName: '넥스트그라운드',
    jobTitle: '[인턴] 백엔드 개발자',
    conditions: ['백엔드', '신입', '서울 강남구', '인턴'],
    jobType: 'IT-개발',
    positionDescription:
      '부동산 시장의 정보 비대칭을 해소하는 집품 서비스를 운영하는 넥스트그라운드에서 백엔드 개발자 인턴을 모집합니다. 2년간 월 평균 30% 이상의 트래픽 성장을 기록하며 매달 새로운 챌린지가 생겨나는 환경에서 6개월 인턴 후 정규직 전환 기회가 있습니다.',
    mainTask:
      '집품 서비스의 전반적인 백엔드 개발 업무 담당 (비즈니스 로직 설계, DB 관리 및 성능최적화, RESTful API 제작), 백엔드 API와 아키텍처에 대한 설계, 구현, 테스트, 문서화 진행, 서버 안정성과 API 속도 향상을 위한 기능 체크 및 개선점 파악을 담당합니다. 1년간 기존 코드의 80% 이상을 변경할 만큼 적극적인 개선 문화를 경험할 수 있습니다.',
    qualifications: [
      'JAVA 언어 기반의 Spring 개발 경험',
      'MySQL 혹은 PostgreSQL과 같은 RDBMS 활용 능력',
      'RDBMS 구조를 설계하고 확장성 있는 DB 구조를 고민해 본 경험',
      'JUnit 같은 테스트 프레임워크를 통한 테스트 코드 작성 경험',
      '대학 졸업자 이상 (2025년 08월 졸업 예정자 포함)',
    ],
    preferredQualifications: [
      '공공데이터 관련 활용 경험이 있거나 이해도가 높은 분',
      'RDBMS의 실행계획을 통한 인덱스 튜닝/쿼리 튜닝 경험',
      '실시간으로 로그를 분석하고 오류를 찾아 서비스를 개선해 본 경험',
      'ElasticSearch를 이용한 검색 최적화 경험',
      '24/365 무중단 서비스 경험',
      'Python 개발 경험',
      'Redis, MongoDB 활용 경험',
      '부동산 도메인 이해',
      '빠르게 성장하는 스타트업 환경 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-12/0f6624d8-9387-4811-8b53-96a608e02625.png',
    url: 'https://www.wanted.co.kr/wd/283216',
    prompt: () => getPositionPrompt('12'),
    uploadedAt: '2025-05-15T22:00:00+09:00',
    deadline: '2025-05-30T23:59:59+09:00',
  },
  {
    id: '13',
    companyName: '애드쉴드',
    jobTitle: 'Frontend Engineer',
    conditions: ['프론트엔드', '경력 1년 이상', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      '웹사이트의 광고 차단 손실을 복구하여 새로운 광고 매출을 창출하는 ad-tech 스타트업 애드쉴드에서 Frontend Engineer를 모집합니다. 2024년 런칭 이후 월 평균 30% 이상의 빠른 성장을 보이고 있으며, 신규 고객의 온보딩 프로세스 최적화 및 기술 지원 업무를 담당합니다.',
    mainTask:
      '신규 고객(매체사)의 온보딩 프로세스 지원 및 기술적 문제 신속 해결, 고객 프로필 설정 등 중요한 초기 세팅 작업의 정확하고 효율적인 수행, 온보딩 관련 신규 기능 개발 참여 및 기존 온보딩 프로세스 개선, 내부 유관부서와의 원활한 소통을 통한 이슈 해결 및 온보딩 효율성 증대 방안 모색을 담당합니다. 지속 가능한 광고 지원 웹 생태계 창조라는 회사의 미션에 기여합니다.',
    qualifications: [
      '웹 기술(HTML, CSS, JavaScript) 및 브라우저 작동 방식에 대한 기본적인 이해',
      '1~3년 이상의 프론트엔드 개발 또는 유관 엔지니어링 경험, 혹은 그에 준하는 역량으로 독립적인 업무 수행 가능',
      '꼼꼼함과 강한 책임감을 바탕으로 주어진 작업을 신중하게 처리할 수 있는 능력',
    ],
    preferredQualifications: [
      '다양한 이해관계자와 효과적으로 소통하며, 발생하는 이슈에 대해 유연하고 효율적으로 대처할 수 있는 능력',
      '반복적인 업무를 꾸준히 수행할 수 있으며, 자기 주도적으로 문제를 해결하고 업무를 개선하려는 의지',
      '영어로 기본적인 의사소통(읽기, 쓰기, 말하기)에 어려움이 없는 분',
      '문서화 및 지식 공유에 적극적인 분',
      'ad-tech 또는 광고 업계 경험',
      '온보딩 프로세스 설계 및 개선 경험',
      '고객 대면 업무 경험',
      'React, Vue.js 등 프론트엔드 프레임워크 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-05-08/a787d655-feab-47db-8849-65809871eff6.png',
    url: 'https://www.wanted.co.kr/wd/283045',
    prompt: () => getPositionPrompt('13'),
    uploadedAt: '2025-05-15T22:00:00+09:00',
    deadline: '2025-05-31T23:59:59+09:00',
  },
  {
    id: '14',
    companyName: 'Allganize',
    jobTitle: 'Python Back-end Engineer (문서처리 파이프라인 / RAG)',
    conditions: ['백엔드 개발', '경력 2-5년', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      '대부분의 기업 데이터는 문서(.pdf, .xlsx, .docx, .png, .pptx 등) 같은 파일에 있습니다. 이 직무는 이러한 복잡한 문서들을 뛰어난 정확도로 LLM에 사용 가능한 데이터으로 변환, 제공하는 데 도움을 줍니다. 다양한 기업 고객들이 On-Premises 및 SaaS 형태로 Allganize를 사용하고 있으며, 매월 수백만 페이지를 처리하고 있습니다.',
    mainTask:
      '다양한 비정형 문서로부터 (오피스, PDF, ...) RAG 및 LLM에 사용되는 데이터를 추출, 중요한 정보를 식별, 변환하여 적재합니다. 현재 문서 데이터 파이프라인의 구조를 개선하고, 성능 개선을 위한 전략을 수립 및 구현합니다. 고객 피드백을 바탕으로 API 및 알고리즘을 개선하고(청킹, 추출등), 실패 사례를 더 잘 이해하고 분석하기 위해 내부 툴링과 평가 시스템을 개선합니다. 내부 결정권자 및 고객사와 협력하여 제품의 방향과 엔지니어링 전략을 형성합니다.',
    qualifications: [
      '언어: Python',
      '도구: 서비스에 필요한 도구를 찾아서 적재적소에 사용하거나 스스로 만들 수 있으신 분',
      '경험: 2 ~ 5년의 상용 서비스 개발 및 운영 경험',
      '기술 스택: 메시지 큐 및 데이터베이스등 데이터 시스템에 이해도가 있으신 분',
      '전문연구요원 및 산업기능요원 전직, 보충역 편입 가능(전공학과 또는 경력 2년 이상)',
    ],
    preferredQualifications: [
      '제품에 대한 철학이 있으며 자기주도적인 분',
      '데이터파이프라인 운영 경험이 있으신 분',
      'Agentic App 관련 개발 경험이 있으신 분',
    ],
    logoUrl:
      'https://opening-attachments.greetinghr.com/2025-04-24/5ad91756-ab68-463c-9e66-d917446c2a5e/symbol_color.png',
    url: 'https://allganize.career.greetinghr.com/o/153657',
    prompt: () => getPositionPrompt('14'),
    uploadedAt: '2025-05-16T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '15',
    companyName: 'CJ올리브영',
    jobTitle: '커머스플랫폼유닛 Back-end 개발자',
    conditions: ['백엔드 개발', '경력 5년 이상', '서울'],
    jobType: 'IT-개발',
    positionDescription:
      '올리브영 커머스플랫폼유닛은 1,600만 이상의 고객에게 빠르고 안정적인 쇼핑 경험을 제공하는 핵심적인 역할을 수행합니다. 대규모 트래픽을 효율적으로 처리하고, 복잡한 비즈니스 로직을 안정적으로 구현하는 숙련된 Back-End 엔지니어를 찾습니다. 온라인몰의 핵심 기능인 전시, 상품, 검색 등 다양한 서비스의 서버 사이드 개발 및 운영을 담당하며, 시스템의 안정성과 성능을 향상시키고, 서비스 미래 성장을 위한 새로운 기술 도입 및 적용을 주도하게 됩니다.',
    mainTask:
      '온라인몰의 핵심 비즈니스 로직 개발 및 안정적인 운영 (상품 관리, 전시 로직, 검색 엔진 연동 등), Java 또는 Kotlin 기반의 Spring Framework를 활용한 고성능 서버 시스템 개발, 효율적인 데이터 관리를 위한 데이터베이스 설계 및 ORM (JPA, Hibernate) 활용, Front-End 및 외부 시스템과의 원활한 연동을 위한 RESTful API 설계 및 개발, 시스템 성능 모니터링 및 개선, 안정성 확보를 위한 기술적인 문제 해결, MSA (Microservice Architecture) 환경에서의 서비스 개발 및 운영, 새로운 기술 도입 및 검토를 통한 시스템 개선',
    qualifications: [
      '5년 이상의 백엔드 애플리케이션 개발 경력이 있으신 분',
      'Java/Kotlin을 이용한 Spring Framework 기반의 애플리케이션 개발 경험이 있으신 분',
      'JPA, Hibernate 등 ORM 사용과 도메인 모델링 경험이 있으신 분',
      'WEB 환경에 대한 기본적인 이해 및 지식이 있으신 분',
      '잠재적인 문제를 해결을 위해 가설을 수립하고 수행한 경험이 있으신 분',
      '학습과 성장에 관심이 많고, 자기 개발을 위해 노력하시는 분',
      '올리브영의 성장과 함께 성공 경험을 만들어 가고 싶으신 분',
    ],
    preferredQualifications: [
      'Spring Boot 를 이용한 프로젝트 수행 경험이 있으신 분',
      'Docker, Kubernetes 등 컨테이너 기반 기술을 이용한 배포/운영 경험이 있으신 분',
      'MSA 환경을 구축하고 운영해 본 경험이 있으신 분',
      'MQ 나 Kafka 등의 비동기 처리 Stream Engine 운영/개발 경험이 있으신 분',
      '다양한 캐싱 전략에 대한 이해 및 경험이 있으신 분',
      '대용량 데이터, 트래픽에 대한 개발 및 운영 경험이 있으신 분',
      '기술 부채를 보면 잠 못 이루시는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-29/7f283330-716e-4324-a3fa-e5ed6a6f32d4.png',
    url: 'https://recruit.cj.net/recruit/ko/recruit/recruit/bestDetail.fo?direct=N&zz_jo_num=J20250515029234',
    prompt: () => getPositionPrompt('15'),
    uploadedAt: '2025-05-16T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '16',
    companyName: 'CJ올리브영',
    jobTitle: '커머스플랫폼유닛 Front-end 개발자',
    conditions: ['프론트엔드 개발', '경력 5년 이상', '서울'],
    jobType: 'IT-개발',
    positionDescription:
      "올리브영 커머스플랫폼유닛에서 '빠르고 매력적인 고객 경험'을 최전선에서 만들어냅니다. 고객에게 최고의 온라인 쇼핑 경험을 제공하기 위해 끊임없이 혁신하며, 고객 중심의 사고를 바탕으로 창의적인 아이디어를 실제 고객이 사용하는 아름답고 편리한 인터페이스로 구현하는 Front-End 엔지니어를 찾습니다.",
    mainTask:
      '고객에게 최고의 사용성을 제공하는 온라인몰의 다양한 화면 개발 (상품 목록, 상세 페이지, 검색 결과, 프로모션 페이지 등), 사용자 중심의 인터랙티브한 웹 애플리케이션 개발, 최신 웹 기술 및 트렌드를 적극적으로 활용하여 사용자 경험 및 인터페이스 개선, 백엔드 팀과의 긴밀한 협업을 통해 API 연동 및 데이터 흐름 구축, 웹 성능 최적화 및 안정적인 서비스 운영을 위한 기술적 개선, 다양한 기기 및 브라우저 환경에서의 호환성 확보 및 반응형 웹 개발',
    qualifications: [
      '5년 이상의 Front-end 개발 경력이나 그에 준하는 역량',
      'JavaScript와 React 같은 Front-end Framework 개발 경험',
      'WEB 환경에 대한 기본적인 이해 및 지식',
      '잠재적인 문제를 해결을 위해 가설을 수립하고 수행한 경험',
      '학습과 성장에 관심이 많고, 자기 개발을 위해 노력하는 분',
      '올리브영의 성장과 함께 성공 경험을 만들어 가고 싶은 분',
    ],
    preferredQualifications: [
      'Typescript/React.js/Node.js 를 활용한 프로젝트 경험',
      '모바일 웹 및 Single Page Application에 대한 이해가 높은 분',
      '대규모 서비스 개발 프로젝트에서 Front-end 성능 최적화 경험',
      '하이브리드 앱 환경에서 개발 경험',
      '기술 부채를 보면 잠 못 이루는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-29/7f283330-716e-4324-a3fa-e5ed6a6f32d4.png',
    url: 'https://recruit.cj.net/recruit/ko/recruit/recruit/bestDetail.fo?direct=N&zz_jo_num=J20250515029613',
    prompt: () => getPositionPrompt('16'),
    uploadedAt: '2025-05-16T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '17',
    companyName: 'CJ올리브영',
    jobTitle: '인터널플랫폼유닛 Back-end 개발자',
    conditions: ['백엔드 개발', '경력 5년 이상', '서울'],
    jobType: 'IT-개발',
    positionDescription:
      "올리브영 인터널플랫폼유닛은 '흔들림 없는 비즈니스'를 위한 안정적인 서버 시스템을 구축합니다. 온/오프라인 채널 전반의 효율적인 운영을 위한 핵심 백오피스 시스템을 담당하며, 안정적인 비즈니스 성장을 위한 기술적 토대를 마련합니다. 대규모 데이터를 안정적으로 처리하고, 복잡한 업무 로직을 견고하게 구현하며, 레거시 시스템을 개선하여 더욱 효율적인 시스템 환경을 구축할 숙련된 Back-End 엔지니어를 찾습니다.",
    mainTask:
      '온라인몰 거래 처리(주문, 결제, 배송, 클레임 등), 리테일 운영(POS, 정산 등), 파트너 연계 등 핵심 업무 로직 개발 및 유지보수, Java 또는 Kotlin을 사용한 안정적인 서버 시스템 개발, RDBMS 또는 NoSQL DB를 활용한 효율적인 데이터 모델링 및 관리, 레거시 시스템 분석 및 개선을 통한 시스템 현대화, 대용량 데이터 처리 및 고성능 트래픽 환경에서의 개발 및 운영 방안 구축',
    qualifications: [
      'Java 또는 Kotlin을 사용한 서버 개발 경험 5년 이상',
      'RDBMS 또는 Nosql DB를 활용한 설계/운영 경험',
      'Git 사용, 코드 리뷰에 익숙한 분',
      '레거시 시스템 개선 경험 및 대용량 시스템 운영 경험',
    ],
    preferredQualifications: [
      '대규모 트래픽을 고려한 시스템 디자인, 개발 경험',
      'AWS 및 클라우드 환경에서 서비스 개발/운영 경험',
      '이커머스 또는 오프라인 유통 분야의 시스템 개발/운영 경험',
      'Agile 개발 방식 / Scrum 경험',
      '직군과 관계없이 어울릴 수 있고, 적극적인 커뮤니케이션을 하려고 노력하는 분',
      '나와 나의 팀만을 위한 의사결정이 아닌 조직 전체를 위한 의사결정을 할 수 있는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-29/7f283330-716e-4324-a3fa-e5ed6a6f32d4.png',
    url: 'https://recruit.cj.net/recruit/ko/recruit/recruit/bestDetail.fo?direct=N&zz_jo_num=J20250515029232',
    prompt: () => getPositionPrompt('17'),
    uploadedAt: '2025-05-16T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '18',
    companyName: 'CJ올리브영',
    jobTitle: '인터널플랫폼유닛 Front-end 개발자',
    conditions: ['프론트엔드 개발', '경력 5년 이상', '서울'],
    jobType: 'IT-개발',
    positionDescription:
      "올리브영 인터널플랫폼유닛은 '안정적인 운영'을 위한 사용자 인터페이스를 구축하고 개선합니다. 온/오프라인 전 채널의 효율적인 운영을 위한 핵심 백오피스 시스템을 개발하고 유지보수하며, 안정적인 비즈니스 성장을 뒷받침하기 위해 내부 사용자의 업무 효율성을 극대화하고, 다양한 시스템 간의 원활한 연동을 지원하는 사용자 인터페이스 개발에 중요한 역할을 담당할 Front-End 엔지니어를 찾습니다.",
    mainTask:
      '내부 업무 시스템의 사용자 인터페이스 개발 및 유지보수, Vue, JavaScript 등 Front-End Framework를 활용하여 효율적인 업무 환경 제공, 사용자 경험(UX) 및 사용자 인터페이스(UI) 디자인을 기반으로 최적의 인터페이스 개발, 백엔드 팀과의 긴밀한 협업을 통해 데이터 시각화 및 기능 연동, 웹 성능 최적화 및 사용자 편의성 향상을 위한 지속적인 개선, 다양한 기기 및 환경에서의 호환성 및 안정성 확보',
    qualifications: [
      '5년 이상의 Front-end 개발 경력이나 그에 준하는 역량',
      'JavaScript와 React 같은 Front-end Framework 개발 경험',
      'WEB 환경에 대한 기본적인 이해 및 지식',
      '잠재적인 문제를 해결을 위해 가설을 수립하고 수행한 경험',
      '올리브영의 성장과 함께 성공 경험을 만들어 가고 싶은 분',
    ],
    preferredQualifications: [
      'Typescript/React.js/Node.js 를 활용한 프로젝트 경험',
      '모바일 웹 및 Single Page Application에 대한 이해가 높은 분',
      '대규모 서비스 개발 프로젝트에서 Front-end 성능 최적화 경험',
      'Agile 개발 방식 / Scrum 경험',
      '하이브리드 앱 환경에서 개발 경험',
      '직군과 관계없이 어울릴 수 있고, 적극적인 커뮤니케이션을 하려고 노력하는 분',
      '나와 나의 팀만을 위한 의사결정이 아닌 조직 전체를 위한 의사결정을 할 수 있는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-29/7f283330-716e-4324-a3fa-e5ed6a6f32d4.png',
    url: 'https://recruit.cj.net/recruit/ko/recruit/recruit/bestDetail.fo?direct=N&zz_jo_num=J20250515029233',
    prompt: () => getPositionPrompt('18'),
    uploadedAt: '2025-05-16T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '19',
    companyName: 'CJ올리브영',
    jobTitle: '코어플랫폼유닛 Back-end 개발자',
    conditions: ['백엔드 개발', '경력 7-12년', '서울'],
    jobType: 'IT-개발',
    positionDescription:
      "올리브영 코어플랫폼유닛은 '고효율 플랫폼'의 핵심 엔진을 개발하고 최적화합니다. 이커머스 옴니채널 비즈니스의 핵심 자산인 상품, 회원, 프로모션, 물류/재고 데이터를 통합 관리하며, 플랫폼의 효율성과 확장성을 책임지는 중요한 역할을 수행합니다. 깊이 있는 기술적 전문성과 풍부한 경험을 바탕으로, 안정적이고 성능 뛰어난 Back-End 시스템을 구축하고 운영하며, 미래 성장을 위한 혁신적인 기술 도입을 주도할 숙련된 Back-End 엔지니어를 찾습니다.",
    mainTask:
      '핵심 비즈니스 로직 (상품 관리, 회원 관리, 프로모션, 캠페인, 재고 관리 등) 개발 및 운영, Java 또는 Kotlin 기반의 Spring Framework를 활용한 애플리케이션 개발, JPA, Hibernate 등 ORM을 이용한 효율적인 데이터 모델링 및 관리, 대규모 트래픽 및 데이터 처리를 위한 시스템 설계 및 최적화, 시스템의 안정성, 확장성, 성능 향상을 위한 지속적인 기술 검토 및 개선',
    qualifications: [
      '7~12년 이내 Application 개발 경력',
      'Java 또는 Kotlin 중에 숙련된 개발 경험',
      'Spring Framework 기반의 애플리케이션 개발 경험',
      'JPA, Hibernate 등 ORM 사용과 도메인 모델링 경험',
    ],
    preferredQualifications: [
      '새로운 기술을 익히고 도메인 지식을 쌓는 것을 좋아하는 분',
      'e-commerce 분야에서 개발경험이 있는 분',
      '틀에서 벗어난 사고를 하고 기존 지식에 도전하기 좋아하는 분',
      '어떤 문제든 끝까지 파고들어 해결하는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-29/7f283330-716e-4324-a3fa-e5ed6a6f32d4.png',
    url: 'https://recruit.cj.net/recruit/ko/recruit/recruit/bestDetail.fo?direct=N&zz_jo_num=J20250515029235',
    prompt: () => getPositionPrompt('19'),
    uploadedAt: '2025-05-16T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '20',
    companyName: 'CJ올리브영',
    jobTitle: '코어플랫폼유닛 Front-end 개발자',
    conditions: ['프론트엔드 개발', '경력 7-12년', '서울'],
    jobType: 'IT-개발',
    positionDescription:
      "올리브영 코어플랫폼유닛은 '고효율 플랫폼'의 사용자 경험을 설계하고 구현합니다. 온/오프라인 채널 전반의 핵심 비즈니스 로직을 통합 관리하며, 플랫폼 개발 효율성을 극대화하는 데 중요한 역할을 합니다. 높은 수준의 기술력과 깊이 있는 이해를 바탕으로, 확장 가능하고 유지보수가 용이한 Front-End 아키텍처를 설계하고, 사용자에게 최적의 경험을 제공하는 데 기여할 숙련된 Front-End 엔지니어를 찾습니다.",
    mainTask:
      '복잡한 비즈니스 로직을 효율적으로 지원하는 Front-End 애플리케이션 개발, JavaScript 또는 TypeScript 기반의 Modern Front-End Framework 활용, Node.js 기반 애플리케이션 개발 및 운영 환경 구축, 백엔드 팀과의 긴밀한 협업을 통한 효율적인 API 연동 및 데이터 흐름 설계, 플랫폼의 확장성 및 유지보수성을 고려한 Front-End 아키텍처 설계 및 구현, 성능 최적화 및 안정적인 서비스 제공을 위한 기술적 개선',
    qualifications: [
      '7~12년 이내 Front Application 개발 경력',
      'javascript/typescript 중에 숙련된 개발 경험',
      'node.js 기반의 애플리케이션 개발 경험',
      '도메인 모델링 경험',
    ],
    preferredQualifications: [
      '새로운 기술을 익히고 도메인 지식을 쌓는 것을 좋아하는 분',
      'e-commerce 분야에서 개발경험이 있는 분',
      '틀에서 벗어난 사고를 하고 기존 지식에 도전하기 좋아하는 분',
      '어떤 문제든 끝까지 파고들어 해결하는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-29/7f283330-716e-4324-a3fa-e5ed6a6f32d4.png',
    url: 'https://recruit.cj.net/recruit/ko/recruit/recruit/bestDetail.fo?direct=N&zz_jo_num=J20250515029236',
    prompt: () => getPositionPrompt('20'),
    uploadedAt: '2025-05-16T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '21',
    companyName: '현대자동차',
    jobTitle: '제조로보틱스 모바일로봇 제조 애플리케이션 SW 개발',
    conditions: ['모바일로봇 SW 개발', '경력 3년 이상', '경기도 의왕'],
    jobType: 'IT-개발',
    positionDescription:
      '모바일 로봇의 응용솔루션을 개발하는 업무를 담당하며, 완성차 공장을 중심으로 다양한 유즈케이스를 발굴하고 로봇 솔루션을 개발하여 상품 경쟁력을 높이는 역할을 합니다. 제조업 현장에서 의미 있는 유즈케이스를 바탕으로 페이로드 하드웨어 개발, 응용 솔루션 소프트웨어 개발, 그리고 통합 관제 서비스 개발까지 수행하며 당사 로봇의 상업화 확대와 상품 가치 향상을 위한 업무를 수행합니다.',
    mainTask:
      '모바일로봇으로 수집한 센서 데이터를 기반으로, 통계·AI 융합 알고리즘과 유연한 데이터 처리 아키텍처를 설계하여 응용서비스를 구현, High-Level 명령어 활용을 통해 모바일로봇을 제어하여 취득한 데이터를 활용한 응용서비스(설비/안전/품질 점검) 모듈 설계 및 구현, 서비스 모듈 내 판단기능을 구현하는 통계, ML모델 및 이를 융합하여 데이터별 상태 판단을 하는 최적 기능에 대한 알고리즘 설계 및 구현, 모바일 로봇 페이로드 센서(IR, RGB, sound 등)에서 데이터 취득 시 로봇에서 발생하는 흔들림 및 환경에서 발생하는 외란 처리를 통한 양질의 데이터 획득 기법 설계 및 구현, 필드별 새로운 환경 설비 조건에도 유연하고 확장 용이한 통계 및 ML모델에서의 데이터 처리 아키텍처 설계, 제한적 컴퓨팅 리소스를 고려하여 원활하게 운영가능한 경량화 모듈 설계, 소프트웨어 모듈 간 기능 연동과 인터페이스 정보를 기반으로 소프트웨어 통합 및 검증 계획 수립, 시스템 관점의 소프트웨어 통합 성능 검증을 통해 소프트웨어 아키텍처의 효율성 검증 및 개선',
    qualifications: [
      '이공계(전자, 제어, 전산, 컴퓨터, 소프트웨어) 분야에서 학사 이상의 학위',
      '3년 이상의 모바일로봇 활용 및 애플리케이션 개발 경력',
      '비즈니스 영어 커뮤니케이션 및 영어 문서 작성 역량',
      'SW 요구사항 분석 및 아키텍처 관련 설계 문서 작성 경험',
      '시스템 및 어플리케이션 기능 설계 및 개발 경험',
      'Python, C/C++ Programming Language 기반 개발 경험',
    ],
    preferredQualifications: [
      '이공계(전자, 제어, 전산, 컴퓨터, 소프트웨어) 분야에서 석사 이상의 학위',
      '2년 이상의 제조업 안전/품질/설비의 상태진단 솔루션 개발 경력',
      'Automotive 산업 내 Mobile Robot Application 개발 경력',
      '통계모델링, ML모델링 개발 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-07-2913%3A37/fc1bc9ce-01a8-44da-a1f0-60b577e37a17.png',
    url: 'https://talent.hyundai.com/apply/applyView.hc?recuYy=2025&recuType=N2&recuCls=230',
    prompt: () => getPositionPrompt('21'),
    uploadedAt: '2025-05-17T00:00:00+09:00',
    deadline: '2025-05-29T17:00:00+09:00',
  },
  {
    id: '22',
    companyName: '로민',
    jobTitle: '데이터 매니저',
    conditions: ['데이터 관리', '경력 1년 이상(신입 가능)', '서울 서초구'],
    jobType: 'AI-데이터',
    positionDescription:
      '다양한 산업 도메인에서 문서 기반 데이터를 수집하고, 이를 AI 학습에 적합한 형태로 정제하고 구조화하는 업무를 담당합니다. 문서 구조를 분석하고 라벨링 전략을 수립하며, 대량 문서 라벨링 자동화를 기획하고 배포하며, 그 전 과정을 내/외부 협업 주체들과 협의하고 조율합니다. AI 학습 데이터의 품질을 책임지고 지속적으로 개선할 수 있는 운영 체계를 주도적으로 만들어갑니다.',
    mainTask:
      '문서 기반 라벨링 정책 및 구조 정의 (문서 유형별: 표, 레이아웃, 수식 등, 산업 도메인별: 무역, 의료, 행정 등), 라벨링 자동화 설계 및 운영 (LLM을 활용한 라벨링 자동화 기획 및 프롬프트 설계, 프롬프트 성능 개선 및 운영), 데이터 품질 및 라벨링 파이프라인 고도화 (데이터 품질 기준 정의 및 검수 프로세스 설계, 엔지니어와 함께 데이터 수집, 전처리, 라벨링까지 이어지는 전체 라벨링 파이프라인 개선 작업 참여), 라벨링 인력(내/외부)의 운영 구조 설계 및 태스크 관리, 다양한 협업 주체와의 커뮤니케이션 및 조율',
    qualifications: [
      '복잡한 문서를 구조화하거나 각종 데이터로부터 정보 추출 전략을 수립한 경험',
      '다양한 산업 도메인에 대한 비즈니스 맥락을 이해하고, 데이터 기반 문제 해결 또는 전략 수립에 참여한 경험',
      '다양한 직군(ML, 기획, 운영 등)과 협업하여 프로젝트를 리드한 경험',
      '반복적 수작업을 자동화/시스템화하려는 문제의식과 설계 능력',
    ],
    preferredQualifications: [
      '무역, 의료, 금융, 수식 등 특정 산업 도메인의 문서 처리 경험',
      'Json, Xml, Html 등 구조화된 문서 포맷에 대한 이해',
      'LabelBox, SageMaker 등 어노테이션 도구 사용 경험',
      'PromptLayer, Langfuse 등 프롬프트 실험 도구 사용 경험',
      'LLM(GPT, Claude 등) 프롬프트 설계 및 성능 실험 경험',
      'HITL 기반 어노테이션 파이프라인 설계 또는 운영 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-11-17/78e685a3-5a5a-4917-ab5b-f1c325a4324e.png',
    url: 'https://lominpublic.notion.site/91dfdd573def47ea978c4b61b3341efa?p=1eed46399740807cba4beefe7fc8dcf1&pm=s',
    prompt: () => getPositionPrompt('22'),
    uploadedAt: '2025-05-17T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '23',
    companyName: '로민',
    jobTitle: '솔루션운영 엔지니어',
    conditions: ['시스템 운영', '경력 1년 이상(신입 가능)', '서울 서초구'],
    jobType: 'IT-개발',
    positionDescription:
      '로민의 솔루션을 고객사에 원활하게 설치 및 운영을 지원하는 포지션으로, 고객사 환경에 맞춰 솔루션을 설치하고, 운영 및 유지보수를 담당하며, 기술적인 문의에 대응하는 역할을 합니다. 고객사 방문을 포함한 외부 활동이 많은 직무입니다.',
    mainTask:
      '고객사 환경 분석 및 솔루션 설치 진행, 고객사 맞춤형 기능 개발 및 최적화, 패치 업데이트 및 검증, 운영 현황 모니터링 및 정기 점검, 에러 로그 분석 및 리포트 작성, 고객사 및 파트너사의 기술 문의 대응, 설치 및 운영 매뉴얼 제작 및 문서화',
    qualifications: [
      '개발 또는 운영 관련 경력이 1년 이상',
      'Linux 환경에서 시스템 운영 및 관리 가능',
      '고객사 및 내부 팀과 원활한 커뮤니케이션 가능',
      '새로운 환경에서도 침착하게 문제를 해결할 수 있는 능력',
      '기술적 도전과 학습에 적극적인 태도',
    ],
    preferredQualifications: [
      '시스템 모니터링 및 로그 분석 툴 활용 경험',
      '솔루션 운영 및 배포 자동화 경험',
      '명확하고 체계적인 문서 작성 가능',
      '고객사 현장 방문 및 기술 지원 경험',
      'AI, AWS, GCP 등의 클라우드 환경에서 운영 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-11-17/78e685a3-5a5a-4917-ab5b-f1c325a4324e.png',
    url: 'https://lominpublic.notion.site/91dfdd573def47ea978c4b61b3341efa?p=1cfd46399740804b862cd1e779392f3b&pm=s',
    prompt: () => getPositionPrompt('23'),
    uploadedAt: '2025-05-17T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '24',
    companyName: '카카오',
    jobTitle: 'Multimodal LLM Research Engineer',
    conditions: ['AI 연구개발', '경력 2년 이상', '판교'],
    jobType: 'AI-데이터',
    positionDescription:
      '카카오의 자체 멀티모달 언어모델인 Kanana 시리즈를 연구 및 개발합니다. 이미지-텍스트를 이해하는 Kanana-v(비전 언어모델), 오디오-텍스트 입출력이 가능한 Kanana-a(오디오 언어모델), 다양한 모달리티의 입출력을 통합하는 Kanana-o(멀티모달 통합 언어모델)을 개발하고 있습니다. 모든 형태의 입력과 출력 간 자유로운 상호 이해가 가능한 범용 멀티모달 모델 개발을 목표로, 국내외 최신 연구 동향을 빠르게 분석하고 이를 바탕으로 기술 선도 수준의 모델을 확보하고자 합니다.',
    mainTask:
      '이미지, 오디오, 텍스트 등 다양한 모달리티를 다루는 Multimodal LLM 연구 및 개발, Supervised Fine-tuning(SFT) 및 Human Preference Alignment를 통한 instruction-following 성능 및 모델 안전성 향상, 단순 응답부터 복합 reasoning까지 아우르는 추론 성능 향상 모델링, 대규모 분산 학습 환경에서의 모델 학습 코드 개발 및 성능 최적화, 멀티모달 학습을 위한 고품질 데이터 수집, 전처리, 정합성 확보 및 구축 파이프라인 설계, 멀티모달 모델의 평가 지표 설계 및 벤치마킹, 실사용 시나리오 기반의 성능 검증',
    qualifications: [
      '딥러닝 관련 분야 석사 이상 또는 이에 준하는 관련 경력 2년 이상',
      '주요 딥러닝 프레임워크(PyTorch, TensorFlow, JAX 등) 중 하나 이상을 활용한 경험',
      'Python 기반의 코드 개발 및 실험 구현에 능숙',
    ],
    preferredQualifications: [
      'Multimodal LLM 기술 및 관련 서비스 개발 경험',
      'CVPR, NeurIPS, ICLR, ICCV, ICML 등 AI 분야 최상위 학회 논문 발표 또는 공동 연구 경험',
      'ACM ICPC 등 주요 프로그래밍 대회 수상 경력 또는 이에 준하는 알고리즘 솔빙 역량',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-07-30/24e97f1f-4d82-44cd-89a1-3ab53fc096d9.png',
    url: 'https://careers.kakao.com/jobs/P-14048',
    prompt: () => getPositionPrompt('24'),
    uploadedAt: '2025-05-17T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '25',
    companyName: '카카오',
    jobTitle: '장소플랫폼 서버 개발자',
    conditions: ['백엔드 개발', '경력 3년 이상', '판교'],
    jobType: 'IT-개발',
    positionDescription:
      '카카오맵의 POI 정보 구축 및 관련 서비스를 담당하고 있으며, 카카오맵 외에도 카카오와 공동체에도 POI 데이터를 지원하고 있습니다. 다양한 플랫폼에 정확하고 풍부한 장소 정보를 제공하고, 국내 최고의 POI 구축을 목표로 하고 있습니다.',
    mainTask:
      '카카오맵 장소정보 서비스와 관련된 서버 플랫폼 개발, POI 데이터 프로세스 구축관련 서버 플랫폼 개발',
    qualifications: ['Java 혹은 Kotlin 경력 3년 이상'],
    preferredQualifications: [
      'k8s 기반 클라우드 플랫폼을 이용한 서버 개발경험',
      'PostgreSQL DB 설계 및 개발 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-07-30/24e97f1f-4d82-44cd-89a1-3ab53fc096d9.png',
    url: 'https://careers.kakao.com/jobs/P-14051',
    prompt: () => getPositionPrompt('25'),
    uploadedAt: '2025-05-17T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '26',
    companyName: '웨이브릿지',
    jobTitle: 'Back-end Developer (국내 서비스)',
    conditions: ['백엔드 개발', '경력 3년 이상', '서울 중구'],
    jobType: 'IT-개발',
    positionDescription:
      '디지털 자산 중개 및 입/출금 어플리케이션 개발과 운영을 담당합니다. 고객 자산에 대한 안정성과 고가용성을 위한 데이터 처리 프로세스 설계 및 개발을 수행하며, 규제 이행을 기반으로 한 안정적이고 신뢰성 있는 어플리케이션 운영을 담당합니다. 지속적으로 개발 프로세스를 개선하고 코드 베이스의 성숙도 향상을 추구하는 문화에서 함께 프로덕트를 만들어 갑니다.',
    mainTask: '디지털 자산 금융 플랫폼 국내 서비스 (Dolfin KR) 백엔드 개발',
    qualifications: [
      'Java 8 이상 또는 Kotlin 언어에 능숙',
      '3년 이상의 관련 개발 경력 또는 그에 준하는 역량',
      'Spring Framework (Java/Kotlin) 기반의 RESTful API 설계 및 개발 경험',
      'JPA/Hibernate을 통한 RDBMS 연계 Back-end 개발 가능',
      '다양한 역할의 크루들과 원활한 커뮤니케이션 가능',
      '상대방의 다름을 인정하고 존중하며 협업을 통한 목적 달성 가능',
    ],
    preferredQualifications: [
      '핀테크 또는 금융 서비스 개발 경험',
      '블록체인/가상자산 기술에 관심이 많은 분',
      '도메인 이해의 중요성을 알고 노력하는 분',
      '마이크로 서비스 아키텍처에 대해 고민하며 구축/운영한 경험',
      'AWS 기반의 CI/CD 파이프라인 환경의 서비스 경험',
      'Docker 기반 서비스 경험',
      '기본적인 Linux/Unix 명령 사용 능력',
      '시스템 분석 역량과 개선하고자 하는 의욕',
      '유의미한 테스트 코드에 대해 고민하는 분',
      'Kafka, RabbitMQ 등 메시징 미들웨어를 활용한 개발 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-01-27/84fa8c24-c4d8-4d70-b70d-d07b281bf290.png',
    url: 'https://wavebridge.notion.site/Back-end-Developer-1f4d045b26f28073839ad99038b2faf3',
    prompt: () => getPositionPrompt('26'),
    uploadedAt: '2025-05-17T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '27',
    companyName: '케이뱅크',
    jobTitle: '혁신서비스 개발 및 운영 담당자',
    conditions: ['서비스 개발', '경력', '서울 중구'],
    jobType: 'IT-개발',
    positionDescription:
      '혁신서비스개발팀은 카드, 간편 결제, 방카슈랑스 금융 서비스와 돈나무 키우기, 공모주 메이트, 우리집 변동알림, AI 퀴즈 챌린지 등의 혁신 서비스를 운영하고 있습니다. 현재는 투자 캘린더, 정책보조금 알리미 등 신규 서비스를 개발하고 있으며 투자홈2.0, 돈나무2.0 등 기존 서비스 리뉴얼도 준비하고 있습니다. MSA구조의 환경 및 코드 표준화를 위해 개발표준협의체를 운영하며 별도 과제를 수행하고 있습니다.',
    mainTask:
      '혁신서비스개발팀 주요 시스템 개발 및 운영 (결제Part: 카드/간편 결제/마이데이터, 서비스Part: 혁신서비스(MSA)/방카슈랑스), 진행 프로젝트 (개인화 프로젝트 안정화 지원, 신규 서비스 개발 (투자2.0, 정책 보조금 알리미 등), 개발표준협의체 과제 수행), 향후 프로젝트 (카드 개발 환경으로 간편 결제 서비스 전환 개발, 결제DB 구성 후 카드/간편 결제 데이터 전환)',
    qualifications: [
      'Python / JAVA / RDB 구조 서비스 개발 및 운영 경험',
      '인프라 / 아키텍처 등 Tech 전반적으로 지식 보유',
      'SOA / MSA 아키텍처에 대한 이해',
      '프로젝트 추진 능력 보유',
    ],
    preferredQualifications: [
      '책임감을 가지고 자기주도적으로 업무를 추진할 수 있는 분',
      '다양한 구성원과 커뮤니케이션할 수 있는 역량',
      '새로운 서비스 개발을 즐기는 분',
      '금융권 컴플라이언스에 대한 이해와 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-08-16/3bafaab1-1602-4d61-9f65-d293f77af115.png',
    url: 'https://kbank.recruiter.co.kr/app/jobnotice/view?systemKindCode=MRS2&jobnoticeSn=216866',
    prompt: () => getPositionPrompt('27'),
    uploadedAt: '2025-05-17T00:00:00+09:00',
    deadline: '2025-05-29T17:00:00+09:00',
  },
  {
    id: '28',
    companyName: '모멘티',
    jobTitle: '백엔드 개발자',
    conditions: ['백엔드 개발', '경력 1-4년', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      '모멘티는 웹사이트 및 어플리케이션 기획/디자인/개발을 턴키로 진행 가능한 에이전시입니다. 주요 고객사로는 삼성전자, KT, SK, LS산전, 한국네트웍스, 비알코리아(베스킨라빈스), 창비, 대명리조트, NH투자증권, 코웨이, MG새마을금고, 인터파크 큐브릿지, 유한킴벌리, 동아제약 등이 있습니다.',
    mainTask:
      '백엔드 웹서비스 전반 개발 (Java, Springboot), 서비스 운영 유지에 필요한 인프라 구축 (AWS, GCP, NCP)',
    qualifications: ['경력 1~4년차 (선임, 책임급)'],
    preferredQualifications: [
      '컴퓨터/시스템공학 전공',
      '해당직무 인턴경력, 해당직무 근무경험',
      '에이전시 근무경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-04-18/3c566088-36c5-4642-9bcc-8ce600242d31.jpg',
    url: 'https://www.wanted.co.kr/wd/130436',
    prompt: () => getPositionPrompt('28'),
    uploadedAt: '2025-05-17T00:00:00+09:00',
    deadline: '2025-06-08T23:59:59+09:00',
  },
  {
    id: '29',
    companyName: '르몽',
    jobTitle: '프론트엔드(F/E) 개발자 (배움몽)',
    conditions: ['프론트엔드 개발', '경력 3년 이상', '서울 마포구'],
    jobType: 'IT-개발',
    positionDescription:
      "르몽의 두 번째 AI인 '배움몽'을 소개합니다. AI를 잘 가르치는 기술이 있다면, 누구나 더 나은 학습자가 될 수 있습니다. 르몽은 모든 사람이 자기 속도에 맞춰 배우고 성장할 수 있도록 돕는 지능형 학습 파트너를 만들고 있습니다. 배움몽은 최신 자연어 이해 기술과 학습 데이터 분석 기술을 활용해 학습자의 질문에 문맥을 이해한 답변을 제공하고, 개인별 성취 수준에 맞는 학습 경로를 설계하는 지능형 AI 튜터 프로젝트입니다.",
    mainTask:
      'React 기반 웹 프론트엔드 개발, 디자이너, 백엔드, AI 개발자와 긴밀히 협업하여 기능 기획과 제품 고도화, 빠른 테스트와 배포 환경 구성 및 지속적인 성능 개선 주도, 배움몽 운영자의 효율적인 운영 업무를 위한 어드민 프론트엔드 개발',
    qualifications: [
      'React 기반 SPA 개발 3년 이상 경험',
      'REST API 및 서버와의 데이터 연동에 대한 이해',
      '디자인시스템 이해와 개발 경험',
      '사용자 중심 UI/UX 설계 경험',
      'TypeScript, React에 대한 깊은 이해와 개발 경험',
    ],
    preferredQualifications: [
      '지속적인 코드 품질 개선 및 리팩토링 경험',
      'React 기반의 Frontend 개발 스킬 보유',
      'LMS(Learning Management System) 개발에 참여한 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-03-11/807077ca-6052-4463-b3d0-ee8d39673e37.jpg',
    url: 'https://groupby.kr/positions/5031',
    prompt: () => getPositionPrompt('29'),
    uploadedAt: '2025-05-17T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '30',
    companyName: '르몽',
    jobTitle: '백엔드(B/E) 개발자 (배움몽)',
    conditions: ['백엔드 개발', '경력 3년 이상', '서울 마포구'],
    jobType: 'IT-개발',
    positionDescription:
      "르몽의 두 번째 AI인 '배움몽'을 소개합니다. AI를 잘 가르치는 기술이 있다면, 누구나 더 나은 학습자가 될 수 있습니다. 르몽은 모든 사람이 자기 속도에 맞춰 배우고 성장할 수 있도록 돕는 지능형 학습 파트너를 만들고 있습니다. 배움몽은 최신 자연어 이해 기술과 학습 데이터 분석 기술을 활용해 학습자의 질문에 문맥을 이해한 답변을 제공하고, 개인별 성취 수준에 맞는 학습 경로를 설계하는 지능형 AI 튜터 프로젝트입니다.",
    mainTask:
      '배움몽 서비스의 API 서버 설계 및 개발 (Nest.js 기반), 학습자 이력 및 콘텐츠 데이터를 위한 DB 모델링 및 쿼리 최적화, GraphQL 및 REST API 기반의 LMS 연동 백엔드 로직 구현, 학습 로그, 추천 결과 등 주요 데이터를 처리하는 데이터 파이프라인 구축 및 운영, AWS 기반 인프라 설계 및 배포 자동화 (CI/CD), 로그, 트래픽, 성능 모니터링을 위한 백엔드 운영 시스템 구축, AI Agent 및 추천 모델과의 API 연동 게이트웨이 구성',
    qualifications: [
      'NestJS 또는 Node.js 기반 API 서버 개발 경험 3년 이상',
      'PostgreSQL, MongoDB 등 관계형 및 NoSQL 데이터베이스 설계 및 운영 경험',
      'RESTful API 설계 및 문서화 경험',
      'AWS 기반 배포 경험 (EC2, S3, RDS, Lambda 등)',
      'Docker, Github Actions 등 DevOps 도구 활용 경험',
      'Git 기반 협업 환경과 CI/CD 파이프라인에 익숙',
    ],
    preferredQualifications: [
      'LMS, B2C 플랫폼 백엔드 개발 경험',
      '대용량 트래픽 또는 멀티테넌시 서비스 운영 경험',
      '로그 기반 사용자 분석, 서버 모니터링 자동화 경험',
      'AI inference 서버 연동 경험 (예: 모델 호출 API 설계 등)',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-03-11/807077ca-6052-4463-b3d0-ee8d39673e37.jpg',
    url: 'https://groupby.kr/positions/5032',
    prompt: () => getPositionPrompt('30'),
    uploadedAt: '2025-05-17T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '31',
    companyName: 'NAVER',
    jobTitle: 'XR 서비스/기술 개발',
    conditions: ['XR 개발', '경력 3년 이상'],
    jobType: 'IT-개발',
    positionDescription:
      '프로덕션 기술과 인공지능(AI)을 결합하여 차세대 콘텐츠 컨테이너를 준비합니다. 커머스, 치지직, 버튜버, 드라마, 영화 등 네이버에서 제공하고 있는 스토리텔링 프로덕트에 새로운 미디어 기술을 제공합니다.',
    mainTask:
      '언리얼 엔진, 유니티를 이용한 VR, AR 어플리케이션 및 쉐이더 개발, 언리얼 엔진 및 유니티 퍼포먼스 최적화, XR 서비스 및 콘텐츠 개발, 리얼리티 기술 선행 연구',
    qualifications: [
      'C/C#/C++를 활용한 개발에 어려움이 없는 분',
      '언리얼 엔진 또는 유니티를 이용한 어플 개발 경험',
      '언리얼 엔진과 유니티 머티리얼 및 랜더 환경에 대한 높은 이해도',
      '기본적인 모션 캡쳐, 3D 그래픽 기술에 대한 이해도',
      'VR, AR 개발 경험',
    ],
    preferredQualifications: [
      '관련 업무 경험 3년 이상',
      '자료 구조 및 알고리즘에 대한 이해와 활용 능력이 뛰어난 분',
      '쉐이더 코딩 개발 및 활용에 대한 이해가 높은 분',
      '디자인 직군과의 협업 경험이 풍부한 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-08-01/1eb52f78-ee3c-436c-a16b-fb1d6e9e61d1.png',
    url: 'https://recruit.navercorp.com/rcrt/view.do?annoId=30003379&lang=ko',
    prompt: () => getPositionPrompt('31'),
    uploadedAt: '2025-05-17T20:00:00+09:00',
    deadline: '2025-05-27T18:00:00+09:00',
  },
  {
    id: '32',
    companyName: 'kt cs',
    jobTitle: 'SW개발 경력직',
    conditions: ['백엔드 개발', '경력 3년 이상', '서울/부산/대구/광주/대전'],
    jobType: 'IT-개발',
    positionDescription:
      'kt cs는 KT그룹 중 고객서비스를 주력사업으로 하는 고객서비스 전문기업입니다. AICC, 컨택센터 아웃소싱, KT고객센터, 114번호안내, 통신유통사업, 교육사업 등을 통해 고객만족 서비스를 제공합니다. kt cs는 대전본사 및 서울사무소를 비롯해 부산, 대구, 광주, 대전광역시 등 전국적인 네트워크를 보유하고 있으며, 약 9,000여명의 임직원이 종사하고 있습니다.',
    mainTask:
      'AICC(AI 컨택센터) 신사업/핵심기술 FrontEnd/BackEnd 내재화 개발, 웹 분야 신기술/개발표준 선제 적용을 통한 설계 및 개발, 빅데이터 기반의 AI솔루션(AI챗봇, AI보이스봇, 채팅, 상담AP) 개발, 고객 상담 관련 CRM 솔루션 개발 및 유지보수, 신사업 솔루션 분야 대용량/실시간 처리 Web Application 개발',
    qualifications: [
      '정규 4년제 대학교 졸업자',
      'SW개발 관련 경력 3년 이상',
      'Java Spring 프레임워크 기반 web(front-end,back-end) Application 설계 및 개발 역량 보유',
      'RDBMS(Postgresql, MariaDB 등) 활용 역량 보유',
      'HTTP, RestFul API 인터넷 기반 프로토콜 및 기술에 대한 이해',
    ],
    preferredQualifications: [
      'SI 프로젝트 구축 경험 보유자',
      '개발 프로젝트 PM/PL 역할 진행 경험',
      '컴퓨터 공학계열 또는 그에 상응하는 교육 이수',
      '기본적인 Linux 서버 OS 지식 보유',
      'HTML, Javascript, CSS에 대한 이해와 경험',
      '구성된 프레임워크를 수정/보완해 가며 연관 프로젝트 개발 경험',
      'AICC (상담AP, 챗봇, 보이스봇, 상담Assist) 개발 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-28/aaf44e71-879a-4f40-8ea9-29702b120b83.png',
    url: 'https://recruit.kt.com/careers/216813',
    prompt: () => getPositionPrompt('32'),
    uploadedAt: '2025-05-17T20:00:00+09:00',
    deadline: '2025-06-03T23:59:59+09:00',
  },
  {
    id: '33',
    companyName: 'TPC인터넷',
    jobTitle: 'iOS 개발자 / iOS Developer',
    conditions: ['iOS 개발', '경력 3년 이상', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      'iOS 개발자로서 크리에이터 수익 창출에 도움이 되는 다양한 기능(정기 구독 포스트, DM 및 영상 통화, 라이브 방송, 스토리 등)을 개발하고, CI/CD 환경을 구축하며, 코드 리팩토링을 통해 앱의 품질을 향상시키는 업무를 담당합니다.',
    mainTask:
      '크리에이터 수익 창출에 도움이 되는 기능 개발(정기 구독 포스트, DM 및 영상 통화, 라이브 방송, 스토리), CI/CD 개발(Unit 테스트 및 UI 테스트 가능하도록 앱 구조 변경, 네트워크 요청 레코딩 등을 통한 시나리오 테스트 작성, 자동 테스트 및 생산물 자동 등록 등 CI/CD 보강), 코드 리팩토링(현재 작성된 코드 분석 통해 더 좋은 구조로 변경, 예전 디자인으로 작성된 컴포넌트 지속적인 업데이트)',
    qualifications: [
      'iOS 앱 개발 경력 3년 이상 또는 그에 준하는 역량',
      'Swift 언어 개발 경험',
    ],
    preferredQualifications: [
      '코드 개선 및 코드 리뷰에 적극 참여하시는 분',
      'iOS UI/UX 가이드라인에 대한 이해도가 높으신 분',
      '새로운 기술 습득과 지식 공유에 즐거움을 느끼시는 분',
      'Combine 혹은 RxSwift를 능숙하게 사용 가능한 분',
      '다른 직군 동료(디자인/운영/PM)과 적극적으로 협업, 소통하시는 분',
      '라이브 스트리밍, 영상채팅, 데이팅 서비스 개발 경험 있으신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-11-12/be61ba44-c04d-41a0-b831-404b97a77b6c.png',
    url: 'https://www.tpcinternet.com/ios',
    prompt: () => getPositionPrompt('33'),
    uploadedAt: '2025-05-17T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '34',
    companyName: 'NHN Cloud',
    jobTitle: '시스템 엔지니어링',
    conditions: ['인프라 엔지니어링', '경력 3년 이상', '경기도 성남시 판교'],
    jobType: 'IT-개발',
    positionDescription:
      'NHN Cloud는 대한민국을 대표하는 클라우드 서비스로서 데이터 센터부터 플랫폼, 애플리케이션 서비스에 이르기까지 고객이 필요한 모든 클라우드 서비스를 제공하는 클라우드 서비스 제공사(CSP)입니다. 탄탄한 기술력으로 폭발적인 성장을 이뤄온 NHN Cloud는 이제 국내를 넘어 글로벌 테크 기업으로의 성장을 목표로 하고 있습니다.',
    mainTask:
      '오픈스택 기반 NHN Cloud IaaS 배포 및 운영, 시스템/서비스 모니터링 및 트러블슈팅, 모니터링 및 운영도구 구축/개발/운영',
    qualifications: [
      '시스템 엔지니어링 경력을 3년 이상 보유',
      '리눅스 OS 설치 및 시스템/서비스 운영, 트러블슈팅, 모니터링 경험 보유',
    ],
    preferredQualifications: [
      '클라우드 관련 지식/스킬 또는 구축/운영 경험 보유(OpenStack, KVM, VMware, AWS, Azure, GCP 등)',
      '프로그래밍 개발 스킬 (Bash, Python, Java 등) 보유',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-21/c7fc527a-03d8-4600-b272-fb73d759db28.png',
    url: 'https://careers.nhn.com/recruits/4069068502100125815',
    prompt: () => getPositionPrompt('34'),
    uploadedAt: '2025-05-17T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '35',
    companyName: '신세계디에프',
    jobTitle: '데이터분석 경력직',
    conditions: ['데이터 분석', '경력 2-7년', '서울 중구'],
    jobType: 'AI-데이터',
    positionDescription:
      '면세쇼핑의 신세계! 신세계디에프는 온·오프라인 고객 데이터를 분석하여 인사이트를 발굴하고, 고객 세분화와 맞춤형 타겟마케팅 전략을 수립하며, 데이터 기반의 CRM 캠페인을 성과 모니터링하는 데이터 분석 전문가를 찾고 있습니다.',
    mainTask:
      '온·오프라인 고객 구매 및 행동분석을 통한 인사이트 발굴, 고객 세분화 및 맞춤형 타겟마케팅 전략 수행, 오프라인 매장과 온라인몰 데이터를 결합한 고객 여정 분석, CRM 캠페인 성과 모니터링 및 피드백, 기타 데이터 관련 업무 진행 (데이터추출/분석, CRM, RPA 등)',
    qualifications: [
      '관련분야 업무경험 (통계학, 컴퓨터공학, 전자공학, 빅데이터, 수학 등)',
      '데이터분석 및 모델개발 관련 업무 경력 (2~7년 근무경력)',
      'Python, SQL을 활용한 실무 경력자',
      '다양한 이해관계자(마케팅, 기획자, 경영자)와 협업 경험 및 커뮤니케이션 가능자',
    ],
    preferredQualifications: [
      '유통/리테일 비즈니스, 데이터에 대한 이해 (백화점, 온라인마켓 등의 경력)',
      '데이터 기반 서비스/분석/기획 및 백엔드에서 대한 이해 (백엔드개발자, 웹크롤링 경험)',
      '데이터/AI 관련 아키텍처 및 기술에 대한 경험',
      'SQL 관련 자격증 보유 (OCP, SQLD 등)',
      'Python 또는 R을 활용한 고객분석 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-20/f363b072-31ef-4aff-8b61-59e1bff551af.png',
    url: 'https://job.shinsegae.com/recruit_info/notice/notice01_view.jsp?notino=8714',
    prompt: () => getPositionPrompt('35'),
    uploadedAt: '2025-05-17T20:00:00+09:00',
    deadline: '2025-05-31T23:59:59+09:00',
  },
  {
    id: '36',
    companyName: '네오위즈',
    jobTitle: '신규 프로젝트 UI/UX 디자이너',
    conditions: ['UI/UX 디자인', '경력 3년 이상', '경기도 판교'],
    jobType: '디자인',
    positionDescription:
      '세계 최고의 리듬 게임인 DJMAX 시리즈를 개발한 ROCKY 스튜디오는 오랫동안 사랑받아온 DJMAX의 브랜드를 더욱 확장시켜 글로벌 유저들에게 더 많은 감동을 전달하려 합니다. 센스티브한 DJMAX 브랜드 고유의 UI 아트를 더욱 확장시켜 주실 수 있는 분을 찾고 있습니다.',
    mainTask: '신규 프로젝트의 UI 아트 제작, 게임 전반의 UX 플로우 구성',
    qualifications: [
      '경력 3년 이상 또는 이에 준하는 실력이나 경험',
      '언리얼 엔진 사용 경험이 풍부한 분',
      'UI, UX의 구조적 구현에 대하여 주도적으로 리딩할 수 있는 분',
    ],
    preferredQualifications: [
      'DJMAX 시리즈에 대한 애정이 있으신 분',
      '모션 그래픽적 연출에 이해도가 높으신 분',
      '콘솔이나 스팀 게임에 대한 관심이 많으신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-10/91093196-b79c-4bd7-86b0-0fcd02121924.png',
    url: 'https://www.neowiz.com/career/browse-job/c4f38e4c-75ee-406e-a49a-5cec705da573',
    prompt: () => getPositionPrompt('36'),
    uploadedAt: '2025-05-17T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '37',
    companyName: '알파자산운용',
    jobTitle: '투자관리팀 경력직원',
    conditions: ['투자관리', '경력 3년 이상'],
    jobType: '기획-전략',
    positionDescription:
      '알파자산운용의 투자관리팀에서 펀드 신탁회계 및 운용지시 업무를 담당할 경력직원을 모집합니다. 전통자산 및 대체, 인프라 운용지원 업무 경력을 갖추고, 대외보고서 작성 및 공시, 기타 펀드관리 등 상품업무 지원 업무를 수행하게 됩니다.',
    mainTask:
      '펀드 신탁회계 및 운용지시 업무 (전통자산 및 대체, 인프라 운용지원 업무 경력), 대외보고서 작성 및 공시, 기타 펀드관리 등 상품업무 지원',
    qualifications: [
      '금융업계 및 지원직무 관련 실무경력 3년 이상',
      '커뮤니케이션 능력이 원만하고, 긍정적이고 책임감이 강한 분',
    ],
    preferredQualifications: [
      '금융관련 학과 졸업자 및 관련자격증 소지자',
      '자산운용사, 수탁사, 사무관리사 업무 경력자',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-01-03/e5d29027-c2a1-4a62-8e95-291f3eec9063.png',
    url: 'https://www.kofia.or.kr/brd/m_96/view.do?seq=33676',
    prompt: () => getPositionPrompt('37'),
    uploadedAt: '2025-05-17T20:00:00+09:00',
    deadline: '2025-06-13T23:59:59+09:00',
  },
  {
    id: '38',
    companyName: '와이어트',
    jobTitle: '국내 물류 담당자',
    conditions: ['물류 관리', '경력 1-4년', '서울 강남구'],
    jobType: '기획-전략',
    positionDescription:
      '물류팀은 제품의 생산 이후 단계부터 고객에게 전달되기까지의 모든 물류 공급망을 관리하는 역할을 수행합니다. 재고관리, 국내 및 해외 배송 공급망 관리는 물론이고, 더 나아가 데이터 분석과 고객 서비스 지원까지 넓은 범위의 업무를 진행하고 있습니다. 정확하고 빠른 물류 운송을 목표로, 회사와 고객 모두 안심하고 만족하며 사용할 수 있도록 지원하는 팀입니다.',
    mainTask:
      '국내 B2C 채널 주문수집 및 출고관리, 국내 B2B 채널 발주확인 및 출고관리, 3PL 운영관리(재고 및 입출고)',
    qualifications: [
      '1년 이상의 B2C 국내 물류 관련(주문수집 등) 경력',
      'ERP, WMS, OMS 사용 경험(영림원, 플레이오토, 난소프트)',
      '인하우스 코스메틱 또는 생활소비재 업계 경력 보유',
      '외국인 지원자의 경우 비자(E-7 또는 동급) 보유 및 잔여 비자 기간이 남아있는 분, 국내 취업에 결격 사유가 없는 분',
    ],
    preferredQualifications: [
      '컴퓨터 활용 능력이 뛰어난 분(Excel 등)',
      '오류 발견 시 신속한 대처 및 처리가 가능한 분',
      '빠르고 꼼꼼한 업무처리 능력을 갖춘 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-11-08/27030378-a104-4a39-989f-21bb17701668.png',
    url: 'https://wyatt.ninehire.site/job_posting/MNEU6Jjo',
    prompt: () => getPositionPrompt('38'),
    uploadedAt: '2025-05-17T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '39',
    companyName: '와이어트',
    jobTitle: '개발구매 담당자',
    conditions: ['구매', '경력 1-3년', '서울 강남구'],
    jobType: '기획-전략',
    positionDescription:
      '구매팀은 브랜드의 마케팅 및 영업을 이슈 없이 진행할 수 있도록 공급망을 효율적으로 관리하는 팀입니다. 공급업체와의 협상, 가격 체결 및 조정, 재고 운영 전략, 비용 절감 계획을 수립하고 실행합니다. 특히, 기능성 헤어케어 No.1 [닥터포헤어]와 올리브영 헤어케어 1위 [어노브]의 성장을 공급 측면에서 뒷받침하며, 단순한 구매를 넘어 브랜드의 가치와 성과를 함께 만들어가는 팀입니다.',
    mainTask:
      '신제품 개발 일정 및 프로젝트 관리, 신제품 견적 및 발주 관리, 신제품 채번 및 관련 문서 관리, ERP 품목 등록 및 관리, 공급처 및 유관 부서 커뮤니케이션',
    qualifications: [
      '1년 이상 뷰티 및 생활소비재 업계에서의 개발구매 경력',
      'MS Office 사용이 가능한 분',
      '운전이 가능한 분',
      '외국인 지원자의 경우 비자(E-7 또는 동급) 보유 및 잔여 비자 기간이 남아있는 분, 국내 취업에 결격 사유가 없는 분',
    ],
    preferredQualifications: [
      '성장에 대한 욕구가 크고, 책임감을 가지고 적극적으로 일하는 분',
      '영림원 ERP 사용 경험이 있는 분',
      '일정 관리 및 원활한 커뮤니케이션 능력을 갖춘 분',
      'Notion, Slack 등 협업툴 사용 경험이 있는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-11-08/27030378-a104-4a39-989f-21bb17701668.png',
    url: 'https://wyatt.ninehire.site/job_posting/UtNOgx5q',
    prompt: () => getPositionPrompt('39'),
    uploadedAt: '2025-05-17T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '40',
    companyName: '케이씨텍',
    jobTitle: '미래소재 생산직',
    conditions: ['생산직', '신입', '경기 안성시'],
    jobType: '생산-기능직',
    positionDescription:
      '케이씨텍은 반도체 디스플레이 장비 및 소재 국산화를 추구하는 기업으로, 구성원들의 행복한 미래와 건강한 직장 생활을 위해 끊임없이 소통하며 수평적 커뮤니케이션과 서로 다름을 인정하는 상호 존중의 자세로 함께 나아가고 있습니다.',
    mainTask:
      'Powder/PrimeSol 생산 등 미래소재 제조 전반 생산 업무 담당, 주/야 교대 근무 (3조2교대, 6일 근무 3일 휴일), 주간 08:15~20:30 / 야간 20:15~08:30(인수인계 시간 포함)',
    qualifications: [
      '고졸 이상',
      '주/야 교대 근무 가능자',
      '원활한 협업 및 소통 역량 보유자',
      '책임감 및 성실함 보유자',
    ],
    preferredQualifications: [
      '생산직 또는 교대 근무 경험자',
      '지게차 운전 기능사 보유자',
      '안성 지역 인근 거주자',
      '국가유공자 및 장애인 등 취업 보호 대상자',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-23/86b7074e-ea55-43f1-aa9c-bce0afbb0548.png',
    url: 'https://kc-group.recruiter.co.kr/app/jobnotice/view?systemKindCode=MRS2&jobnoticeSn=216823',
    prompt: () => getPositionPrompt('40'),
    uploadedAt: '2025-05-17T20:00:00+09:00',
    deadline: '2025-05-22T23:59:59+09:00',
  },
  {
    id: '41',
    companyName: '현대글로비스',
    jobTitle: '인천공항 물류센터 운영 담당자',
    conditions: ['물류 센터 운영', '경력 3년 이상', '인천'],
    jobType: '무역-물류',
    positionDescription:
      '국내 최대 관문인 인천공항에 신규 개설된 물류센터에서, 특송 및 수출입 화물의 전반적인 운영을 책임지는 핵심 역할을 맡게 됩니다. 보세창고 운영부터 역직구 화물 관리, 고객사 응대, 협력사 조율, 물류 프로세스 개선까지 현장의 실무 경험과 물류 전문성을 쌓으며, 글로벌 공급망의 중심에서 성장할 수 있는 기회입니다. 빠르게 변화하는 공항 물류 현장에서, 직접 흐름을 설계하고 문제를 해결해가는 도전적인 경험을 제공해 드립니다.',
    mainTask:
      '인천공항 물류센터 운영 (수출입 화물 입출고, 재고 관리, 작업 현장 관리 및 운영 이슈 대응, 보세창고(GDC 및 일반보세) 운영 및 관리, 역직구(CBeC) 화물 입고/출고/재고관리/ 항공 수출입 조업 관리, 역직구 설비/자산 관리, 운영 프로세스 개선, 운영 원가 관리, 협력사 커뮤니케이션 및 현장 운영 조율), 사업 관리 (신규 고객사 입주 시 초기 사업 셋팅, 고객사 KPI 관리, 협력사/위수탁/노무 Risk 관리, 운영 원가 관리 및 정산 업무, 주말/휴일 비상 대응 및 운영 마감 업무 수행), 센터 안전/환경/CS관리 (고객사 CS 및 요구사항 대응, 사업장 내 안전 관리 및 위험요소 예방, 도급사·관계기관과의 유기적 협업)',
    qualifications: [
      '학사 이상의 학위 보유',
      '보세창고, 수/출입 조업, GDC 관련 현장 운영 경험 or 국제특송 운영 업무 지식 및 운영 실무 경험 (3년 이상)',
      '역직구(CBeC) 운영에 대한 이해(eCommerce 집화거점, Fulfillment 운영)',
      '물류 자동화 설비의 이해 및 운영 능력',
    ],
    preferredQualifications: [
      '물류관리사 등 물류 관련 자격증 보유자',
      '물류학 관련 전공 지식 보유자',
      '신규 공항 물류센터 구축 및 운영 경험 보유자',
      '국가유공자 및 장애인 등 취업보호대상자',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-08-15/19ff933b-c30a-47e2-a4e5-507dfd8a93cf.png',
    url: 'https://glovis.recruiter.co.kr/career/jobs/69847',
    prompt: () => getPositionPrompt('41'),
    uploadedAt: '2025-05-17T20:00:00+09:00',
    deadline: '2025-05-25T23:59:59+09:00',
  },
  {
    id: '42',
    companyName: '뉴빌리티',
    jobTitle: 'AI Robotics Engineer',
    conditions: ['AI 로봇 엔지니어', '경력 3년 이상', '서울 성동구'],
    jobType: 'AI-데이터',
    positionDescription:
      '뉴빌리티에서 기확보한 데이터를 기반으로 End to End Autonomy를 구현하는 것을 목표로 하며, 로봇으로부터 제공되는 센서 정보들을 사용하여 Deep 2D/3D perception 및 End-to-End motion planning과 같은 기능을 자율주행 팀 내 부서와 협업을 통해 구현하고, 이를 기반으로 Robot Foundation Model으로의 확장을 최종 목표로 합니다.',
    mainTask:
      'Object Detection / Semantic Segmentation / Depth Estimation 등의 딥러닝 기반 Computer Vision 기술 개발, Nvidia Issac Sim / Mujoco Simulator 등을 활용한 Sim2Real 학습 및 테스트 환경 구성, Robot Foundation Model 구축을 위한 Vision Language Model 활용과 Vision Language Action 관련 학습 알고리즘 설계 및 데이터 구축',
    qualifications: [
      'Computer Vision / Robotics / Simulation / Reinforcement Learning 관련 전공 석사 학위 혹은 3년 이상의 경력 보유',
      '딥러닝 모델을 활용한 Computer Vision 관련 태스크(Object Detection, Semantic Segmentation 등)에 대해 연구 및 구현 경험 보유',
      'RGB Image, IMU, GPS 등 로봇 센서 데이터를 입력으로 활용한 AI 모델 모델링 경험 보유',
      'Simulation 기반의 학습 환경을 활용하여 Real World의 문제를 해결한 경험 보유',
      'Reinforcement Learning 혹은 Imitation Learning 기반의 로봇 제어 관련 경험 보유',
      'Robotics 인지 판단/제어를 Vision Language Model, Vision Language Action Model 등을 활용해본 경험 보유',
    ],
    preferredQualifications: [
      'Computer Vision / Robotics / Simulation / Reinforcement Learning 관련 전공 박사 학위 이상 보유',
      'Simulation 환경을 활용한 학습 시스템 구축 및 Real World와의 Domain Gap을 줄이기 위한 real2sim/sim2real 관련 프로젝트 경험 보유',
      'VLA(Vision Language Action) 모델 학습을 위한 데이터 및 학습 파이프라인 구축 경험 보유',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-06/83cbabd3-7e48-4ded-9c97-b261066f1fa1.png',
    url: 'https://neubility.career.greetinghr.com/o/156608',
    prompt: () => getPositionPrompt('42'),
    uploadedAt: '2025-05-19T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '43',
    companyName: '클라썸(CLASSUM)',
    jobTitle: '백엔드(Node.js) 개발자',
    conditions: ['백엔드 개발', '경력 2년 이상', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      '빠르게 성장하는 B2B SaaS 섹터에서 한국을 대표하는 스타트업으로, 기업 HRD와 대학 교육 시장에서 숫자로 증명하는 탄탄한 성장을 만들어가고 있습니다. AI나 Skill-based HR 등 기술 및 도메인의 새로운 트렌드를 적극적으로 제품에 반영하며 기업 HRD/대학 교육 시장의 고객들에게 혁신적인 솔루션을 제공하는 포지션입니다.',
    mainTask:
      '클라썸 웹, 어플리케이션을 위한 비즈니스 로직 개발, AWS 기반의 서버리스 인프라 구성, 클라썸 서비스 품질 향상을 위한 다양한 최적화 작업 및 리서치',
    qualifications: [
      '백엔드 개발에서 2년 이상의 경험이 있거나 그에 준하는 실력을 갖춘 분',
      'AWS에서 아키텍처 설계에 경험이 많은 분',
      'Node.js와 JavaScript 또는 TypeScript 에 대한 높은 이해를 갖춘 분',
      'RDBMS, NoSQL에 대한 이해를 갖춘 분',
      'SQL 최적화 경험이 있는 분',
      '단위테스트, 기능테스트, 종단 테스트, 빌드 자동화, 지속적 통합의 경험이 있는 분',
      '스스로의 목표와 일정을 관리할 수 있는 분',
      '배움에 대한 열정을 갖고, 지속적이고 효과적으로 피드백을 주고 받는 팀 성장을 추구하는 분',
      '맡은 작업에 대한 오너십을 갖고, 이를 완성시키는 일에 열정이 있는 분',
    ],
    preferredQualifications: [
      '서버리스로 상용 서비스를 운영한 경험이 있는 분',
      'WebSocket 혹은 socket.io로 많은 사람들이 접속하는 실시간 채팅 서비스를 구현한 경험이 있는 분',
      '성장하는 서비스에서 결제 및 VAN 연동 경험이 있는 분',
      '영상 스트리밍 서비스를 개발하고 DRM을 적용해본 경험이 있는 분',
      '여러 국가에 걸쳐 서비스를 운영/배포한 경험이 있는 분',
      '다양한 외부 서비스와 연동한 경험이 있는 분',
      'MS Teams, Slack, Zoom 연동 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-12/99fa64d6-3c96-42db-aeaa-728a723744d6.png',
    url: 'https://careers.classum.com/o/12360',
    prompt: () => getPositionPrompt('43'),
    uploadedAt: '2025-05-19T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '44',
    companyName: '넷마블(Netmarble)',
    jobTitle: '웹 프론트엔드 개발자',
    conditions: ['프론트엔드 개발', '경력 3년 이상', '서울 구로구'],
    jobType: 'IT-개발',
    positionDescription:
      '게임 사이트 및 웹 플랫폼 서비스를 개발하는 포지션으로, 단계적 게임 론칭 전략에 따른 브랜드 사이트 개발부터 퍼블리싱 정책에 맞는 신규 기능 제공 및 신속한 웹 플랫폼 서비스 구축까지 담당합니다.',
    mainTask:
      '게임 사이트 및 웹 플랫폼 서비스 개발, 단계적 게임 론칭 전략에 따른 브랜드 사이트 개발 및 안정적 운영, 퍼블리싱 정책에 맞는 신규 기능 제공/확대 및 신속한 웹 플랫폼 서비스 구축, 기존 사이트 유지 보수 및 안정적 운영, 레거시 서비스에 대한 프레임워크 최신화, 클러스터 통합을 위한 리소스 절감',
    qualifications: [
      '학사 이상',
      '웹 Front-End 개발 경력 3년 이상',
      'javascript, vue, react 개발 및 운영 지식',
      'front-end framework를 활용한 webApp 개발 경험',
      'html, css, sass를 활용한 markup 개발 지식',
      '공통화/모듈화/자동화를 위한 설계 능력 보유',
      'SSR 서비스 적용 경험',
    ],
    preferredQualifications: [
      '컴퓨터 관련 전공자',
      'javascript 성능 튜닝 지식',
      '컨테이너 기반 CI/CD 환경 경험 보유',
      '유관부서와의 원활한 커뮤니케이션 가능',
      '지속적인 학습능력과 문제해결 능력 보유',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-08-14/1c746868-dfde-48a4-824c-b420d26ad2a2.png',
    url: 'https://career.netmarble.com/announce/view?anno_id=1461',
    prompt: () => getPositionPrompt('44'),
    uploadedAt: '2025-05-19T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '45',
    companyName: '넷마블(Netmarble)',
    jobTitle: '웹 백엔드 개발자',
    conditions: ['백엔드 개발', '경력 3년 이상', '서울 구로구'],
    jobType: 'IT-개발',
    positionDescription:
      '결제 시스템 및 웹 상점 개발을 담당하는 백엔드 개발자 포지션으로, 구독, 쿠폰 등의 결제 시스템부터 PG 연동, 웹 이벤트 페이지 개발까지 다양한 웹 서비스 백엔드 개발을 담당합니다.',
    mainTask:
      '결제 시스템(구독,쿠폰 등) 개발 및 운영, PG 연동 개발, 결제 운영 툴 개발, 웹 상점 개발 및 운영, 웹 이벤트 페이지 개발',
    qualifications: [
      '학사 이상',
      '웹 Back-End 개발 경력 3년 이상',
      'Java, Spring Framework 지식, Linux 환경에서 WAS 및 WebServer 운영 지식',
      'RDBMS(mysql,mssql 등) 지식',
      '공통화/모듈화/자동화를 위한 설계 능력 보유',
      'RESTful API에 대한 이해도',
    ],
    preferredQualifications: [
      '컴퓨터 관련 전공자',
      '결제 시스템 개발 경험',
      '빌링 및 PG 연동/정산 서비스 설계/개발/운영 경험자',
      '효과적인 스키마 설계와 쿼리 튜닝이 가능하신 분',
      '컨테이너 기반 CI/CD 환경 경험 보유',
      '유관부서와의 원활한 커뮤니케이션 가능',
      '지속적인 학습능력과 문제해결 능력 보유',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-08-14/1c746868-dfde-48a4-824c-b420d26ad2a2.png',
    url: 'https://career.netmarble.com/announce/view?anno_id=1460',
    prompt: () => getPositionPrompt('45'),
    uploadedAt: '2025-05-19T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '46',
    companyName: '하나금융융합기술원',
    jobTitle: 'Data Science 직무',
    conditions: ['데이터 사이언티스트', '신입', '서울 강남구', '인턴'],
    jobType: 'AI-데이터',
    positionDescription:
      '하나금융융합기술원에서 진행하는 체험형 인턴 프로그램으로, 데이터 전처리 및 분석부터 개인화 이력 태그 개발, 예측 모델링까지 데이터 사이언스 전반의 업무를 경험할 수 있는 포지션입니다.',
    mainTask:
      'Data 전처리 및 분석, Data 분석 기반 개인화 이력 태그 개발, 태그 이력 기반의 예측 태그 개발 (예측 모델링), 태그 생성 자동화 모델 개발',
    qualifications: [
      '4년제 대학교 재학생, 졸업예정자, 기졸업하신 분 (대학원 재학생 및 수료/졸업(예정)이신 분 지원 가능)',
      '2025년 7월 이후 취업예정인 중로일정까지 풀타임 근무가 가능하신 분',
      '남자의 경우, 군필 또는 군면제이신 분',
      '해외여행에 결격 사유가 없으신 분',
      'AI/ML 프로그래밍 Tool 활용이 가능하신 분',
      'SQL, Hive 등 DB/빅데이터 Tool 활용이 가능하신 분',
    ],
    preferredQualifications: [
      '통계학, 산업공학 등 AI/ML 관련 전공자',
      'Confluence 등 협업 Tool 활용이 가능하신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-13/01904410-7fc3-41cd-8f97-8de6539fed8b.png',
    url: 'https://hanati.recruiter.co.kr/app/jobnotice/view?systemKindCode=MRS2&jobnoticeSn=215091',
    prompt: () => getPositionPrompt('46'),
    uploadedAt: '2025-05-19T20:00:00+09:00',
    deadline: '2025-05-29T23:59:59+09:00',
  },
  {
    id: '47',
    companyName: '하나금융융합기술원',
    jobTitle: 'Computer Vision 직무',
    conditions: ['AI 엔지니어', '신입', '서울 강남구', '인턴'],
    jobType: 'AI-데이터',
    positionDescription:
      '하나금융융합기술원에서 진행하는 체험형 인턴 프로그램으로, E2E OCR 모델 성능 개선 및 OCR 관련 데이터 처리, 분석을 중심으로 Computer Vision 기술을 실무에 적용하는 경험을 쌓을 수 있는 포지션입니다.',
    mainTask:
      'E2E(End-to-End) OCR 모델 성능 개선, OCR 관련 데이터 처리, 분석 및 수집, OCR 성능 이슈 분석',
    qualifications: [
      '4년제 대학교 재학생, 졸업예정자, 기졸업하신 분 (대학원 재학생 및 수료/졸업(예정)이신 분 지원 가능)',
      '2025년 7월 이후 취업예정인 중로일정까지 풀타임 근무가 가능하신 분',
      '남자의 경우, 군필 또는 군면제이신 분',
      '해외여행에 결격 사유가 없으신 분',
      'AI/ML 프로그래밍 Tool 활용이 가능하신 분',
    ],
    preferredQualifications: [
      'Document Understanding 프로젝트를 경험하신 분',
      'OCR 관련 프로젝트를 경험하신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-13/01904410-7fc3-41cd-8f97-8de6539fed8b.png',
    url: 'https://hanati.recruiter.co.kr/app/jobnotice/view?systemKindCode=MRS2&jobnoticeSn=215091',
    prompt: () => getPositionPrompt('47'),
    uploadedAt: '2025-05-19T20:00:00+09:00',
    deadline: '2025-05-29T23:59:59+09:00',
  },
  {
    id: '48',
    companyName: '하나금융융합기술원',
    jobTitle: 'Natural Language Processing (자연어처리) 직무',
    conditions: ['AI 엔지니어', '신입', '서울 강남구', '인턴'],
    jobType: 'AI-데이터',
    positionDescription:
      '하나금융융합기술원에서 진행하는 체험형 인턴 프로그램으로, 다국어 언어 모델 개발부터 최신 LLM 연구방법론, Prompt Engineering까지 자연어처리의 최신 기술을 연구개발하는 포지션입니다.',
    mainTask:
      '다국어 언어 모델 개발을 위한 Data 생성 및 평가 파이프라인 연구 개발, LLM 데이터, 벤치마크 관련 최신 연구방법론 리서치 및 검증, Chain of Thought, Few Shot, Retrieval Augmented Generation 등 Prompt Engineering 연구 개발 Prompt 설계',
    qualifications: [
      '4년제 대학교 재학생, 졸업예정자, 기졸업하신 분 (대학원 재학생 및 수료/졸업(예정)이신 분 지원 가능)',
      '2025년 7월 이후 취업예정인 중로일정까지 풀타임 근무가 가능하신 분',
      '남자의 경우, 군필 또는 군면제이신 분',
      '해외여행에 결격 사유가 없으신 분',
      '컴퓨터공학, 전산학 등 관련 학위 석사이상 보유자 또는 대학원에 재학중이신 분',
      'Python 기반 프로그래밍이 가능하신 분',
      '자연어처리(NLP) 연구 역량을 보유하신 분',
    ],
    preferredQualifications: [
      'Pytorch, HuggingFace를 활용하여 Fine-Tuning 관련 NLP 프로젝트를 경험하신 분',
      'Open AI, Anthropic 등 LLM API 기반의 다국어 코퍼스(corpus), 합성 Data 구축을 경험하신 분',
      '금융, 고객성향 등 도메인 특화 Data 개발을 경험하신 분',
      'Prompt Engineering을 경험하신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-13/01904410-7fc3-41cd-8f97-8de6539fed8b.png',
    url: 'https://hanati.recruiter.co.kr/app/jobnotice/view?systemKindCode=MRS2&jobnoticeSn=215091',
    prompt: () => getPositionPrompt('48'),
    uploadedAt: '2025-05-19T20:00:00+09:00',
    deadline: '2025-05-29T23:59:59+09:00',
  },
  {
    id: '49',
    companyName: '마이리얼트립',
    jobTitle:
      '온디맨드 현지 가이드 매칭 플랫폼 풀스택 개발자(Product Engineer)',
    conditions: ['풀스택 개발', '경력 무관', '서울'],
    jobType: 'IT-개발',
    positionDescription:
      '온디맨드 서비스는 여행 중 현지에 사는 한국인 가이드의 도움이 필요할 때 즉시 호출할 수 있는 서비스입니다. 온디맨드팀은 새롭게 만들어진 풀스택 조직으로 팀원 모두가 각자의 직무 영역에 제한을 두지 않고 온디맨드 서비스를 키워나가는 데 집중하는 포지션입니다.',
    mainTask:
      '온디맨드 서비스를 위한 전체 시스템 설계 및 개발, BE API 개발 및 필요시 클라이언트 파트 개발, AI 기술을 활용해 팀의 생산성과 효율성을 극대화',
    qualifications: [
      'BE기반의 Full Stack 개발 역량 보유 혹은 확장이 가능한 분',
      '문제 해결력과 실행력이 뛰어난 분',
      '변화에 유연하고 로드맵 관리에 능숙한 분',
    ],
    preferredQualifications: [
      '새로운 서비스를 런칭하고 이를 성장시킨 경험이 있으신 분',
      '여러 조직에 디펜던시가 있을 때 이를 직접 해결할 의지가 있으신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-10/dc51c564-2d75-4f8f-83f4-98d56396a233.png',
    url: 'https://careers.myrealtrip.com/recruit/157769?utm_source=zighang&utm_medium=referral',
    prompt: () => getPositionPrompt('49'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '50',
    companyName: '다음설립준비법인(카카오)',
    jobTitle: 'Mobile App(iOS) Developer',
    conditions: ['iOS 개발', '경력 3-10년', '경기 성남시'],
    jobType: 'IT-개발',
    positionDescription:
      '다음설립준비법인은 카카오 그룹사 소속으로, Daum 서비스를 제공하는 회사입니다. Mobile App 개발조직은 Daum 서비스들의 앱 개발을 담당하며, 특히 모바일 앱 만의 차별화된 사용자 경험을 만들어 사용이 즐겁고 자꾸만 열어보고 싶은 앱 서비스를 만드는 도전을 이어가고 있습니다.',
    mainTask:
      '다음의 모바일 앱의 기능 개발 및 유지보수, 앱 안정성 및 품질 개선, iOS 신규 버전 및 앱스토어 정책 대응, 다음의 모바일 앱의 배포 및 운영, 테스트 자동화 및 CI/CD 연동, 앱스토어 배포 및 운영, 배포 후 모니터링 및 대응',
    qualifications: ['Swift 기반 iOS 앱 개발 경력 3년 이상'],
    preferredQualifications: [
      'SwiftUI 개발 경험을 보유하신 분',
      'Combine, Swift concurrency에 대한 이해가 높으신 분',
      'WKWebView, REST API를 사용한 개발 경험이 풍부하신 분',
      'TCA, RIBs, ReactorKit 아키텍처 경험이 있으신 분',
      '빠르게 변화하는 환경에서도 유연하게 적응하고 주도적으로 문제를 해결할 수 있는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-07-30/24e97f1f-4d82-44cd-89a1-3ab53fc096d9.png',
    url: 'https://www.wanted.co.kr/wd/283826',
    prompt: () => getPositionPrompt('50'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '2025-05-31T23:59:59+09:00',
  },
  {
    id: '51',
    companyName: '더즌(dozn)',
    jobTitle: '시스템개발2팀 백엔드(JAVA) 개발자',
    conditions: ['백엔드 개발', '신입', '서울 서초구'],
    jobType: 'IT-개발',
    positionDescription:
      '더즌은 펌뱅킹, 가상계좌 등 PG 및 결제 서비스와 본인인증, 청구서, 알림톡 등 카카오페이와 제휴하는 서비스를 제공하는 회사입니다. 이 포지션은 원화 및 외화 API 개발 및 유지보수를 담당하는 백엔드 개발자 역할입니다.',
    mainTask: '원화 및 외화 API 개발 및 유지보수',
    qualifications: [
      '컴퓨터 공학 또는 관련 학과를 전공하신 분 (학사 이상)',
      'Java 프로그래밍 언어를 기본적으로 숙지하며, Spring Framework를 경험하신 분',
      '객체지향 프로그래밍(OOP) 개념에 대한 이해가 있으신 분',
      'Git 등 버전 관리 시스템 경험을 보유하신 분',
      '데이터베이스 관련 기본 지식(SQL)을 보유하신 분',
    ],
    preferredQualifications: [
      'JSP(Java Server Page), HTML, CSS, JavaScript에 대한 기본 지식을 보유하신 분',
      '네트워크(TCP/IP)에 대한 기본 지식을 보유하신 분',
      'Oracle DB 사용 또는 쿼리 튜닝 경험이 있으신 분',
      '로그/모니터링을 위한 ELK(Elasticsearch, Kibana, Beats, Logstash) 경험이 있으신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-15/0f1430ba-41a5-4ba2-a71c-977f98847119.png',
    url: 'https://www.wanted.co.kr/wd/261918',
    prompt: () => getPositionPrompt('51'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '52',
    companyName: '커넥트웨이브',
    jobTitle: '[메이크샵] 백엔드 개발자(APM)',
    conditions: ['백엔드 개발', '신입-경력 7년', '서울 금천구'],
    jobType: 'IT-개발',
    positionDescription:
      '커넥트웨이브는 컨슈머 커머스(다나와, 에누리), 셀러 커머스(메이크샵, 플레이오토 등), 크로스보더 커머스(몰테일) 등의 플랫폼을 통해 토탈 플랫폼으로 성장하고 있는 회사입니다. 이 포지션은 메이크샵의 APM 시스템 개발 및 모니터링을 담당하는 백엔드 개발자 역할입니다.',
    mainTask:
      '메이크샵 APM 시스템을 개발하고 전반적인 모니터링을 담당, PHP 프레임워크(Laravel)기반 시스템 개발 & 모니터링, 오류 감지 기능 개발 & 모니터링, 클라우드 시스템 관리, 메이크샵 서비스 모니터링, 검색엔진 최적화(SEO) 개발, Push & MAIL 서비스 개발 및 모니터링, 클라우드 시스템 운영 QA 지원',
    qualifications: [
      '신입부터, 백엔드 개발 3년 이내의 경력을 보유하신 분',
      'PHP 프레임워크(Laravel) 사용 경험이 있거나, 관심이 있으신 분',
      'MySQL 등 RDBMS 개발을 경험하신 분',
      'Javascript, CSS, HTML 웹페이지 개발 경험이 있으신 분',
      'Linux 서버 운영 경험이 있으신 분',
      'Git,svn 등 버전 관리 시스템 사용 경험이 있으신 분',
      '컴퓨터 공학, IT 전공하신 분',
      '코드리뷰 등을 통해 주변 동료들과 서로 좋은 영향을 주고받으실 수 있는 분',
    ],
    preferredQualifications: [
      '대용량 데이터 처리 경험이 있으신 분',
      'RESTful API 개발 경험이 있으신 분',
      'PHP 7.0 이상 개발 경험이 있으신 분',
      'Python 언어 개발 경험이 있으신 분',
      '웹 성능 최적화 및 SEO 경험이 있으신 분',
      'E-commerce 관련 분야 경험이 있으신 분',
      '오픈소스 활용 경험이 있으신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-27/59f9ca1d-8095-4f7c-9128-8b0b88bd6d22.png',
    url: 'https://www.wanted.co.kr/wd/284165',
    prompt: () => getPositionPrompt('52'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '53',
    companyName: '데이터메이커',
    jobTitle: '[경력] AI사업 백엔드 개발자',
    conditions: ['백엔드 개발', '경력 3년 이상', '대전 유성구'],
    jobType: 'AI-데이터',
    positionDescription:
      '데이터메이커에서 B2B, B2G 데이터 라벨링 사업 기술지원과 MLOps 및 라벨링 플랫폼 플러그인 개발, AI사업 API 서비스 기술지원 및 구축을 담당할 백엔드 개발자를 모집합니다.',
    mainTask:
      'B2B, B2G 데이터 라벨링 사업 기술지원, MLOps 및 라벨링 플랫폼 플러그인 개발, B2B, B2G AI사업 API 서비스 기술지원 및 구축(On-Premise)',
    qualifications: [
      '3년 이상 웹 백앤드 개발 이력이 있는 분',
      'Restful API 설계 및 개발을 잘 이해하고 있는 분',
      'ORM 기반 비즈니스 설계 및 구현 경험이 있는 분',
      'PostgreSQL, MySQL,Oracle 등의 RDBMS의 이해와 경험이 있는 분',
      '하나 이상의 객체지향 프로그래밍 언어를 능숙하게 사용해본 경험이 있는 분',
      '하나 이상의 웹 프레임워크 (Django, Spring, Rails, Node.js 등)를 사용해본 경험이 있는 분',
    ],
    preferredQualifications: [
      'Docker, Kubernetes 사용경험이 있는 분',
      '동료와의 협업 및 코드리뷰를 즐길 수 있는 분',
      '설계 문서화 및 공유를 통해 함께 성장하실 분',
      'AI 기반 서비스 개발 및 운영의 경험이 있는 분',
      'Django REST Framework 사용 경험이 있는 분',
      'ML 인프라 및 라이프사이클에 대한 이해가 있는 분',
      '효과적인 테스트 케이스 작성을 고민하고 실천하는 분',
      'Linux 등 Unix 기반 OS에 대한 이해 및 사용 경험이 있는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-11-11/691c1bc1-b7b5-4c2c-b3dd-4ecdf89543df.png',
    url: 'https://www.datamaker.io/career/recruitments/44',
    prompt: () => getPositionPrompt('53'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '54',
    companyName: '에스아이에이(SIA)',
    jobTitle: 'Frontend Engineer (2년 이상)',
    conditions: ['프론트엔드 개발', '경력 2년 이상', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      '에스아이에이는 인공지능 기반 위성/항공 영상 분석 기업으로, 국방·안보·우주 분야의 AI 기반 위성영상 분석 모니터링 플랫폼 OVISION Int와 위성영상 초해상화 솔루션 SuperX 제품의 핵심 사용자 인터페이스를 개발하고 관리하는 프론트엔드 엔지니어를 모집합니다.',
    mainTask:
      'OVISION Int 및 SuperX 제품 프론트엔드 개발, 사용자 인터페이스 설계 및 구현, 제품의 사용성 지속 개선, Product Manager, Product Designer와 협업하여 사용자 경험 최적화, 프론트엔드 코드베이스 관리 및 최적화, 문제 발생 시 원인 파악 및 해결, 적합한 최신 기술 도입, 개발 환경 표준화 및 기술 트렌드 도입, 다양한 구성원과 효과적으로 소통, 제품 출시 후 지속적인 성능과 품질 확인, 서비스 운영 데이터 기반 제품 개선',
    qualifications: [
      '2년 이상 프론트엔드 개발을 경험하신 분',
      'React 사용이 능숙하신 분',
      '자기 주도적인 성장이 가능하신 분',
      '적극적으로 커뮤니케이션하시는 분',
      '관찰력이 높고 완성도를 챙기시는 분',
    ],
    preferredQualifications: [
      '다양한 직군과 협업을 경험해보신 분',
      '성능을 개선하고 경험을 공유해보신 분',
      '디자인 시스템을 구축 및 운영해보신 분',
      '서비스 메인테이닝을 하면서 일정, 태스크 관리를 직접 해보신 분',
      '단위 테스트, 통합 테스트 자동화 및 배포 자동화 경험이 있으신 분',
    ],
    logoUrl:
      '	https://d2juy7qzamcf56.cloudfront.net/2025-03-10/0e8ec3f0-92cb-4975-9558-475e6d349a2a.png',
    url: 'https://www.wanted.co.kr/wd/284092',
    prompt: () => getPositionPrompt('54'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '55',
    companyName: '피트릭스(Fittrix)',
    jobTitle: '백엔드 개발자',
    conditions: ['백엔드 개발', '경력 5년 이상', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      "피트릭스는 현대자동차 사내벤처로 출발하여 2020년 스핀오프 한 디지털 헬스케어 기업으로, 신체 데이터를 활용한 개인 맞춤형 건강 관리 솔루션을 제공합니다. '아웃바디 AI 분석 플랫폼'은 피트니스 센터, 필라테스 스튜디오, 기업 내 건강검진 센터, 병원 등에서 체형과 근육 불균형을 검사하고 최적화된 운동 개선 방법을 제시하는 서비스입니다.",
    mainTask:
      'Azure 기반의 인프라를 설계 및 개발, Node.js 기반의 웹 서비스 시스템 구축, 서비스 데이터를 관리하는 DB 설계 및 구축, 장애 발생시 빠르게 파악하기 위한 모니터링 시스템 구축, 테스트, 로깅, 배포환경에서 비효율적이거나 개선할 수 있는 부분들을 개선',
    qualifications: [
      '5년 이상의 웹 서버 개발 경험이 있으신 분',
      '데이터 기반의 서비스를 경험해 보신 분',
      '서비스기반의 DB 설계 및 쿼리 작성에 능숙하신 분',
      '다양한 장애 환경을 능숙하게 대응하실 수 있는 분',
      'Git등 분산 버전 관리 시스템에 능숙하신 분',
      'Azure(GCP, AWS) 등 클라우드 서비스를 개발, 운영, 관리에 능숙한 분',
      '모니터링 시스템을 개선하고 고가용성 아키텍처를 구현하여 서비스 안정성을 높일 수 있는 분',
      '서비스 데이터의 안정성과 Compliance를 준수하여 서비스를 개발 운영해 보신 분',
    ],
    preferredQualifications: [
      '컴퓨터공학 관련 분야 전공자',
      '클린 아키텍쳐에 관한 이해가 있으신 분',
      '구독 기반의 상용 서비스를 개발 및 운영한 경험이 있으신 분',
      'Node.js기반의 웹 서비스 개발 경험이 있으신 분',
      'Git등 분산 버전 관리 시스템에 능숙하신 분',
      '다양한 장애 환경을 능숙하게 대응하실 수 있는 분',
      '테스트 및 배포 자동화 경험이 있으신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-11-18/be1beb19-95bb-4e04-86c0-95833654b8ae.png',
    url: 'https://www.wanted.co.kr/wd/284005',
    prompt: () => getPositionPrompt('55'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '56',
    companyName: '커넥트웨이브',
    jobTitle: '[메이크샵] 백엔드 개발자(Data실)',
    conditions: ['백엔드 개발', '경력 2년 이상', '서울 금천구'],
    jobType: 'IT-개발',
    positionDescription:
      '커넥트웨이브는 다나와, 에누리, 메이크샵, 플레이오토 등 다양한 커머스 플랫폼을 인수합병하여 성장하고 있는 회사입니다. 이 포지션은 메이크샵의 다찾다 검색 엔진을 유지보수하고 기능을 개발하며, 검색 엔진 서비스의 백오피스를 개발하는 역할입니다.',
    mainTask:
      '메이크샵 다찾다 검색 엔진을 유지 보수하고 기능을 개발, 검색 엔진 서비스의 백오피스를 개발',
    qualifications: [
      '백엔드 개발 2년 이상의 경험을 보유하신 분',
      'Elasticsearch 기반의 검색 서비스 개발 경험을 보유하신 분',
      'NodeJS, Python 등 백엔드 개발 경험을 보유하신 분',
      'NestJs, FastAPI 등 프레임워크 개발 경험을 보유하신 분',
    ],
    preferredQualifications: [
      'Kafka Connect를 이용하여 ETL 운영 경험을 보유하신 분',
      'Logstash, Kibana, Docker 사용 경험을 보유하신 분',
      'Linux 환경의 운영 및 스크립트 개발 경험을 보유하신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-27/59f9ca1d-8095-4f7c-9128-8b0b88bd6d22.png',
    url: 'https://www.wanted.co.kr/wd/284164',
    prompt: () => getPositionPrompt('56'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '57',
    companyName: '데이터메이커',
    jobTitle: '[경력] AI사업 프론트엔드 개발자',
    conditions: ['프론트엔드 개발', '경력 3년 이상', '대전 유성구'],
    jobType: 'IT-개발',
    positionDescription:
      '데이터메이커에서 B2B, B2G AI사업 관련 UI/UX 개발을 담당할 프론트엔드 개발자를 모집합니다. 온프레미스 환경의 프로젝트에서 사용자 친화적인 인터페이스를 구현하는 역할을 수행합니다.',
    mainTask: 'B2B, B2G AI사업관련 UI/UX 개발(On-Premise)',
    qualifications: [
      '3년 이상의 웹 프론트엔드 개발 경험이 있는 분',
      'UI/UX 에 대한 관심과 이해가 있는 분',
      'Rest API 관련 지식 또는 연동 경험이 있는 분',
      'Webpack, Babel 에 대한 지식과 경험이 있는 분',
      'HTML(5), CSS, JavaScript(ES5+) 에 대해 잘 이해하고 경험이 있는 분',
      '프론트엔드 프레임워크 및 라이브러리(Vue, Nuxt, React, Angular 등) 사용 경험이 있는 분',
    ],
    preferredQualifications: [
      'Vue, Nuxt.js 에 대한 지식과 경험이 있는 분',
      '동료와의 협업 및 코드리뷰를 즐길 수 있는 분',
      '설계 문서화 및 공유를 통해 함께 성장하실 분',
      '백엔드 서버 및 네트워크에 대한 이해도가 있는 분',
      '바닐라 자바스크립트를 잘 이해하고 활용가능한 분',
      'Webpack Module Federation 실무 경험이 있는 분',
      'ML 라이프사이클에 대한 이해와 데이터 핸들링 경험이 있는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-11-11/691c1bc1-b7b5-4c2c-b3dd-4ecdf89543df.png',
    url: 'https://www.datamaker.io/career/recruitments/45',
    prompt: () => getPositionPrompt('57'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '58',
    companyName: '카카오뱅크',
    jobTitle: '모의해킹 및 취약점분석 담당자',
    conditions: ['보안 엔지니어', '경력 2년 이상', '경기 성남시'],
    jobType: 'IT-개발',
    positionDescription:
      '카카오뱅크 어플리케이션보안팀에서 해킹 및 침해 위협으로부터 안전한 금융 서비스를 제공하기 위해 모의해킹과 취약점 분석을 수행하는 담당자를 모집합니다. 실제 공격자 관점에서 서비스를 검증 및 보완하고, 신규 취약점 분석 및 Security Research 활동을 통해 보안을 강화하는 역할입니다.',
    mainTask:
      '웹, 모바일 기반 서비스 대상의 모의해킹 수행, 온프렘(on-prem) 및 클라우드 인프라 및 임직원 업무환경 대상의 모의 침투 테스트 수행 및 외부(전문)기관 협업, LLM 서비스 및 AI Ecosystem 환경에서의 신규 취약점 발굴, 모바일 앱 보안 강화를 위한 보안기술 연구 및 침해 대응 기술적 방어 기술(Code) 개발, Security Research 및 신규 취약점 분석',
    qualifications: [
      '모바일 운영체제 및 웹 서비스 전반에 대한 기본 보안 메커니즘을 이해하고 있는 분',
      '모바일 앱, 홈페이지 취약점 진단 지식 및 실무 경험이 있는 분',
      '서비스 환경을 고려하여 해킹 위협에 대한 기술적 보호 대책 수립이 가능한 분',
      '점검 자동화 및 모바일/웹 서비스의 자체 방어코드(Proof Of Concept) 개발 역량을 보유한 분',
      '관련 경력이 2년 이상인 분',
    ],
    preferredQualifications: [
      '국내/외 해킹대회 수상 경력자 및 버그바운티 신고 포상 이력이 있는 분',
      '모바일/웹 개발 경력 보유 및 IT 관련 학과 전공인 분',
      '국가유공자 및 장애인 등 취업보호대상자는 관계법령에 따라 우대',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-08-02/f7caf020-feec-4641-b093-cb5ce8ff402e.png',
    url: 'https://recruit.kakaobank.com/jobs/217136',
    prompt: () => getPositionPrompt('58'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '2025-05-31T23:59:59+09:00',
  },
  {
    id: '59',
    companyName: '윤회(CARE ID)',
    jobTitle: '[풀스택] 프론트엔드·백엔드',
    conditions: ['풀스택 개발', '경력 3년 이상', '서울 서대문구'],
    jobType: 'IT-개발',
    positionDescription:
      'CARE ID는 낙후된 패션 산업의 DX/AX를 지원하는 순환 패션 플랫폼입니다. 이 포지션은 패션 산업 솔루션 구축 및 관리를 담당하는 풀스택 개발자 역할로, 백엔드와 프론트엔드 영역을 두루 담당합니다.',
    mainTask:
      '패션 산업 솔루션 구축 및 관리, 데이터베이스 설계·구축 및 정규화, 대규모 데이터 수집/저장/처리/변환 파이프라인 설계·구축, 데이터레이크(Data Lake) 구축 및 관리, 클라우드(AWS) 배포 및 CI/CD 파이프라인 구축·관리, 솔루션에 필요한 API 설계/테스트/최적화, 데이터 암호화 및 통신간 암호화 적용, 솔루션 UI 구현·업데이트·유지보수, 프론트엔드 버전 관리, 컴포넌트 단위로 또는 기능 단위로 프론트 구현, 렌더링 성능 최적화, 빠른 프론트엔드 코드 리팩토링, PDF/EXCEL/이미지 등 다양한 파일 클라이언트 부문에서 처리',
    qualifications: [
      '컴퓨터 과학, 데이터 공학, 통계학등 관련 학사 이상 또는 이에 준하는 실력 보유',
      '개발 경력 3년 이상 또는 이에 준하는 역량 보유',
      '데이터베이스 구축 및 설계 경험 필수',
      'Javascript, Python 등 개발 언어 능숙',
      '운용 서비스 클라우드(AWS, GCP, Orcale, Azure 등) Container Orchestration 배포 경험 필수',
      'Github 협업 개발 프로세스 숙련자',
      '영어 (기술 문서 이해 및 간단한 커뮤니케이션) 가능',
    ],
    preferredQualifications: [
      '패션/텍스타일 관련 지식 보유자 또는 업무 경험',
      'AI/머신러닝 기반 프로젝트 경험 보유자',
      '서비스의 확장성을 고려해서 개발이 가능하신 분',
      '클라우드 데이터 엔지니어 자격증 보유자',
      '새로운 기술에 대한 높은 학습 의지 및 성장 가능성이 높은분',
      '자신이 맡은 일에 책임을 다하여 수행할 수 있는분',
      '창의적인 생각을 할 수 있는 분',
      '자신의 의견을 눈치보지 않고 마음껏 꺼내실 수 있는분',
      '실패를 통해 더 성장할 수 있는분',
      '서비스의 이상과 현실을 명확히 구분할 수 있는분',
      '업무의 스케줄 관리를 엄하게 관리할 수 있는분',
      '팀원간의 소통이 원활하고 팀의 목표에 동기화가 가능하신분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-03-20/1425ee3c-cfc3-4c52-8302-db1b8c12b91a.png',
    url: 'https://www.wanted.co.kr/wd/284075',
    prompt: () => getPositionPrompt('59'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '60',
    companyName: '코드잇(codeit)',
    jobTitle: '백엔드 엔지니어',
    conditions: ['백엔드 개발', '경력 3-10년', '서울 중구'],
    jobType: 'IT-개발',
    positionDescription:
      '코드잇은 인공지능 기술을 활용한 코딩 교육 솔루션 기업으로, 유저들이 브라우저에서 다양한 프로그래밍 언어를 실행할 수 있는 환경을 제공합니다. 백엔드 엔지니어는 코드잇 메인 서비스 개발/운영과 실행기 시스템 개발/운영, 인프라 관리, 데이터 분석 등을 담당하게 됩니다.',
    mainTask:
      '코드잇 메인 서비스 개발 및 운영, 내부에서 만들어진 콘텐츠를 유저에게 제공하는 API 개발, 유저의 가입/결제/강의 수강/커뮤니티 등 기능 개선, 브라우저에서 코드를 실행할 수 있는 실행기 서비스 개발 및 운영, AWS EKS 기반 인프라 관리, Amplitude/Google Analytics/내부 DB를 활용한 데이터 분석',
    qualifications: [
      '알고리즘과 자료구조에 대한 이해를 갖춘 분',
      '빠르게 학습하는 역량을 가진 분',
      '코드잇의 비전에 공감하며, 원활한 커뮤니케이션 능력을 갖추신 분',
    ],
    preferredQualifications: [
      'Java/Kotlin Spring Framework (WebFlux) 경험',
      'GraphQL 사용 경험',
      'MongoDB 사용 경험',
      'Docker/Kubernetes 사용 경험',
      'CircleCI 사용 경험',
      'Terraform 사용 경험',
      'AWS (EKS, ECS, ECR, S3, SES 등) 사용 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-25/ed095191-6d02-45a5-80a7-df1f29e6d17b.png',
    url: 'https://www.wanted.co.kr/wd/284183',
    prompt: () => getPositionPrompt('60'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '61',
    companyName: '셀레트립(Celetrip)',
    jobTitle: 'Backend Developer',
    conditions: ['백엔드 개발', '경력 3년 이상', '서울 종로구'],
    jobType: 'IT-개발',
    positionDescription:
      '셀레트립은 국내외 K-POP 장소 및 공연 정보를 제공하여 글로벌 K-POP팬들의 팬활동을 지원하고, 아티스트와의 협업을 통해 건전한 IP를 활용한 다양한 서비스를 제공하는 엔터테크 기업입니다. 현재 K-POP 팬들을 위한 공연 연계형 여행 패키지와 Celetrip 앱을 서비스하고 있습니다.',
    mainTask:
      '신규 프로덕트 기능 개발 및 유지보수, Restful API 개발, 서비스 아키텍처 개발 및 개선, 클라우드 환경에서의 인프라 운영, 로그 분석 및 모니터링',
    qualifications: [
      '3년 혹은 그에 준하는 백엔드 개발 경험',
      '하나의 프로젝트를 끝까지 개발해본 경험',
      '주력 개발 언어(TypeScript, Java, Python, Go 등) 3년 이상 꾸준히 사용한 경험',
      '해당 언어와 관련된 서버 프레임워크(Spring Boot, Node.js, Django 등) 활용 경험',
      'RDBMS (PostgreSQL, Mysql, Oracle)를 설계하고 운영한 경험',
      'AWS를 이용한 서버 구성 및 관리 경험',
      'CI/CD 설계 및 운영 경험',
      'Docker 활용 경험',
    ],
    preferredQualifications: [
      '원활한 의사소통 능력',
      '최적화 및 리팩토링에 대한 관심과 열정',
      '주도적으로 서비스 개선에 필요한 업무를 찾고 개선할 수 있는 인성과 역량',
      '테스트 코드(Jest, Jasmine, Mocha, etc) 작성 경험',
      '오픈소스 기여 또는 기술 블로그 운영 경험',
      'TTS 알고리즘 개발 경험',
      'K-POP 및 엔터테인먼트 업계에 대한 관심',
    ],
    logoUrl: 'https://static.wanted.co.kr/images/wdes/0_4.a4f33921.png',
    url: 'https://www.wanted.co.kr/wd/284125',
    prompt: () => getPositionPrompt('61'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '2025-05-26T23:59:59+09:00',
  },
  {
    id: '62',
    companyName: '애즈위메이크',
    jobTitle: 'iOS 개발자 (3년~7년)',
    conditions: ['iOS 개발', '경력 3-7년', '서울 마포구'],
    jobType: 'IT-개발',
    positionDescription:
      '애즈위메이크는 동네 식자재마트와 소비자를 온라인으로 이어주는 큐마켓 서비스를 운영하는 기업입니다. 제휴 마트에게 온라인 판매 채널 관리 솔루션을 제공하고, 고객들에게는 집에서도 동네 식자재마트에서 장보기를 할 수 있는 큐마켓 앱을 개발하고 있습니다. 2022년 TIPS 프로그램 선정, 시리즈A 투자유치, 2024년 시리즈B 투자유치를 완료한 성장중인 스타트업입니다.',
    mainTask:
      '큐마켓 및 파트너스 iOS 앱 서비스의 신규 개발, 운영, 유지보수 및 리팩토링, 개발자들과의 협업 및 코드 리뷰, 앱 성능 개선 및 품질 향상 활동',
    qualifications: [
      'iOS 개발 경력 3년 이상 7년 이하이신 분 또는 그에 준하는 역량을 보유하신 분',
      '관련 직무의 포트폴리오 또는 수행 프로젝트 사례를 제공할 수 있는 분',
      'SwiftUI, UIKit을 활용한 커스텀 뷰 개발에 능숙하신 분',
      '비동기 프로그래밍(Combine 등) 경험이 풍부하신 분',
      'MVVM, Clean Architecture 설계 및 적용 경험이 있으신 분',
      'Apple Human Interface Guidelines에 대한 높은 이해도를 보유하신 분',
    ],
    preferredQualifications: [
      'Tuist 등 모듈화 적용 경험 있으신 분',
      'AI 관련 도구 및 기술 활용 경험 있으신 분',
      'CI/CD 구축 및 운영 경험 있으신 분',
      '개발자 멘토링 또는 팀 내 지식 공유 경험이 있으신 분',
      '원활하고 적극적인 커뮤니케이션 역량을 보유하신 분',
      '온라인 커머스 서비스에 대한 높은 이해도를 보유하신 분',
      '코드 개선 및 리뷰에 적극적으로 참여하시는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-02-18/cce197ac-72f2-419a-8471-6d0bf8eb4bc4.jpg',
    url: 'https://www.wanted.co.kr/wd/284031',
    prompt: () => getPositionPrompt('62'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '2025-05-25T23:59:59+09:00',
  },
  {
    id: '63',
    companyName: '슬로그업',
    jobTitle: '프론트엔드 프로덕트 엔지니어 (2년 이상)',
    conditions: ['프론트엔드 개발', '경력 2년 이상', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      '슬로그업은 프로덕트를 잘 만드는 사람들이 모인 IT스타트업으로, 국내 대표 대기업 및 스타트업과 협업하는 아웃소싱 사업과 개발 및 운영을 함께 하고 있습니다. SK그룹, LG전자 등 국내 최고의 기업들과 협업하고 신사업 아이템의 스핀오프 창업까지 가능한 유니크한 기회를 제공합니다.',
    mainTask:
      '개발하는 제품과 기능에 대해서 왜 개발을 하는지 이해, 아이디어 단계부터 참여하여 창의적이고 효율적인 방향을 제시, 최소의 개발로 최대한 효과를 낼 수 있는 방안을 제시, PM, 프로덕트 디자이너와 협업하여 기능 구현이 아닌 문제를 해결, 가설검증 단계 시 매우 빠른 속도로 프로토타입을 구축, 검증된 목표를 효율적이고 확장성 있는 설계로 개발, 지속적으로 기술을 학습하고 비지니스 적인 부분을 고려하여 유연하게 제품에 적용, 높은 신뢰 수준의 약속을 할 수 있는 일정 산정 능력',
    qualifications: [
      '2년 이상의 React Native를 활용한 Android 및 iOS 프로덕트 개발 경험 또는 그에 준하는 실력이 있으신 분',
      'React Native와 같은 크로스 플랫폼 개발에 대한 이해도가 있으신 분',
      'Typescript / React Native / React 사용이 가능하거나 새로운 언어 학습에 부담이 없으신 분',
      'Rest API에 대한 이해도가 있으신 분',
      '디자인된 결과물을 효과적으로 퍼블리싱 할 수 있는 분',
    ],
    preferredQualifications: [
      '비지니스의 이해도가 높으며 해당 목표들을 구현 할 수 있는 분',
      '목표 달성을 위해 구현이 아닌 문제해결을 할 수 있는 분',
      '디자이너, PM과 협업 및 커뮤니케이션을 무리없이 할 수 있는 분',
      '프로덕트 A-Z까지 전체 싸이클 경험이 있으신 분',
      '리더십이 있으신 분',
      '소규모 스타트업에서 큰 역할을 감당했던 경험이 있으신 분',
      '성능 최적화에 대한 이해도와 기술이 있으신 분',
      'TDD / BDD 기반 개발이 가능하신 분',
      'GUI 인터랙션, 애니메이션을 능숙하게 다룰 수 있는 분',
      '다른 프론트엔드 프레임워크/탬플릿 엔진(Vue.js, JSP 등) 경험이 있으신 분',
      '네이티브 앱 개발(Jave/Kotlin, Swift) 경험이 있으신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-02-18/34e51e2f-25b9-4796-b23c-a85d146972dd.png',
    url: 'https://www.wanted.co.kr/wd/284110',
    prompt: () => getPositionPrompt('63'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '64',
    companyName: '커넥트웨이브',
    jobTitle: '[메이크샵] 백엔드 개발자',
    conditions: ['백엔드 개발', '경력 1년 이상', '서울 금천구'],
    jobType: 'IT-개발',
    positionDescription:
      '커넥트웨이브는 고객과 셀러의 연결성 강화를 위해 다양한 플랫폼을 인수합병하여 성장해온 회사입니다. 다나와, 에누리, 메이크샵, 플레이오토, 링크프라이스, 스윗트래커, 빌트온, 몰테일 등의 서비스를 운영하며 컨슈머 커머스, 셀러 커머스, 크로스보더 커머스 영역에서 토탈 플랫폼으로 발전하고 있습니다.',
    mainTask:
      '메이크샵 솔루션의 다양한 기능을 개발, 메이크샵 솔루션의 기존 기능을 안정적으로 운영하고, 유지 보수',
    qualifications: [
      '백엔드 개발 1년 이상의 경험을 보유하신 분',
      'DB 설계 및 구축 경험이 있으신 분',
      '보안코딩, 클린코드에 대한 관심이 있으신 분',
      'PHP, MySQL, Javascript 사용 가능하신 분',
    ],
    preferredQualifications: [
      '대용량 데이터 처리 경험이 있으신 분',
      'Javascript, jQuery, HTML, CSS 등 웹 환경에 대한 이해도가 높으신 분',
      '쇼핑몰 동종 또는 관련 업종 근무 경험이 있으신 분',
    ],
    logoUrl:
      '	https://d2juy7qzamcf56.cloudfront.net/2024-10-27/59f9ca1d-8095-4f7c-9128-8b0b88bd6d22.png',
    url: 'https://www.wanted.co.kr/wd/284159',
    prompt: () => getPositionPrompt('64'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '65',
    companyName: '메디트(Medit)',
    jobTitle: 'UI개발자(프론트엔드)',
    conditions: ['프론트엔드 개발', '경력 3-10년', '서울 영등포구'],
    jobType: 'IT-개발',
    positionDescription:
      '메디트는 임상 활용 가능한 3D 구강스캐너를 개발한 회사로, 글로벌 덴탈 시장에서 매년 가파르게 성장하고 있습니다. 디지털 기술로 치과 의료 경험을 혁신하며, 강력한 디바이스를 바탕으로 축적된 3D 데이터를 AI, 머신러닝을 접목하여 유용하고 사용하기 편리한 어플리케이션을 개발하고 있습니다.',
    mainTask:
      'Medit Link 서비스의 Vue.js 기반 프론트엔드 개발 또는 서비스 관리자 페이지의 React 기반 프론트엔드 개발',
    qualifications: [
      '유관 경력 3년 이상',
      'HTML, CSS, JavaScript(ES6 이상), Typescript에 대한 이해',
      'React / Vue.js 등의 SPA framework 활용 경험',
      'Object-Oriented Programming에 대한 이해',
      'Design Pattern에 대한 기본적인 이해와 활용 경험',
      '실제 서비스되는 웹 애플리케이션 개발 및 운영 경험',
      '구두 및 문서를 통한 의사소통 및 협업 능력',
    ],
    preferredQualifications: [
      'Webpack(+Babel), Rollup, Vite 등의 번들러 사용 경험',
      '최적화(성능개선)에 대한 경험',
      '크로스 브라우징 및 모바일 웹 개발 경험',
      '오픈소스 혹은 개발 커뮤니티 활동',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-06/20943a40-df44-45c2-bb16-ef535479c7c7.png',
    url: 'https://www.wanted.co.kr/wd/284266',
    prompt: () => getPositionPrompt('65'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '66',
    companyName: '메디트(Medit)',
    jobTitle: 'AI 개발자',
    conditions: ['AI 엔지니어', '경력 3-15년', '서울 영등포구'],
    jobType: 'AI-데이터',
    positionDescription:
      '메디트는 임상 활용 가능한 3D 구강스캐너를 개발한 회사로, 글로벌 덴탈 시장에서 매년 가파르게 성장하고 있습니다. 축적된 3D 데이터를 AI, 머신러닝을 접목하여 유용하고 사용하기 편리한 어플리케이션을 개발하는 포지션으로, 전세계 치과와 기공소의 디지털 혁신을 돕는 소프트웨어 개발을 담당합니다.',
    mainTask:
      '의료 영상(치의학 포함) 및 3D 데이터 기반 AI 모델 개발 및 최적화, 딥러닝 기반 데이터 분류(Classification), 객체 탐지(Object Detection), 세분화(Segmentation), 회귀(Regression) 모델 개발, AI 모델 학습 및 추론 파이프라인 설계/구축/자동화, 데이터 전처리 및 후처리(이미지, 볼륨 데이터, Point Cloud, Mesh 등) 알고리즘 개발, 내·외부 고객 요구사항 대응 및 사용자 피드백을 기반으로 한 모델 성능 개선',
    qualifications: [
      '컴퓨터공학, 전자공학, 의료공학, 기계공학, AI 관련 전공 석사 이상',
      '의료 영상/치의학/3D 데이터 관련 AI 개발 경력 최소 3년 이상',
      '딥러닝 프레임워크(PyTorch 또는 TensorFlow) 실무 활용 경험',
      '3D Vision 관련 이해(Point Cloud, Mesh, CBCT 등)',
      'Segmentation, Classification, Regression 등 다양한 AI 모델 설계 및 개발 능력',
      'Git 기반 협업 및 코드 리뷰 경험',
      'Jira, Confluence 등 협업 툴 활용 및 기술 문서 작성 능력',
    ],
    preferredQualifications: [
      '의료 도메인 특화 AI 경험(예: 하치조 신경 탐지, 치아 번호 인식 등)',
      '3D U-Net, Transformer 기반 구조 활용 경험',
      'GPU 기반 추론 최적화 경험 및 API 서버(Flask, FastAPI 등) 개발 경험',
      'C++, CUDA 활용 능력',
      '의료기기 제품화 경험 또는 규제 대응 경험',
      '논문 구현 및 최신 딥러닝 트렌드에 따른 연구개발 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-06/20943a40-df44-45c2-bb16-ef535479c7c7.png',
    url: 'https://www.wanted.co.kr/wd/284293',
    prompt: () => getPositionPrompt('66'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '67',
    companyName: '한국딥러닝(KDL)',
    jobTitle: 'AI 엔지니어',
    conditions: ['AI 엔지니어', '경력 3년 이상', '서울 서초구'],
    jobType: 'AI-데이터',
    positionDescription:
      '한국딥러닝(KDL)은 VISION AI 스타트업으로, B2B 및 B2G 분야에서 AI 기술을 제공하고 있습니다. 이 포지션은 AI/ML 분야에서 3년 이상의 실무 경험을 가진 엔지니어를 대상으로 하며, 비전 AI 모델 및 대규모 데이터 기반 Large Model 프로젝트를 담당합니다.',
    mainTask:
      '최신 논문 및 오픈소스 동향을 파악하고, 신규 아이디어나 모델 구조를 설계·검증(PoC) 후 프로덕션 환경에 적용, 이미지, 자연어 등 비정형 대규모 데이터 처리 및 딥러닝 모델 아키텍쳐 설계 및 수정, 모델 개발 과정에서 발생하는 에러·성능 이슈를 파악·분석하여 신속하게 해결, 정량적 지표를 통해 모델 성능을 모니터링하고, 데이터 전처리·알고리즘 개선 방안을 제안, 프로젝트 내에서 창의적인 대안을 모색하며, 주어진 자원과 환경 안에서 모델 효율성을 극대화',
    qualifications: [
      'AI/ML 분야 3년 이상 실무 경험(딥러닝 모델 연구·개발, 학습·테스트·배포 등)',
      '수학·컴퓨터공학 기초(자료구조, 알고리즘, 선형대수, 통계 등)에 대한 탄탄한 이해',
      'PyTorch 등 딥러닝 프레임워크 활용에 능숙하고, 모델 구현·디버깅 경험',
      '비전 AI 모델 및 대규모 데이터 기반 Large Model 프로젝트 실무 경험',
    ],
    preferredQualifications: [
      '논문·특허 등 연구 성과가 있거나, 오픈소스 프로젝트에 꾸준히 기여해본 경험',
      '모델 경량화(Quantization, Pruning 등) 및 Inference Optimization 경험',
      '분산 학습 환경(Spark, MPI 등) 또는 클라우드 인프라(AWS, GCP 등) 운영 경험',
      'Git, Notion, Jira, DVC 등 협업 툴 활용 및 문서화·프로세스 관리 능력',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-01-08/536ae5c4-fb4a-41fb-9c0d-0b5648e177c9.jpg',
    url: 'https://groupby.kr/positions/5058',
    prompt: () => getPositionPrompt('67'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '68',
    companyName: '한국딥러닝(KDL)',
    jobTitle: '백엔드 엔지니어',
    conditions: ['백엔드 개발', '경력 3년 이상', '서울 서초구'],
    jobType: 'IT-개발',
    positionDescription:
      '한국딥러닝(KDL)은 VISION AI 스타트업으로, B2B 및 B2G 분야에서 AI 기술을 제공하고 있습니다. 이 포지션은 KDL의 핵심 제품인 [DeepOCR+]의 백엔드 시스템 개발 및 유지관리를 담당하는 역할로, DDD 패턴과 Layered Architecture를 활용한 개발 경험이 필요합니다.',
    mainTask:
      'KDL의 핵심 제품 [DeepOCR+] 백엔드 시스템 개발 및 유지관리, DeepOCR+ 백엔드 시스템의 도메인 모델 설계 및 구현, 문서 처리 도메인의 핵심 비즈니스 로직 이해/분석/설계, 애플리케이션 계층 개발 및 유지보수, PostgreSQL/MongoDB 기반의 도메인 중심 ERD 설계 및 관리, Layered Architecture 기반의 시스템 구조 관리 및 리팩토링, Aggregate/Entity/Repository 등 DDD 패턴 활용한 개발, 비동기 처리 및 인프라 연계, Git을 활용한 코드 리뷰/협업 프로세스 참여 및 개선 활동 수행',
    qualifications: [
      '백엔드 개발 경력 3년 이상 (Java, Spring Boot 등 경험)',
      'SQL/NoSQL 기반 서비스 개발 및 ERD 설계 경험 (PostgreSQL, MongoDB 우대)',
      'CI/CD 운영 관리 경험 (Docker 이미지 빌드·배포 포함)',
      'DDD · Layered Architecture 설계·리팩토링 경험',
      'Git Workflow와 코드 리뷰 문화에 익숙한 분',
      'Linux 환경에서의 백엔드 애플리케이션 배포 및 운영 경험',
      '장애 대응 및 트러블슈팅 경험',
      'MSA 또는 분산 서비스 아키텍처에 대한 이해',
    ],
    preferredQualifications: [
      '성능 또는 보안 취약점 개선 경험',
      '개발 조직 리드 경험',
      '체계적인 개발문서 작성 경험',
      '애자일 방법론(Scrum, Kanban 등) 기반 협업 경험',
      'GitHub Actions 기반 CI/CD 구축·운영 경험',
      'RabbitMQ 또는 Kafka 메시지 큐 실무 경험',
      'Helm · Prometheus 스택 운영 경험',
      'Redis 등 인메모리 DB 활용 경험',
      '온프레미스(폐쇄형) 시스템 또는 GPU Inference 백엔드 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-01-08/536ae5c4-fb4a-41fb-9c0d-0b5648e177c9.jpg',
    url: 'https://groupby.kr/positions/5065',
    prompt: () => getPositionPrompt('68'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '69',
    companyName: '메사쿠어컴퍼니',
    jobTitle: 'FrontEnd 개발자',
    conditions: ['프론트엔드 개발', '경력 3-7년', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      '메사쿠어컴퍼니는 업계 최고 수준의 얼굴인식 AI 기술 전문 인력들의 경험과 노하우를 바탕으로 고객 비즈니스 혁신을 이끌어가고 있습니다. 2020년 설립 이후 사원수 50명 규모로 성장했으며, 얼굴인식 AI 기술에 기반한 안면인식 응용소프트웨어 관련 사업으로 시리즈A를 통해 누적 90억원의 투자유치를 달성했습니다. 현재 국가신분증 모바일 전환사업과 금융권 협업 등 다양한 프로젝트를 진행 중입니다.',
    mainTask:
      '온라인 시험 모니터링 플랫폼의 설계 및 개발, 다양한 플랫폼에 대응하는 SDK 설계 및 구현, 모바일 신원 확인 서비스의 아키텍처 설계 및 개발',
    qualifications: [
      '3~7년의 웹 프론트엔드 개발 경험',
      '다양한 웹 애플리케이션 아키텍처 설계 및 구현 경험',
      'HTML, CSS, JavaScript, TypeScript에 대한 깊은 이해',
      'React 및 Vue.js 사용에 능숙한 분',
    ],
    preferredQualifications: [
      '주도적으로 문제를 정의하고 솔루션을 제안할 수 있는 분',
      '팀원과의 원활한 커뮤니케이션 및 협업 능력',
      'AI 도구를 활용하여 업무 효율성을 극대화할 수 있는 분',
      '새로운 기술 학습에 열려 있고, 팀과 지식을 적극적으로 공유할 수 있는 분',
      '코드 리뷰 문화에 익숙하고 코드 품질에 대한 높은 기준을 가진 분',
      '성능 최적화, 메모리 누수, 네트워크 프로파일링 경험이 있으신 분',
      '디자인 시스템 개발 경험',
      '유지보수가 용이한 웹 아키텍처 설계 및 구현 경험',
      '실시간 데이터 통신 및 멀티미디어 스트리밍 관련 개발 경험',
      'WebRTC 기반 동영상 스트리밍 서비스 개발 경험',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-02-20/b4c04838-21d5-4e23-b9b9-985787503178.webp',
    url: 'https://www.wanted.co.kr/wd/284203',
    prompt: () => getPositionPrompt('69'),
    uploadedAt: '2025-05-21T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '70',
    companyName: '국립중앙의료원',
    jobTitle: '기술직 6급 전산행정(정보운영팀)',
    conditions: ['시스템 운영', '경력 1년 이상', '서울'],
    jobType: 'IT-개발',
    positionDescription:
      '국립중앙의료원 정보운영팀에서 OCS/EMR 시스템 개발 및 운영 업무를 담당할 기술직 6급 전산행정 직원을 채용합니다. 종합병원 이상의 의료기관에서 의료정보시스템 개발 및 운영 경험이 필요한 공공기관 정규직 포지션입니다.',
    mainTask:
      'OCS/EMR 시스템 개발 및 운영, 의료정보시스템 관리 및 유지보수, 전산행정 업무 수행',
    qualifications: [
      '종합병원 이상의 의료기관에서 OCS/EMR 시스템 개발 및 운영 경력 1년 이상인 자',
      '경력(재직)증명서에 OCS/EMR 시스템 개발 직무 내용이 포함된 경우에 한하여 인정',
    ],
    preferredQualifications: [
      '웹 프로그래밍(JAVA, Trustform, XFlatform) 개발 경력자',
      '장애인, 보훈대상자는 관계 법령에 따라 우대',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-09/c535dadf-7869-47c8-9f1a-fec3a8a1002a.png',
    url: 'https://job.alio.go.kr/recruitview.do?idx=286318',
    prompt: () => getPositionPrompt('70'),
    uploadedAt: '2025-05-25T00:00:00+09:00',
    deadline: '2025-06-09T23:59:59+09:00',
  },
  {
    id: '71',
    companyName: '아이샵케어',
    jobTitle: '[People팀] IT 인프라 엔지니어',
    conditions: ['인프라 엔지니어', '경력 3-6년', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      '아이샵케어는 비바리퍼블리카(토스) 계열사로, People팀에서 IT 인프라 운영 및 관리를 담당할 엔지니어를 모집합니다. 네트워크 인프라 관리부터 사내 협업 환경 기획까지 폭넓은 IT 인프라 업무를 담당하는 포지션입니다.',
    mainTask:
      '네트워크 장비를 관리하며, 네트워크 인프라를 안정적으로 유지, 사내 단말기(PC, 노트북 등)와 장비를 효율적으로 관리하고, 사용자 환경이 원활히 유지될 수 있도록 지원, 인프라 보안 강화를 위해 취약점 진단을 수행하고, 필요한 보안 조치를 이행, 협업툴/메일/공유 시스템 등 사내 협업 환경을 기획하고 운영, 인프라 장애 발생 시 빠르게 원인을 파악하고, 관련 부서와 협업해 신속하게 대응, 내부 구축된 보안솔루션(백신, DLP, 방화벽)을 관리 및 운영, 모회사(비바리퍼블리카, 토스플레이스)의 IT 및 보안감사를 대응',
    qualifications: [
      'IT 인프라 운영 및 관리 경험 3년 이상을 보유하신 분',
      'On-Premise 또는 AWS 환경 중 하나 이상에서의 인프라 운영 경험이 있으신 분',
      '네트워크 및 내부 시스템(방화벽, 백신, DLP 등) 관리 경험이 있으신 분',
      '보안 취약점 진단 및 대응 경험이 있으신 분',
      '사내 협업툴 및 시스템 운영 경험이 있으신 분',
      '문제 해결 능력과 커뮤니케이션 역량을 갖추신 분',
    ],
    preferredQualifications: [
      '스타트업 또는 소규모 조직에서 IT 인프라를 직접 운영해 본 경험이 있는 분',
      'AWS, Azure, GCP 등 클라우드 자격증을 보유하신 분',
      '다양한 상황에서 주도적으로 문제를 해결하고, 유연하게 대응해본 경험이 있으신 분',
      '사내 구성원들의 IT 환경을 개선하기 위해 스스로 고민하고 개선해 본 경험이 있는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-12-27/53ff4334-fe36-40f5-947e-21dad8075a23.png',
    url: 'https://career.ishopcare.co.kr/job_posting/nO0HB0Hm',
    prompt: () => getPositionPrompt('71'),
    uploadedAt: '2025-05-25T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '72',
    companyName: '바리코퍼레이션',
    jobTitle: 'Front-end Engineer',
    conditions: ['프론트엔드 개발', '경력 1년 이상', '서울 서초구'],
    jobType: 'IT-개발',
    positionDescription:
      '바리코퍼레이션은 모터사이클 라이더에게 필요한 슈퍼앱을 지향하는 기업입니다. 모터사이클 중고거래에 신뢰를 부여하고, 정비 서비스부터 라이더 커뮤니티까지 모터사이클 라이딩이 더 즐겁고 안전해질 수 있도록 돕는 일을 하고 있으며, 전기차, UAM을 포괄하는 모빌리티 기업을 목표로 성장하고 있습니다.',
    mainTask: '라이트바겐 웹 및 네이티브 앱의 Front-end Engineering',
    qualifications: [
      'HTML, CSS, JavaScript에 익숙하신 분',
      'TypeScript와 같은 정적 타이핑 툴 경험이 있으신 분',
      'React 기반의 SPA 프로젝트 개발 경험이 있으신 분',
      '사용자 중심적인 사고로 co-work 가능하신 분',
    ],
    preferredQualifications: [
      'Webpack, Parcel 등 모듈 번들러에 대한 이해가 있으신 분',
      'GraphQL 사용 경험이 있으신 분',
      'Next.js, Remix.js 등 SPA framework 를 통한 SSR 경험이 있으신 분',
      'UI/UX 개선과 관련된 고민을 좋아하시는 분',
      '새로운 기술에 관심이 있고, 성장을 위해 노력하시는 분',
      'React-Native를 통해 네이티브 어플리케이션을 개발한 경험이 있으신 분',
      '모터사이클에 대한 관심과 애정을 가지신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-15/d8b4ec68-a56c-4c17-9a0b-f35a0f9a9d5d.png',
    url: 'https://www.wanted.co.kr/wd/217852',
    prompt: () => getPositionPrompt('72'),
    uploadedAt: '2025-05-25T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '73',
    companyName: '놀유니버스',
    jobTitle: '글로벌 R&D 프론트엔드 개발자',
    conditions: ['프론트엔드 개발', '경력 3년 이상', '경기 성남시'],
    jobType: 'IT-개발',
    positionDescription:
      "놀유니버스는 여행·여가·문화의 경계 없이 다채로운 경험을 선사하는 플랫폼 기업입니다. 글로벌 R&D 조직은 한국을 찾는 외국인 관광객 대상 서비스인 '인터파크 글로벌'을 담당하며, 공연·뮤지컬·전시 예매부터 투어 및 액티비티 상품, 여행 정보까지 제공하는 종합 여행 플랫폼을 개발하고 있습니다.",
    mainTask:
      '글로벌 R&D 구성원 뿐만 아니라 놀유니버스의 다양한 팀과 협업하여 인터파크 글로벌 웹 페이지를 개발, 다양한 기기와 브라우저, 인터파크 글로벌 앱 내의 웹뷰 모두에서 잘 작동하는 웹서비스를 설계하고 구현, 글로벌 R&D 구성원이 인터파크 글로벌 서비스를 운영할 때 사용하는 관리 페이지를 개발, 다른 프론트엔드 개발자와 토의하며 프론트엔드 개발 환경을 개선',
    qualifications: [
      '프론트엔드 개발 경력 3년 이상이신 분',
      'HTML, CSS, JavaScript, HTTP 등 웹 기술과 모던 브라우저 동작 방식에 대한 깊은 이해가 있으신 분',
      '자료구조, 알고리즘 등 컴퓨터 과학 기초 지식과 TypeScript 같은 정적 타입 언어에 대한 경험과 이해가 있으신 분',
      'Next.js 기반 개발 경험이 있고, 업무 목적에 맞는 해결책을 스스로 제안하실 수 있는 분',
      '동료와 고민을 나누고, 실패 경험도 편하게 공유하실 수 있는 분',
    ],
    preferredQualifications: [
      '앱 내 WebView 환경에서 서비스 개발 및 운영 경험이 있으신 분',
      'Next.js App Router 기반 프로젝트에 CloudFront 캐시 적용 경험이 있으신 분',
      'CSS-in-JS 사용, SEO 및 성능 최적화, 이벤트 트래커(GA 등) 개선 경험이 있으신 분',
      '모노레포 기반 프론트엔드 앱 또는 라이브러리 운영, E2E 테스트 구성 경험이 있으신 분',
      '오래된 코드를 점진적으로 개선하거나 리팩토링한 경험이 있으신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-01-09/b4077d20-5683-4b39-9b28-7b932889b5d3.png',
    url: 'https://www.wanted.co.kr/wd/285212',
    prompt: () => getPositionPrompt('73'),
    uploadedAt: '2025-05-25T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '74',
    companyName: '메디쿼터스',
    jobTitle: 'HRIS 풀스택',
    conditions: ['풀스택 개발', '경력 1-3년', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      '메디쿼터스는 글로벌 1등 패션&뷰티 커머스를 목표로 10개 이상의 글로벌 국가에서 20개 이상의 패션, 뷰티 브랜드와 플랫폼을 운영하고 있습니다. 누적 735억 원의 투자를 유치하였고, 창업 후 7년 만에 연 매출 2,000억 원, 글로벌 연 매출 500억 원을 달성한 기업입니다. 이 포지션은 인사본부 인사팀 HRIS파트에서 사내 인사 시스템을 개발하는 역할입니다.',
    mainTask:
      '사내 인사 시스템(HRIS) 신규 기능 설계·개발 및 기존 모듈 고도화, React + Vite 기반 프론트엔드 UI/UX 구현 및 렌더링 최적화, Golang gin, Java Spring 기반 REST API 설계·개발 및 서버 인프라 운영, PostgreSQL 데이터베이스 모델링·정규화 및 성능 튜닝, AWS(EC2·RDS·S3) 배포 및 GitHub Actions 기반 CI/CD 파이프라인 구축·관리, 대규모 인사 데이터 ETL 파이프라인 설계·구축',
    qualifications: [
      '4년제 학사 이상',
      '1년 이상 ~ 3년 이하 경력',
      '포트폴리오 / GitHub 링크 제출 우대',
      '웹 서비스 개발 경력 1년 ~ 3년 또는 이에 준하는 역량을 보유하신 분',
      'React, Vue, Angular 등 SPA 프레임워크/라이브러리 사용해 보신 분',
      'PostgreSQL 등 관계형 DB 설계 및 구축해 보신 분',
      'RESTful API를 설계하고 개발해 보신 분',
      'JavaScript(TypeScript), Python, Golang 등 언어 중 1개 이상 능숙하신 분',
      'Git 기반 협업 및 코드 리뷰에 익숙하신 분',
      '사용자 중심 사고와 원활한 커뮤니케이션 역량을 갖추신 분',
    ],
    preferredQualifications: [
      'AWS 운영 및 비용 최적화 경험을 보유하신 분',
      'Docker 기반 컨테이너 오케스트레이션(Kubernetes·ECS) 경험을 보유하신 분',
      'TypeScript를 기반으로 풀스택 개발을 수행해 보신 분',
      '제품 기획 배포·운영 전 주기 경험을 보유하신 분',
      'GitHub Actions 등 CI/CD 구축해 보신 분',
      'HR·SaaS 도메인 서비스 개발 경험을 보유하신 분',
      '컴퓨터공학 등 관련 전공을 이수하신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-27/d4abcc56-07d5-4831-a1fd-3c4a3f551894.png',
    url: 'https://www.wanted.co.kr/wd/285197',
    prompt: () => getPositionPrompt('74'),
    uploadedAt: '2025-05-25T00:00:00+09:00',
    deadline: '2025-06-30T23:59:59+09:00',
  },
  {
    id: '75',
    companyName: '오케이포스',
    jobTitle: 'POS 개발자',
    conditions: ['소프트웨어 개발', '경력 2-5년', '서울 금천구'],
    jobType: 'IT-개발',
    positionDescription:
      '오케이포스는 오프라인 결제데이터를 누구나 손쉽게 사용할 수 있는 형태의 데이터로 가공하여 Hardware Solution을 뛰어넘어 온라인 스토어, 배달, 스마트오더, CRM 등 경제활동에 필요한 모든 기술적 지원을 원스톱으로 해결하는 회사입니다. 이 포지션은 VB 6.0, C#, MFC, DBMS 등을 활용한 클라이언트 기반 POS 시스템 개발을 담당합니다.',
    mainTask:
      'POS 시스템 기능 개발, 외부 시스템과의 연동 기능 개발, POS 시스템의 유지 보수',
    qualifications: [
      '초대졸이상',
      '클라이언트 개발 경력(2년 이상) 보유하신 분',
      'VB 6.0, C#, MFC를 활용한 개발이 가능하신 분',
      'MS-SQL DBMS를 활용한 개발이 가능하신 분',
    ],
    preferredQualifications: [
      '컴퓨터공학 관련 전공 보유자',
      'POS 시스템 개발 경험을 보유하신 분',
      '기획자, 개발자와의 협업 경험이 있으신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-03-28/88d8d26f-b6a5-4b8e-a5dc-4e3ada05706f.jpg',
    url: 'https://www.wanted.co.kr/wd/285136',
    prompt: () => getPositionPrompt('75'),
    uploadedAt: '2025-05-25T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '76',
    companyName: '빗썸',
    jobTitle: '보안정책 운영 담당자',
    conditions: ['보안 전문가', '경력 3-5년', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      '빗썸은 매일 100만명이 방문하고 하루 평균 약 2조 2천억원에 달하는 가상자산이 거래되는 대한민국 최고의 가상자산 거래소입니다. 대용량 트래픽을 안정적으로 처리할 수 있는 고성능 체결엔진을 바탕으로 투명하고 공정한 검증을 거쳐 상장된 가상자산과 NFT를 포함한 다양한 블록체인 기반 콘텐츠 상품군을 통해 최적의 트레이딩 서비스를 제공하고 있습니다.',
    mainTask:
      '정보보호 관리체계 운영 활동 (내부 유출 예방 정책 운영 및 모니터링, 주기적 점검 활동 등), 정보시스템 보안성 검토 진행',
    qualifications: [
      '정보보호 관련 3년 이상의 경력을 보유하신 분',
      '서버, DB, 네트워크, 개발환경, 클라우드 등 인프라 제반지식을 보유하신 분',
      '능동적이고 적극적인 자세로 업무를 수행하시는 분',
    ],
    preferredQualifications: [
      '정보보호 관련 자격(정보보안기사 등)을 보유하신 분',
      '국가 유공자 · 장애인 등 취업보호대상자는 관계법령에 따라 우대',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-01/14042fa6-a6fb-482f-a940-b4f5b0e01faf.png',
    url: 'https://www.wanted.co.kr/wd/285133',
    prompt: () => getPositionPrompt('76'),
    uploadedAt: '2025-05-25T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '77',
    companyName: '벙커키즈',
    jobTitle: 'Tech - Frontend Engineer',
    conditions: ['프론트엔드 개발', '경력 3년 이상', '서울 서초구'],
    jobType: 'IT-개발',
    positionDescription:
      '벙커키즈는 누적 투자금 32억 원을 유치한 AI 콘텐츠 스타트업으로, 2번의 EXIT 경험이 있는 창업자 출신 구성원들이 모인 소수 정예 팀입니다. AI 캐릭터 채팅 서비스를 중심으로 Next Contents를 가장 매력있게 전달하는 플랫폼을 목표로 하며, co-founding 멤버를 찾고 있습니다.',
    mainTask:
      'React, Nextjs, Capacitorjs(주로 웹뷰, 필요시 Native module)로 웹/앱 서비스 개발, Product Owner / Designer / Stakeholder 와 긴밀히 협업하여 복잡한 비즈니스 요구사항을 단순화 시키고, 이를 높은 수준의 Front-end 디자인으로 완성시켜 여러 번 반복되는 테스트를 최소의 개발비용으로 지원',
    qualifications: [
      '프론트엔드 개발 경험 3년 이상 보유',
      'React 프레임워크를 활용한 웹 애플리케이션 개발 경험이 있는 분',
      'React, Web Browser에 대한 높은 수준의 이해도를 가진 분',
      'React/Nextjs 기술 트랜드를 따라가며 각 기술 스택의 장단점을 알고 적용 가능하신 분',
      'PO가 작성한 제품 요구사항을 보고 의사소통을 통해 task를 정의하고 요구사항을 적절히 조율하여 비즈니스에 맞는 개발을 할 수 있는 분',
    ],
    preferredQualifications: [
      '백엔드 개발 경험, end-to-end 프로덕트 개발 경험',
      '스타트업 코파운더 / 초기 멤버 경험',
      '최신 AI 테크 서비스(Cursor.AI 등)의 사용을 통해 생산성을 올리는데 거리낌이 없는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-04-07/928caffa-f612-4f5e-b994-6c7d2c462aa0.png',
    url: 'https://www.wanted.co.kr/wd/285121',
    prompt: () => getPositionPrompt('77'),
    uploadedAt: '2025-05-25T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '78',
    companyName: '벙커키즈',
    jobTitle: 'Tech - Backend Engineer',
    conditions: ['백엔드 개발', '경력 3년 이상', '서울 서초구'],
    jobType: 'AI-데이터',
    positionDescription:
      '벙커키즈는 누적 투자금 32억 원을 유치한 AI 콘텐츠 스타트업으로, 2번의 EXIT 경험이 있는 창업자 출신 구성원들이 모인 소수 정예 팀입니다. AI 캐릭터 채팅 서비스를 중심으로 Next Contents를 가장 매력있게 전달하는 플랫폼을 목표로 하며, co-founding 멤버를 찾고 있습니다.',
    mainTask:
      '제품요구사항에 맞춰 AI 캐릭터 채팅 서비스의 코어 기능을 담당하는 Backend API를 설계하고 개발, LLM(Gemini, GPT 등)을 활용한 생성형 AI 기반 기능 구현을 주도, 기획자, 디자이너, 프론트엔드 개발자와의 긴밀한 협업을 통해 Web / App 전반의 서비스 품질을 높이는데 기여',
    qualifications: [
      'Python 기반 웹 개발 실무 경험 3년 이상이신 분',
      '서비스 레벨의 API 설계 및 개발 경험이 있으신 분',
      'Git, Docker 등의 환경에서의 배포 및 운영 자동화에 익숙하신 분',
      '기획자/디자이너/개발팀원을 포함한 비개발직군과의 원활한 커뮤니케이션 능력을 갖춘 분',
      '문제를 정의하고, 데이터 기반으로 구조적 해결책을 도출하는 역량을 갖춘 분',
    ],
    preferredQualifications: [
      'LLM (GPT, Gemini 등) 기반 기능을 위한 API 설계 및 응답 구조 최적화 경험',
      'Pandas, NumPy 등 데이터 분석 라이브러리 활용 경험',
      '콘텐츠 기반 서비스(웹소설, 웹툰, 게임 등)에 대한 높은 이해 또는 애정이 있는 분',
      'Prompt 엔지니어링, LLM 파이프라인 설계 등 생성형 AI 기술에 대한 기본 이해가 있는 분',
      '기획과 설계에서 적극적으로 참여하신 분',
      'AI를 활용한 작업 효율화에 관심이 있으신 분',
      '사내 기술 스터디와 독서모임(클린 애자일, 훅 등)을 통해 자신을 성장시키려는 열망이 높은 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-04-07/928caffa-f612-4f5e-b994-6c7d2c462aa0.png',
    url: 'https://www.wanted.co.kr/wd/285119',
    prompt: () => getPositionPrompt('78'),
    uploadedAt: '2025-05-25T00:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '79',
    companyName: '라이너(Liner)',
    jobTitle: 'DevOps Engineer',
    conditions: ['인프라 엔지니어', '경력 3-15년', '서울 마포구'],
    jobType: 'IT-개발',
    positionDescription:
      '라이너는 믿을 수 있는 AI로 정보 탐색을 혁신하는 AI 스타트업으로, 전세계 수백만 명이 사용하는 AI 검색 서비스를 제공합니다. 지금까지 438억 원의 투자를 유치했으며, 서울과 미국 오피스의 60여 명의 팀원들과 함께 세상에서 가장 정확한 AI Search를 만들고 있습니다. 100명 규모로 팀을 확장할 계획으로 빠르게 성장하는 AI 시장에서 글로벌 임팩트를 함께 만들어가고 있습니다.',
    mainTask:
      '지속적이고 안정적인 서비스 운영을 위해 인프라를 구축하고 모니터링, CI/CD 파이프라인을 포함하여 팀에 적합한 각종 환경과 Workflow를 설계하고 구축, 효율적인 운영을 위해 시스템 최적화 및 모니터링 방법을 제안하고 도입, Public Cloud 인프라 리소스를 설계하고, 생성하며, 비용을 관리하고 유지보수, 필요하면 특정 프로젝트 TF팀의 소프트웨어 개발자로 참여하여 활동',
    qualifications: [
      '만 3년 이상 Software Engineer로써 Java, Kotlin, Go, Python, Javascript 등의 언어로 상용 서비스를 개발해 본 경험이 있는 분',
      '만 2년 이상 실제 GCP, AWS 같은 Public Cloud에 서비스를 배포하고 운영해 본 경험이 있는 분',
      'Docker, Kubernetes, ArgoCD, Github Actions 등을 활용한 컨테이너 기반의 서비스 개발 및 운영 경험이 있는 분',
      'Prometheus, Datadog 등의 모니터링 서비스를 구축 활용해 본 경험이 있는 분',
    ],
    preferredQualifications: [
      '소규모 엔지니어링 팀 리드 경험이 있는 분',
      '유니콘 이상의 스타트업에서 대규모 인프라 구축 및 운영 경험이 있는 분',
      'Monolithic 서비스에서 MSA로 서비스 고도화 작업에 참여 경험이 있는 분',
      '서비스 무중단 아키텍처에 대한 설계, 구축, 운영, 장애 대응 경험이 있는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-15/6de391fb-96ce-4523-a81a-c14643c0a793.png',
    url: 'https://www.wanted.co.kr/wd/285192',
    prompt: () => getPositionPrompt('79'),
    uploadedAt: '2025-05-25T20:00:00+09:00',
    deadline: '2025-05-31T23:59:59+09:00',
  },
  {
    id: '80',
    companyName: '라이너(Liner)',
    jobTitle: 'Search Engineer (검색 엔지니어)',
    conditions: ['검색 엔지니어', '경력 3년 이상', '서울 마포구'],
    jobType: 'AI-데이터',
    positionDescription:
      '라이너는 믿을 수 있는 AI로 정보 탐색을 혁신하는 AI 스타트업으로, 전세계 수백만 명이 사용하는 AI 검색 서비스를 제공합니다. 지금까지 438억 원의 투자를 유치했으며, 서울과 미국 오피스의 60여 명의 팀원들과 함께 세상에서 가장 정확한 AI Search를 만들고 있습니다. 이 포지션은 LLM RAG Agent를 위한 검색 시스템을 구축하고 최적화하는 역할입니다.',
    mainTask:
      'Liner 서비스 데이터 또는 크롤링 된 웹 문서를 활용한 검색 시스템을 구축, LLM RAG Agent를 위한 검색 서비스 Retrieval 및 Ranking을 최적화, 검색 시스템에 대한 안정적인 운영 및 모니터링 시스템을 구축, 검색 시스템 기술 동향 파악 및 Liner 검색 시스템 로드맵을 설정',
    qualifications: [
      '프론트엔드 개발 경력 3년 이상 또는 그에 준하는 경험을 가지신 분',
      'Typescript, React, Next.js에 능숙하신 분',
      '프론트엔드 기술과 트렌드를 꾸준히 학습하고 적절한 기술을 선택하여 제품에 적용해본 경험이 있으신 분',
      '지속적인 배움과 지식 공유에 관심이 많으신 분',
      '다양한 직군과 원활하게 소통하며 프로젝트를 성공적으로 배포해 본 경험이 있으신 분',
      '1년 이상 하나의 제품을 꾸준히 개선하고 성장시킨 경험이 있으신 분',
    ],
    preferredQualifications: [
      'LLM 및 RAG 기반 서비스에 대한 이해와 관심이 있으신 분',
      'ANN (Approximate Nearest Neighbor) 및 Vector 기반 데이터베이스에 대한 이해도가 높으신 분',
      '제품 직군 구성원들과 문제를 함께 정의하고 해결한 협업 경험이 있는 분',
      '팀원들과의 소통이 원활하고 뛰어난 개발 역량을 지니신 분',
      '산업기능요원(현역 및 보충역), 전문연구요원(전직 및 보충역) 지원 가능',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-15/6de391fb-96ce-4523-a81a-c14643c0a793.png',
    url: 'https://www.wanted.co.kr/wd/285191',
    prompt: () => getPositionPrompt('80'),
    uploadedAt: '2025-05-25T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '81',
    companyName: '우아한형제들(배달의민족)',
    jobTitle: 'SCM팀 Business Analyst (3~7년이하)',
    conditions: ['데이터 분석가', '경력 3-7년', '서울 송파구'],
    jobType: 'AI-데이터',
    positionDescription:
      '우아한형제들의 B마트는 고객이 당장 필요할 때 필요한 만큼 어떤 상품이든 1시간 이내로 배달 받을 수 있는 quick-commerce 서비스입니다. SCM팀은 고객이 원하는 상품을 구매가 가능하도록 적정 발주를 관리하며, 적정재고와 적정발주 관리를 통한 비용의 효율을 추구하고, 더 많은 사업 기회를 창출할 수 있도록 든든한 물류 인프라와 역량을 제공합니다.',
    mainTask:
      'B마트 SCM 운영 고도화를 위한 데이터 분석, SQL 등을 활용한 데이터 추출 및 분석 및 인사이트를 도출, 수요예측 고도화 및 행사 예측 모델링 고도화를 통한 업무 효율화 지원, 주요 지표 시각화를 통해 실시간 모니터링 툴 구축 및 운영',
    qualifications: [
      '데이터 분석을 통해 인사이트를 도출하고 논리적 사고와 뛰어난 문제 해결 능력을 보유한 분',
      '원활한 소통 스킬을 바탕으로 유관 부서와 협업 능력을 보유한 분',
      'SQL, Python, Zeppelin, Redash, Tableau, Airflow 등 데이터 분석 언어 및 도구에 전문성을 보유한 분',
      '데이터 추출, 관리, 분석 경험이 풍부하며, 데이터 기반 프로젝트에서 성과를 도출한 경험이 있는 분',
      '업무에 대한 높은 책임감과 변화에 대한 유연성을 갖춘 분',
    ],
    preferredQualifications: [
      '유통,커머스, SCM 등에 대한 경험과 비지니스 이해도가 있는 분',
      '행사 수요예측 오차율 개선/관리 경험이 있는 분',
      '조직 목표를 수립하고 달성 관리를 수행한 경험이 있는 분',
      '유관 부서와의 원활한 소통 및 업무 추진 능력을 보유한 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-08-23/c34da5aa-25b0-469e-b31e-f46f0ca00b85.png',
    url: 'https://www.wanted.co.kr/wd/285187',
    prompt: () => getPositionPrompt('81'),
    uploadedAt: '2025-05-25T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '82',
    companyName: '메가인포아이티',
    jobTitle: '셀프플래너 플랫폼 Frontend 개발자(3년이상)',
    conditions: ['프론트엔드 개발', '경력 3년 이상', '서울 금천구'],
    jobType: 'IT-개발',
    positionDescription:
      "메가인포는 18년간의 경험을 통해 국내 최고의 법인 컨설팅 업체로 성장한 회사입니다. 셀프플래너는 '보험 경험에 가치를 더하고, 보험여정에 혁신을 더하다'라는 미션 아래 보험 상품의 불투명함, 전화보험 영업의 나쁜 경험, 불완전판매 등을 해결하는 혁신적인 플랫폼입니다. 보험이 필요한 사람이 직접 보험설계사가 되어 자신의 보험을 설계하고 가입할 수 있는 플랫폼을 개발하고 있습니다.",
    mainTask:
      '서비스 고도화 프론트엔드 개발 및 운영, 파트너 서비스 고도화 프론트엔드 개발 및 운영, 어드민 고도화 및 운영, 신규 앱 개발 및 런칭, 웹 애플리케이션의 사용자 인터페이스 설계 및 구현, HTML, CSS, JavaScript를 활용한 웹 페이지 개발, 디자이너와 협력하여 사용자 경험 개선, 백엔드 개발자와 협업하여 API 연동 및 데이터 처리',
    qualifications: [
      'React 프레임워크를 깊이 이해하고 사용해 보신 분',
      'HTML5, CSS3, Javascript 등 관련 기술에 능숙하신 분',
      '새로운 기술에 적극적이고 능동적인 분',
      '협업에 적극적이고, 커뮤니케이션을 유연하게 잘 하시는 분',
      '5년 이상 react 개발 경력',
      'HTML, CSS, JavaScript에 대한 깊은 이해',
      '웹 성능 최적화 및 크로스 브라우저 호환성 문제 해결 능력',
      'Git 등 버전 관리 시스템 사용 경험',
    ],
    preferredQualifications: [
      '금융 및 보험 관련 프로젝트 경험을 보유하신 분',
      '마이데이터 API 연동을 통한 APP 개발 프로젝트 경험을 보유하신 분',
      'UI/UX 디자인에 대한 이해와 경험',
      '웹 성능 최적화 및 보안 개발에 대한 경험을 보유하신 분',
      '금융 및 보험 시장 동향과 기술에 대한 지속적인 관심과 학습 의지가 높으신 분',
      '오픈 소스 프로젝트 기여 경험',
      '컴퓨터 공학 또는 관련 분야 학사/학위 소지자',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-02-25/3127e2bf-ecdd-49b8-a03c-fc74803d460a.png',
    url: 'https://www.wanted.co.kr/wd/285164',
    prompt: () => getPositionPrompt('82'),
    uploadedAt: '2025-05-25T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '83',
    companyName: 'Shoplive',
    jobTitle: 'Software Engineer (Android / 안드로이드)',
    conditions: ['Android 개발', '경력 3년 이상', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      'Shoplive는 라이브 커머스 및 쇼트폼 동영상 서비스를 제공하는 회사로, Android 플랫폼의 다양한 SDK와 모바일 애플리케이션을 개발하고 있습니다. 이 포지션은 Shoplive의 핵심 Android 제품들을 개발하고 운영하는 역할을 담당합니다.',
    mainTask:
      'Shoplive Android LivePlayer SDK 개발, Shoplive Android Short-form SDK 개발, Shoplive Android Studio SDK 개발, Shoplive B2C/B2B 모바일 어플리케이션 개발',
    qualifications: [
      '3년 이상의 Android 개발 경력자',
      'Github 또는 참고될 만한 코드 제출',
      'Java 또는 Kotlin 개발 언어에 능숙한 분',
      '기획/디자인/비즈니스 등 타 직군과의 협업에 능동적이고 커뮤니케이션이 원활한 분',
      '빠르게 변화하는 환경에 따라 유연하게 대처하고 사고할 수 있는 분',
      '끈기를 가지고 집요하게 문제를 해결하는 분',
      '문제를 스스로 정의하고 해결하는 분',
    ],
    preferredQualifications: [
      'Git-flow를 활용하여 개발해 보신 분',
      '아키텍쳐, 클린코드, 리펙토링, 코드리뷰에 경험이나 관심이 많으신 분',
      '본인의 개발 코드의 line 단위 상세한 설명이 가능하신 분',
      'Flutter 개발 경험 있는 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-02-21/f94676f8-cdd4-4cdd-8934-7af0ff6bbe06.webp',
    url: 'https://groupby.kr/positions/5124',
    prompt: () => getPositionPrompt('83'),
    uploadedAt: '2025-05-25T20:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '84',
    companyName: '북아이피스',
    jobTitle: 'Jr. Backend Engineer (6개월 인턴십 프로그램, 정규직 전환형)',
    conditions: ['백엔드 개발', '신입', '서울 서초구', '인턴'],
    jobType: 'IT-개발',
    positionDescription:
      '시스템을 점진적으로 확장하고, 품질을 함께 고민할 백엔드 개발자를 찾습니다. 단기적인 해결보다 지속 가능하고 확장성 있는 시스템을 함께 설계하고 개선할 수 있는 개발자를 찾고 있어요.',
    mainTask:
      '신규 엑스퍼트 서비스 API 서버 개발, NestJS 기반 API 서버 개발, AWS 기반의 인프라 운영 (Aurora, Redis, Beanstalk 등), 확장 가능하고 안정적인 구조로의 개선 방향 제안 및 실행, 엑스퍼트 서비스 API 서버를 직접 설계하고 운영하며 트래픽과 비즈니스 성장에 맞춰 점진적으로 시스템을 개선, 기획자, 디자이너, 프론트엔드 개발자, QA 등 다양한 직군과 협업하며 기술적 결정에 대한 팀 얼라인, 기술 부채를 무시하지 않고 우선순위 높은 과제부터 개선, AWS 기반의 인프라 설계 및 운영, 데브옵스 영역까지 백엔드의 넓은 영역을 직접 다루고 성장',
    qualifications: [
      '백엔드 개발 경험이 있거나, 관련 프로젝트를 수행해본 경험이 있는 분',
      'REST API에 대한 이해가 있고, 문서나 레퍼런스를 참고해 기능을 구현할 수 있는 분',
      '사용자 중심의 서비스에 관심이 많고, 기획의도나 사용성을 고려한 개발에 관심 있는 분',
      '문제 해결 과정에서 다양한 시각을 수용하고, 팀원과 협업하며 함께 성장하고 싶은 분',
      '맡은 업무에 책임감을 갖고, 주어진 방향 안에서 자율적으로 목표를 설정하고 실행할 수 있는 분',
    ],
    preferredQualifications: [
      '클라우드(AWS 등) 환경에서 서비스를 구축하거나 배포해 본 경험',
      'CI/CD 또는 간단한 DevOps 환경 설정 경험',
      '다수의 사용자를 대상으로 한 서비스나 시스템 개발에 대한 관심 또는 경험',
      '특정 기술 스택에만 한정되지 않고, 다양한 백엔드 기술을 탐구하고 적용해보려는 태도',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-01-23/f379bfb2-d9e9-497d-a53f-98dcdf9e1f93.png',
    url: 'https://groupby.kr/positions/5092',
    prompt: () => getPositionPrompt('84'),
    uploadedAt: '2025-05-27T98:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '85',
    companyName: '뷰런테크놀로지',
    jobTitle: 'Quality Engineer(VO)',
    conditions: ['품질 엔지니어', '신입-경력 4년', '서울 서초구'],
    jobType: '엔지니어링-R&D',
    positionDescription:
      '뷰런의 VueOne팀과 VueTwo팀에서 라이다 기반 실시간 객체 및 환경 인지 기술 개발을 위한 QE 포지션입니다. 팀내 Algorithm 개발자들과 협업하여 Model의 성능을 평가하고 최고의 동료들과 함께 성장합니다.',
    mainTask:
      '표준 프로세스 기반 검증 활동 지원 (A-SPICE), 검증 케이스 작성 및 결과 기록, 검증 도구를 활용한 요구사항 검증, 설계 검증, 제품 검증 업무 지원, LiDAR 기반 인지 SW 성능 검증 지원, 평가 환경 세팅 및 기본 성능 테스트 수행, 테스트 데이터셋 준비 및 결과 기록, 성능 평가 지표 관리 보조, 기존 성능 평가 지표에 따른 데이터 수집 및 간단한 통계 분석 지원, QA 자동화 업무 참여 (중장기), 테스트 자동화 환경 구축 및 자동화 스크립트 개발 보조, 테스트 자동화 과정에서 필요한 데이터, 로그 관리 지원',
    qualifications: [
      '신입 또는 관련 경력 4년차 이하인 분',
      '기본적인 C/C++ 코드 구조 이해가 있으신 분',
      '소프트웨어 개발 프로세스와 형상 관리 도구(Git 등) 기본 이해가 있으신 분',
      '팀 협업 및 문서화 역량이 있으신 분',
    ],
    preferredQualifications: [
      'ASPICE 경험 있으신 분',
      '개발 실무 경험(C, C++, Shell)이 있으신 분',
      '객체 검출 기능 관련 평가 경험이 있으신 분',
      'Deep Learning 개발 과정에 대한 이해가 있으신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-02-21/89808c9e-5384-4b33-8470-e818ddb51306.webp',
    url: 'https://www.wanted.co.kr/wd/285538',
    prompt: () => getPositionPrompt('85'),
    uploadedAt: '2025-05-27T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '86',
    companyName: '콕스웨이브',
    jobTitle: '[Align] 백엔드 엔지니어',
    conditions: ['백엔드 개발', '경력 3년 이상', '서울 영등포구'],
    jobType: 'IT-개발',
    positionDescription:
      'LLM 기반 대화형 분석 플랫폼 Coxwave Align을 개발하며, 생성형 AI 서비스의 기획부터 운영까지 전 과정을 담당합니다.',
    mainTask:
      'Go와 Python으로 작성된 제품 백엔드, 데이터 파이프라인, 검색 백엔드를 설계하고 개발하고 운영, 사용자 피드백 및 시장 요구 사항을 토대로 제품 고도화 및 실험을 빠르게 반복하며 기획 단계부터 기술 의사 결정에 주도적으로 참여, 더 큰 시장에 대응하기 위해 스케일 가능한 아키텍쳐를 고민하고 안정적이고 빠른 서비스를 만들어가기',
    qualifications: [
      '3년 이상의 백엔드 개발 경력을 보유하고 있어요',
      'Go 언어를 이용한 개발 경험이 있거나, Go 언어에 대한 관심과 학습 의지가 있어요',
      'RDBMS, NoSQL 등 다양한 데이터베이스를 이해하고 데이터 모델링 경험을 보유하고 있어요',
    ],
    preferredQualifications: [
      'Protobuf 등 IDL을 전사적으로 표준화하여 서비스를 운영해본 경험이 있어요',
      '대용량, 고가용성 시스템을 설계, 운영해본 경험이 있어요',
      'OLAP(ClickHouse 등) 데이터베이스에서의 모델링, 그리고 활용한 서비스 개발 경험이 있어요',
      'AI Agent 시스템을 설계하고 개발, 운영해본 경험이 있어요',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-10-25/69a99142-3c60-4b35-b276-bdd4dea12488.png',
    url: 'https://groupby.kr/positions/1481',
    prompt: () => getPositionPrompt('86'),
    uploadedAt: '2025-05-27T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '87',
    companyName: '미스릴',
    jobTitle: '데이터 라벨러',
    conditions: ['데이터 라벨링', '경력 1년 이상', '서울 송파구'],
    jobType: 'AI-데이터',
    positionDescription:
      '자체 개발한 독자적 AI 기술을 통해 대한민국이 AI 기반 산업 강국으로 도약하는 데 이바지하고 있습니다. 미래 IT산업을 선도할 핵심 인재를 기다립니다.',
    mainTask:
      '카메라 이미지 데이터 라벨링(바운딩 박스, 세그멘트), 라벨링 데이터 검수, 학습 데이터 편집',
    qualifications: [
      '학력 : 무관',
      '경력 : 경력 1년 이상',
      '근무형태 : 계약직(기간제) / 재택근무 or 사무실 근무 협의',
      '근무일시 : 주 5일(월~금)',
      '근무지역 : (05825) 서울 송파구 중대로 156 태정빌딩 서울 3호선 경찰병원 에서 100m 이내',
    ],
    preferredQualifications: [
      '이미지 라벨링 유경험자',
      'AI 기업 또는 IT 분야의 이해도가 깊은 지원자',
      'CVAT 사용 유경험자',
      '꼼꼼하고, 섬세한 지원자',
      '책임감이 강한 지원자',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-05-26/7121620e-c6ec-478b-8f8c-e3a335f8967a.png',
    url: 'https://www.wanted.co.kr/wd/285083',
    prompt: () => getPositionPrompt('87'),
    uploadedAt: '2025-05-27T08:00:00+09:00',
    deadline: '2025-07-08T23:59:59+09:00',
  },
  {
    id: '88',
    companyName: '파인디지털헬스',
    jobTitle: '[딥테크팁스] 디지털헬스케어 프론트엔드 개발자',
    conditions: ['프론트엔드 개발', '경력 2년 이상', '서울 성동구'],
    jobType: 'IT-개발',
    positionDescription:
      '전세계 1000만명 파킨슨병 환자의 비약물적 치료를 통한 삶의 질 향상을 목표로, 식품의약품안전처 허가 소프트웨어 디지털치료기기 (Digital Therapeutics)를 개발하는 혁신 의료기기 Startup입니다.',
    mainTask:
      '소프트웨어 의료기기(SaMD) 모바일 애플리케이션 개발, 앱스토어 등록 및 배포 관리, Restful API 연동 개발, 프론트 스텍 Flutter Next.js 활용 개발, 백엔드 스택 Supabase PostgreSQL 연동',
    qualifications: [
      '3년 이상 프론트앤드(Flutter) 개발 경험자',
      '앱스토어/구글플레이 상용서비스 출시/운영 경험자',
      '고객 관점에서 서비스를 고민하고 고객경험에 집중하는 분',
      '요구사항 분석 및 다른 개발자와의 협업을 위한 원활한 커뮤니케이션 능력을 가진 분',
      '동료와 다양한 학습 내용을 공유하고 서로 도움 주고 받으며 기술적으로 성장하고자 하는 마인드를 가진 분',
    ],
    preferredQualifications: [
      '컴퓨터공학 관련학과 전공자',
      'iOS, AOS 개발 경험자',
      '디지털헬스케어, 병원정보시스템 개발 경험을 가지신 분',
      'Firebase, Postgre, Supabase, Docker 기반 개발 경험을 가지신 분',
      '빌드/테스트/배포자동화 (CI/CD) 경험을 가지신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-05-26/4d765b64-eeb7-4752-bf32-04db1e3b898b.png',
    url: 'https://www.wanted.co.kr/wd/285268',
    prompt: () => getPositionPrompt('88'),
    uploadedAt: '2025-05-27T08:00:00+09:00',
    deadline: '2025-06-25T23:59:59+09:00',
  },
  {
    id: '89',
    companyName: '미러로이드',
    jobTitle: '모바일 웹 프론트엔드 개발자',
    conditions: ['프론트엔드 개발', '경력 2년 이상', '경기 성남시'],
    jobType: 'IT-개발',
    positionDescription:
      '저희는 솔루션·SI·ERP·CRM 분야에서 높은 수준의 전문 지식과 경험을 가진 기업입니다. 우리의 솔루션은 고객들의 비즈니스 프로세스를 효율적으로 관리하고 최적화하는 데 도움을 주며, 성과를 극대화합니다.',
    mainTask:
      '모바일 웹 애플리케이션의 프론트엔드 개발을 담당, UI/UX 디자인을 구현하고 최적화하는 작업을 수행, 다양한 디바이스와 브라우저 환경에서의 호환성을 보장, 백엔드 팀과 협업하여 API 통합 작업을 진행, 최신 웹 기술을 활용하여 성능을 개선하고 유지보수',
    qualifications: [
      '모바일 웹 프론트엔드 개발 경력이 최소 2년 이상이신 분을 찾고 있습니다',
      'HTML, CSS, javascript에 대한 깊은 이해가 필요합니다',
      'React, Vue.js 등의 프레임워크 경험이 있으셔야 합니다',
      '버전 관리 시스템(Git) 사용에 능숙하신 분을 우대합니다',
    ],
    preferredQualifications: [
      '크로스 플랫폼 개발 경험이 있으신 분을 우대합니다',
      '애자일 개발 환경에서의 업무 경험이 있으신 분을 선호합니다',
      'Typescript 사용 경험이 있으신 분을 우대합니다',
      'javascript 사용 경험이 있느신 분을 우대합니다',
      '다국어 지원 웹사이트 개발 경험이 있으신 분을 우대합니다',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-05-26/c94b6b1b-148f-4ca1-8ab0-4606c44cef23.jpg',
    url: 'https://www.wanted.co.kr/wd/285497',
    prompt: () => getPositionPrompt('89'),
    uploadedAt: '2025-05-27T08:00:00+09:00',
    deadline: '2025-06-13T23:59:59+09:00',
  },
  {
    id: '90',
    companyName: '미러로이드',
    jobTitle: '클라이언트 Unity 개발자 (XR, 스마트 미러, 포토스튜디오)',
    conditions: ['Unity 개발', '경력 2년 이상', '경기 성남시'],
    jobType: 'IT-개발',
    positionDescription:
      '저희는 솔루션·SI·ERP·CRM 분야에서 높은 수준의 전문 지식과 경험을 가진 기업입니다. 우리의 솔루션은 고객들의 비즈니스 프로세스를 효율적으로 관리하고 최적화하는 데 도움을 주며, 성과를 극대화합니다.',
    mainTask:
      'Unity 엔진을 활용한 클라이언트 애플리케이션 개발을 담당, Unity 엔진을 활용하여 스마트 미러, 포토 스튜디오, XR 개발을 담당, 프로젝트 요구사항에 맞춘 기능 구현 및 최적화를 수행, 팀과의 협업을 통해 프로젝트 목표를 달성, 코드 리뷰 및 품질 관리를 통해 코드의 일관성과 안정성을 유지, 최신 기술 트렌드를 반영하여 프로젝트에 적용',
    qualifications: [
      'Unity 엔진을 활용한 개발 경험이 최소 2년 이상 있으신 분을 찾습니다',
      'C# 프로그래밍에 능숙하신 분을 모집합니다',
      '3D 그래픽스 및 물리 엔진에 대한 이해도가 높으신 분을 선호합니다',
      '팀 협업 및 커뮤니케이션 능력이 우수하신 분을 환영합니다',
      '문제 해결 능력이 뛰어나고 책임감이 강하신 분을 찾습니다',
    ],
    preferredQualifications: [
      'OpenCV 사용 및 이미지 프로세싱 경험이 있으신 분을 환영합니다',
      'ONNX 모델을 사용하여 애플리케이션에 적용 경험이 있으신 분을 환영합니다',
      'Shader를 사용하신 경험이 있으신 분을 환영합니다',
      'AR/VR 관련 프로젝트 경험이 있으신 분을 환영합니다',
      '다양한 플랫폼에 대한 배포 및 최적화 경험이 있으신 분을 선호합니다',
      'Git 등의 형상 관리 도구 사용 경험이 있으신 분을 우대합니다',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-05-26/c94b6b1b-148f-4ca1-8ab0-4606c44cef23.jpg',
    url: 'https://www.wanted.co.kr/wd/285496',
    prompt: () => getPositionPrompt('90'),
    uploadedAt: '2025-05-27T08:00:00+09:00',
    deadline: '2025-06-21T23:59:59+09:00',
  },
  {
    id: '91',
    companyName: '라포랩스',
    jobTitle: 'QA 엔지니어',
    conditions: ['QA 엔지니어', '경력 3년 이상', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      '퀸잇이 유저의 일상에 자연스럽게 스며들 수 있도록, 서비스 흐름을 설계하고 다듬는 메이커가 됩니다. 이 가슴 뛰는 미션을 함께 할 QA Engineer를 찾습니다!',
    mainTask:
      '다양한 시도를 통해 서비스 품질을 검증하고 제품의 안정적인 운영과 개선을 지원, 테스트 자동화가 가능한 지점을 찾아 생산성을 높임, 요구사항과 기술 문서를 분석 및 검토하여 유의미한 피드백을 제공, QA 프로세스의 병목 지점을 식별하고 개선을 위한 솔루션을 제안, 신규 및 기존 서비스의 테스트 계획을 수립하고 명확하고 간결한 테스트 케이스를 작성, 기획부터 출시까지 안정적인 서비스를 고객이 경험할 수 있도록 PO, 디자이너, 엔지니어와 긴밀하게 협업',
    qualifications: [
      '3년 이상의 인하우스 QA 경력을 보유하신 분',
      '테스트 기법을 활용한 명확하고 간결한 테스트 케이스를 작성하실 수 있으신 분',
      'Selenium, Playwright, Appium 등 테스트 자동화 도구를 활용한 경험이 있으신 분',
      '데이터 기반의 의사결정으로 동료들과 원활한 커뮤니케이션이 가능하신 분',
      '빠르게 변화하는 애자일 환경에 유연하게 대응하며 문제 해결을 즐기시는 분',
      '다양한 문제에 대한 분석능력과 솔루션 제안이 가능하신 분',
      '테스트 자동화 구축 및 운영 경험을 보유하신 분',
      'API 설계 분석 및 테스트(Postman 등) 경험 또는 이해가 있으신 분',
    ],
    preferredQualifications: [
      '고객 관점에서 문제를 공감하고 해결한 경험이 있으신 분',
      '이커머스 서비스 QA 경험 또는 기획부터 출시까지 제품 전체 주기에 대한 이해가 있으신 분',
      'AI를 활용해 QA 업무를 개선한 경험이 있으신 분',
      'API 설계 분석 및 테스트(Postman 등) 경험이 있으신 분',
      '테스트 자동화를 초기 구축부터 운영까지 경험해보신 분',
      'CI/CD 도구 활용 경험이 있으신 분',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2024-09-25/624bc6e6-010a-478e-80f5-b443f6c6823e.png',
    url: 'https://www.wanted.co.kr/wd/285486',
    prompt: () => getPositionPrompt('91'),
    uploadedAt: '2025-05-27T08:00:00+09:00',
    deadline: '상시 채용',
  },
  {
    id: '92',
    companyName: '심플사파리(아모트래블)',
    jobTitle: '풀스택 개발자',
    conditions: ['풀스택 개발', '경력 2-10년', '서울 강남구'],
    jobType: 'IT-개발',
    positionDescription:
      '아모트래블은 100개가 넘는 글로벌 도시를 여행했던 두 사람이 인간의 손길이 닿지 않은 아프리카와 인도 대자연에서 받은 감동을 더 많은 사람들과 공유하고 싶어 2019년 시작한 서비스입니다. 어드벤처 관광 시장을 선점하며 빠르게 성장하고 있습니다.',
    mainTask:
      '제품의 주요 기능을 책임지고 처음부터 끝까지 기능을 개발, 프론트엔드는 React/Next.js 백엔드는 Django를 사용하며 풀스택이라면 양쪽 모두 담당, 팀과 협업하여 제품 요구사항과 기술 솔루션을 함께 정의, API를 구축하고 데이터 모델을 관리하며 외부 서비스를 통합 (백엔드 중심), 반응형 UI를 설계하고 사용자 경험을 최적화 (프론트엔드 중심), 코드 리뷰 아키텍처 결정 DevOps 개선 작업에 참여',
    qualifications: [
      '소프트웨어 엔지니어로서 2~5년의 경력이 있으신 분',
      'React/Next.js 또는 Django/Python 중 하나에 능숙하며, 다른 하나도 익힐 의지가 있으신 분',
      '기능을 주도적으로 개발하고 문제를 처음부터 끝까지 해결할 수 있는 분',
      'API, 관계형 데이터베이스, 최신 웹 도구 사용 경험이 있으신 분',
      '우선순위가 자주 바뀌는 스타트업 환경에서 빠른 속도와 높은 품질 모두를 중시하는 분',
      '소통이 원활하고 소규모 팀과 긴밀하게 협업하는 것을 즐기시는 분',
    ],
    preferredQualifications: [
      'Tailwind CSS, Django REST Framework, PostgreSQL 사용 경험',
      'Serverless, Docker, CI/CD, AWS 등 DevOps에 대한 이해',
      'UX/UI에 대한 감각 또는 클린 아키텍처에 대한 열정',
      '스타트업 근무 경험 또는 다양한 역할을 맡고 싶은 열정',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-02-19/1c387d3c-1819-428f-8e05-7921b6605b09.jpg',
    url: 'https://www.wanted.co.kr/wd/285477',
    prompt: () => getPositionPrompt('92'),
    uploadedAt: '2025-05-27T08:00:00+09:00',
    deadline: '2025-06-27T23:59:59+09:00',
  },
  {
    id: '93',
    companyName: '오렌지아이',
    jobTitle: '삼성 웹 시스템(Java) 운영&개발 업무(수원/기흥)',
    conditions: ['백엔드 개발', '경력 3-4년', '경기 수원시'],
    jobType: 'IT-개발',
    positionDescription:
      '오렌지아이는 꾸준히 성장하는 데이터 엔지니어링 솔루션 전문 기업으로, 실제 데이터 기반의 분석을 지원하는 솔루션과 서비스를 제공합니다. 주요사업: Data Enginering, Battery Test Servive, Analysis Service',
    mainTask: 'Java 웹 시스템 운영 및 개발',
    qualifications: [
      'Java 프로그래밍, REST API 설계 및 개발',
      'RDBMS를 이용한 개발',
      '컴퓨터 공학 지식',
      '서비스 개발 및 아키텍쳐 설계',
    ],
    preferredQualifications: [
      'Spring Framework 기반의 개발 경험자',
      'PostgreSQL/Oracle RDBMS, 하둡 기반의 데이터 처리 경험자',
      '형상관리 Tool(Git) 사용 경험자',
      'Javascript, jQuery 이해 및 활용이 가능하신 분',
      '협업에 능숙하고 원활한 의사소통이 가능하신 분',
      '운영/개발 팀 관리 및 이와 유사 업무 경험이 3년 이상 있으신 분',
      '창의적 문제 해결 능력과 적극적인 태도',
    ],
    logoUrl:
      'https://d2juy7qzamcf56.cloudfront.net/2025-05-26/be9738bb-bb4d-49f5-a84f-983e72e80cdd.png',
    url: 'https://www.wanted.co.kr/wd/285074',
    prompt: () => getPositionPrompt('93'),
    uploadedAt: '2025-05-27T08:00:00+09:00',
    deadline: '2025-06-01T23:59:59+09:00',
  },
]

export const sortedJobs: Job[] = jobs
  .slice()
  .sort((a, b) => Number(b.id) - Number(a.id))

// 실제 jobs 데이터에 존재하는 jobType만 필터링
export const getAvailableJobTypes = (): JobType[] => {
  const uniqueJobTypes: JobType[] = []
  const seen: Record<string, boolean> = {}
  jobs.forEach((job) => {
    if (!seen[job.jobType]) {
      uniqueJobTypes.push(job.jobType)
      seen[job.jobType] = true
    }
  })
  return uniqueJobTypes.sort()
}

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
