export async function getCompanyPrompt(id: string): Promise<string> {
  try {
    const response = await fetch(`/api/prompts/company/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch company prompt')
    }
    const data = await response.json()
    return data.prompt
  } catch (error) {
    console.error('Error fetching company prompt:', error)
    try {
      // Try to fetch default prompt
      const response = await fetch('/api/prompts/company/default')
      if (!response.ok) {
        throw new Error('Failed to fetch default prompt')
      }
      const data = await response.json()
      return data.prompt
    } catch (defaultError) {
      console.error('Error fetching default prompt:', defaultError)
      return getDefaultCompanyPrompt(id)
    }
  }
}

export async function getPositionPrompt(id: string): Promise<string> {
  try {
    const response = await fetch(`/api/prompts/position/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch position prompt')
    }
    const data = await response.json()
    return data.prompt
  } catch (error) {
    console.error('Error fetching position prompt:', error)
    try {
      // Try to fetch default prompt
      const response = await fetch('/api/prompts/position/default')
      if (!response.ok) {
        throw new Error('Failed to fetch default prompt')
      }
      const data = await response.json()
      return data.prompt
    } catch (defaultError) {
      console.error('Error fetching default prompt:', defaultError)
      return getDefaultPositionPrompt(id)
    }
  }
}

function getDefaultCompanyPrompt(id: string): string {
  return `# ${id} 자기소개서 작성 가이드

## 1. ${id} 분석

- ${id}의 핵심 서비스와 기술 스택
- 주요 사업 영역과 비전
- 조직 문화와 가치관
- 최근 주요 성과와 이슈

## 2. 핵심 역량

### 기술 역량
- 관련 기술 스택 경험
- 프로젝트 수행 경험
- 문제 해결 능력
- 기술 문서 작성 능력

### 소프트 스킬
- 커뮤니케이션 능력
- 팀워크와 협업 능력
- 자기주도적 학습 능력
- 적응력과 유연성

## 3. 작성 시 강조할 점

- 관련 프로젝트 경험
- 기술적 성과와 기여도
- 문제 해결 사례
- 성장 과정과 학습 경험

## 4. 추천 질문

### 기술 관련
- 주요 프로젝트 경험은?
- 기술적 도전과 해결 과정은?
- 최근 관심 있는 기술 트렌드는?

### 프로젝트 관련
- 가장 도전적이었던 프로젝트는?
- 팀 프로젝트에서의 역할은?
- 성과와 기여도는?

### 성장 관련
- 기술적 성장을 위해 노력한 점은?
- 향후 목표와 계획은?
- ${id}에서 이루고 싶은 목표는?`
}

function getDefaultPositionPrompt(id: string): string {
  return `# 채용 공고 자기소개서 작성 가이드

## 1. 채용 공고 분석

- 포지션의 주요 업무와 책임
- 필요한 핵심 기술과 역량
- 팀 내 역할과 기대사항
- 성과 평가 기준

## 2. 핵심 역량

### 기술 역량
- 관련 기술 스택 경험
- 프로젝트 수행 경험
- 문제 해결 능력
- 기술 문서 작성 능력

### 소프트 스킬
- 커뮤니케이션 능력
- 팀워크와 협업 능력
- 자기주도적 학습 능력
- 적응력과 유연성

## 3. 작성 시 강조할 점

- 관련 프로젝트 경험
- 기술적 성과와 기여도
- 문제 해결 사례
- 성장 과정과 학습 경험

## 4. 추천 질문

### 기술 관련
- 주요 프로젝트 경험은?
- 기술적 도전과 해결 과정은?
- 최근 관심 있는 기술 트렌드는?

### 프로젝트 관련
- 가장 도전적이었던 프로젝트는?
- 팀 프로젝트에서의 역할은?
- 성과와 기여도는?

### 성장 관련
- 기술적 성장을 위해 노력한 점은?
- 향후 목표와 계획은?
- 이 포지션에서 이루고 싶은 목표는?`
}
