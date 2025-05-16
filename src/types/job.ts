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
}
