/**
 * Company type definition
 * Represents a company entity with its properties
 */
export type Company = {
  id: string
  name: string
  description: string
  color: string
  borderColor: string
  textColor: string
  buttonColor: string
  imageUrl: string | null
  logoUrl: string | null
  hasLogo: boolean
}
