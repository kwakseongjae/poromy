/**
 * Company type definition
 * Represents a company entity with its properties
 */
export type Company = {
  id: string
  name: string
  description: string
  color: string
  textColor: string
  buttonColor: string
  logoUrl: string | null
  hasLogo: boolean
}
