import type { Company, Sector } from '@/core/modules/companies/schema'

/** Industrial/tech parks and business districts. */
export function parks(companies: readonly Company[]): Company[] {
  return companies.filter((company) => company.kind === 'park')
}

/** Companies in one sector. */
export function bySector(companies: readonly Company[], sector: Sector): Company[] {
  return companies.filter((company) => company.sector === sector)
}
