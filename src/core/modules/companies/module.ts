import { companySchema, type Company } from '@/core/modules/companies/schema'
import type { CoreCategoryModule } from '@/core/types/module'

export const companiesModule: CoreCategoryModule<Company> = {
  id: 'companies',
  dataFile: 'data/companies.json',
  recordSchema: companySchema,
}
