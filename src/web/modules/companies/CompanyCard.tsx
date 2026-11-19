import { useTranslation } from 'react-i18next'
import type { Company } from '@/core/modules/companies/schema'
import type { CardProps } from '@/web/modules/types'
import { RecordBody } from '@/web/modules/shared/RecordBody'

export function CompanyCard({ record }: CardProps<Company>) {
  const { t } = useTranslation()
  return (
    <RecordBody
      record={record}
      badges={[t(`companies.kinds.${record.kind}`), t(`companies.sectors.${record.sector}`)]}
    />
  )
}
