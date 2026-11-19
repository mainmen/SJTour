import { useTranslation } from 'react-i18next'
import type { Trail } from '@/core/modules/trails/schema'
import { formatKm } from '@/core/services/units'
import { RecordBody } from '@/web/modules/shared/RecordBody'
import type { CardProps } from '@/web/modules/types'
import { useLanguage } from '@/web/state/useLanguage'

/** Length, difficulty and surface, as a list of term/value pairs. */
export function TrailFacts({ trail }: { trail: Trail }) {
  const { t } = useTranslation()
  const language = useLanguage()
  const facts = [
    [t('trails.length'), formatKm(trail.lengthKm, language)],
    [t('trails.difficulty'), t(`trails.difficulties.${trail.difficulty}`)],
    [t('trails.surface'), t(`trails.surfaces.${trail.surface}`)],
  ] as const
  return (
    <dl className="grid grid-cols-3 gap-2 rounded-lg bg-ink/5 p-2 text-center">
      {facts.map(([term, value]) => (
        <div key={term} className="flex flex-col-reverse">
          <dt className="text-xs text-ink-muted">{term}</dt>
          <dd className="font-semibold text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function TrailCard({ record }: CardProps<Trail>) {
  const { t } = useTranslation()
  const badges = [t(`trails.types.${record.type}`)]
  if (record.network) badges.push(t(`trails.networks.${record.network}`))
  return (
    <RecordBody record={record} badges={badges}>
      <TrailFacts trail={record} />
    </RecordBody>
  )
}
