export async function getCompanyPrompt(id: string): Promise<string> {
  try {
    const response = await fetch(`/api/prompts/company/${id}`)
    if (!response.ok) {
      return '아직 등록된 프롬프트가 없습니다.'
    }
    const data = await response.json()
    return data.prompt
  } catch {
    return '아직 등록된 프롬프트가 없습니다.'
  }
}

export async function getPositionPrompt(id: string): Promise<string> {
  try {
    const response = await fetch(`/api/prompts/position/${id}`)
    if (!response.ok) {
      return '아직 등록된 프롬프트가 없습니다.'
    }
    const data = await response.json()
    return data.prompt
  } catch {
    return '아직 등록된 프롬프트가 없습니다.'
  }
}
