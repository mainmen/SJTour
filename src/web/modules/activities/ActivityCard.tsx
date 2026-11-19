import { useTranslation } from 'react-i18next'
import type { Activity } from '@/core/modules/activities/schema'
import { RecordBody } from '@/web/modules/shared/RecordBody'
import type { CardProps } from '@/web/modules/types'

export function ActivityCard({ record }: CardProps<Activity>) {
  const { t } = useTranslation()
  return (
    <RecordBody record={record} badges={[t(`activities.subcategories.${record.subcategory}`)]} />
  )
}
