import { z } from 'zod'
import { defineRecordSchema } from '@/core/schemas/base'

/** Business sectors. `mixed` is for districts and parks hosting many sectors. */
export const SECTORS = [
  'food',
  'retail',
  'services',
  'manufacturing',
  'technology',
  'health',
  'mixed',
] as const

export type Sector = (typeof SECTORS)[number]

/** A single business, or an industrial/tech park or business district. */
export const COMPANY_KINDS = ['business', 'park'] as const

export type CompanyKind = (typeof COMPANY_KINDS)[number]

export const companySchema = defineRecordSchema('companies', {
  sector: z.enum(SECTORS),
  kind: z.enum(COMPANY_KINDS),
})

export type Company = z.infer<typeof companySchema>
