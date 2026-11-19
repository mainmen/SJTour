import { useTranslation } from 'react-i18next'
import type { Activity } from '@/core/modules/activities/schema'
import type { CardProps } from '@/web/modules/types'

export function ActivitySummary({ record }: CardProps<Activity>) {
  const { t } = useTranslation()
  return <p className="text-ink-muted">{t(`activities.subcategories.${record.subcategory}`)}</p>
}
