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
  imageUrl: string
  logoUrl: string
  hasLogo: boolean
  type: string
  tags: string[]
  industry: string
  size: string
  headquarters: string
  founded: string
  website: string
  salary: string
  ceo: string
  marketType: string
  employeeCount: string
  employeeCountDate: string
  revenue: string
  revenueDate: string
}
