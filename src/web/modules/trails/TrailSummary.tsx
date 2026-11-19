import { useTranslation } from 'react-i18next'
import type { Trail } from '@/core/modules/trails/schema'
import { formatKm } from '@/core/services/units'
import type { CardProps } from '@/web/modules/types'
import { useLanguage } from '@/web/state/useLanguage'

export function TrailSummary({ record }: CardProps<Trail>) {
  const { t } = useTranslation()
  const language = useLanguage()
  return (
    <p className="text-ink-muted">
      {formatKm(record.lengthKm, language)} · {t(`trails.difficulties.${record.difficulty}`)} ·{' '}
      {t(`trails.types.${record.type}`)}
    </p>
  )
}
