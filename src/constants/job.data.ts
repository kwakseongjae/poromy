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
    url: 'https://www.wanted.co.kr/wd/282961',
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
    url: 'https://www.wanted.co.kr/wd/282928',
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
    url: 'https://groupby.kr/positions/5005',
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
    url: 'https://www.wanted.co.kr/wd/282997',
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
    url: 'https://recruit.navercloudcorp.com/rcrt/view.do?annoId=30003399&lang=ko',
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
    url: 'https://www.wanted.co.kr/wd/282976',
    prompt: () => getPositionPrompt('6'),
  },
  {
    id: '7',
    companyName: '피카부랩스',
    jobTitle: '[인턴] AI 엔지니어',
    conditions: ['AI엔지니어', '신입', '서울 강남구', '인턴'],
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
  },
  {
    id: '8',
    companyName: '아시아나IDT',
    jobTitle:
      'AI/빅데이터 연구개발 - 인공지능 엔지니어(AE) 및 데이터 과학자(DS)',
    conditions: ['AI/ML', '경력 2년 이상', '서울 종각'],
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
  },
  {
    id: '9',
    companyName: '딥세일즈',
    jobTitle: '[인턴] 웹 크롤링/스크래핑 엔지니어',
    conditions: ['데이터엔지니어', '신입', '서울 강남구', '인턴'],
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
  },
  {
    id: '10',
    companyName: '마이리얼트립',
    jobTitle: 'Product Manager, FTN',
    conditions: ['PM', '경력 3년 이상', '서울'],
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
  },
  {
    id: '11',
    companyName: '모요',
    jobTitle: 'Frontend Developer - Product',
    conditions: ['프론트엔드', '경력 3-10년', '서울 서초구'],
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
  },
  {
    id: '12',
    companyName: '넥스트그라운드',
    jobTitle: '[인턴] 백엔드 개발자',
    conditions: ['백엔드', '신입', '서울 강남구', '인턴'],
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
  },
  {
    id: '13',
    companyName: '애드쉴드',
    jobTitle: 'Frontend Engineer',
    conditions: ['프론트엔드', '경력 1년 이상', '서울 강남구'],
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
  },
]
