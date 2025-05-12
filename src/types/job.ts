/**
 * Job type definition
 * Represents a job posting entity with its properties
 */
export interface Job {
  id: string
  companyName: string
  jobTitle: string
  conditions: string[]
  positionDescription: string | null
  mainTask: string | null
  qualifications: string[]
  preferredQualifications: string[]
  logoUrl: string
  url: string
  prompt: () => Promise<string>
}
