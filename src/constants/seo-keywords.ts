/**
 * SEO 키워드 상수
 * 모든 페이지에서 공통으로 사용되는 SEO 키워드를 관리합니다.
 */

export const SEO_KEYWORDS = {
  // AI 관련 키워드
  AI: [
    'AI 자소서',
    'AI 자기소개서',
    'AI 이력서',
    'AI 취업',
    'AI 면접',
    '인공지능 자소서',
    '인공지능 자기소개서',
    '인공지능 이력서',
  ],

  // GPT 관련 키워드
  GPT: [
    'GPT 자소서',
    'GPT 자기소개서',
    'GPT 이력서',
    'ChatGPT 자소서',
    'ChatGPT 자기소개서',
    'ChatGPT 이력서',
    'GPT 프롬프트',
  ],

  // Claude 관련 키워드
  CLAUDE: [
    'Claude 자소서',
    'Claude 자기소개서',
    'Claude 이력서',
    'Claude 프롬프트',
    '클로드 자소서',
    '클로드 자기소개서',
  ],

  // 기업/취업 관련 키워드
  CAREER: [
    '기업 분석',
    '기업 정보',
    '취업 준비',
    '면접 준비',
    '자기소개서 작성',
    '이력서 작성',
    '취업 가이드',
    '면접 가이드',
    '기업별 자소서',
  ],

  // 서비스 관련 키워드
  SERVICE: [
    '포로미',
    'Poromy',
    'AI 프롬프트',
    'AI 프롬프트 아카이브',
    '자소서 프롬프트',
    '자기소개서 프롬프트',
    '이력서 프롬프트',
  ],

  // 산업/직무 관련 키워드
  INDUSTRY: [
    'IT 취업',
    '개발자 취업',
    '기획자 취업',
    '디자이너 취업',
    '마케터 취업',
    '영업 취업',
    '인사 취업',
    '재무 취업',
  ],

  // 추가 키워드
  ADDITIONAL: [
    'AI 활용',
    'GPT 활용',
    'Claude 활용',
    '자소서 작성법',
    '자기소개서 작성법',
    '이력서 작성법',
    '취업 준비 가이드',
    '면접 준비 가이드',
    '기업별 맞춤 자소서',
    '기업별 맞춤 자기소개서',
  ],
}

// 모든 키워드를 하나의 배열로 합치는 유틸리티 함수
export const getAllKeywords = (): string => {
  return Object.values(SEO_KEYWORDS).flat().join(', ')
}

// 특정 카테고리의 키워드만 가져오는 유틸리티 함수
export const getKeywordsByCategory = (
  categories: (keyof typeof SEO_KEYWORDS)[]
): string => {
  return categories
    .map((category) => SEO_KEYWORDS[category])
    .flat()
    .join(', ')
}
