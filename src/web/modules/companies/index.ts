import { Building2Icon } from 'lucide-react'
import { companiesModule as core } from '@/core/modules/companies/module'
import { CompanyCard } from '@/web/modules/companies/CompanyCard'
import { defineWebModule } from '@/web/modules/types'

export const companiesWebModule = defineWebModule({
  id: 'companies',
  core,
  labelKey: 'categories.companies',
  Icon: Building2Icon,
  tone: 'companies',
  Card: CompanyCard,
})
