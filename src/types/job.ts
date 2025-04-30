/**
 * Job type definition
 * Represents a job posting entity with its properties
 */
export type Job = {
  id: string
  companyName: string
  jobTitle: string
  conditions: string[]
  logoUrl: string
  url: string
  qualifications: string[]
  preferredQualifications: string[]
  prompt: string
}
