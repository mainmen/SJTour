import { useTranslation } from 'react-i18next'
import type { Company } from '@/core/modules/companies/schema'
import type { CardProps } from '@/web/modules/types'

export function CompanySummary({ record }: CardProps<Company>) {
  const { t } = useTranslation()
  return (
    <p className="text-ink-muted">
      {t(`companies.kinds.${record.kind}`)} · {t(`companies.sectors.${record.sector}`)}
    </p>
  )
}
