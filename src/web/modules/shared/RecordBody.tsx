import { ExternalLinkIcon, MapPinIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { BaseRecord } from '@/core/schemas/base'
import { formatDate } from '@/core/services/dates'
import { pickText } from '@/core/types/bilingual'
import { useLanguage } from '@/web/state/useLanguage'

/** A short text label (category facets, status). Never colour-only. */
export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'sample'
}) {
  return (
    <span
      className={
        tone === 'sample'
          ? 'rounded-full border border-dashed border-ink-muted px-2 py-0.5 text-xs font-medium text-ink'
          : 'rounded-full bg-ink/5 px-2 py-0.5 text-xs font-medium text-ink'
      }
    >
      {children}
    </span>
  )
}

type RecordBodyProps = {
  readonly record: BaseRecord
  /** Category-specific labels (sector, subcategory, status…). */
  readonly badges?: readonly string[]
  /** Category-specific content shown after the description (e.g. event dates). */
  readonly children?: ReactNode
}

/**
 * The parts every card shares: badges, description, address, website and the
 * "last verified" date, plus a "Sample data" badge for placeholder records.
 */
export function RecordBody({ record, badges = [], children }: RecordBodyProps) {
  const { t } = useTranslation()
  const language = useLanguage()
  return (
    <div className="flex flex-col gap-3 text-sm text-ink">
      {(badges.length > 0 || record.sample) && (
        <p className="flex flex-wrap gap-1.5">
          {badges.map((badge) => (
            <Badge key={badge}>{badge}</Badge>
          ))}
          {record.sample && <Badge tone="sample">{t('card.sample')}</Badge>}
        </p>
      )}
      {children}
      <p>{pickText(record.description, language)}</p>
      {(record.address || record.website) && (
        <dl className="flex flex-col gap-1.5">
          {record.address && (
            <div className="flex items-start gap-2">
              <dt>
                <MapPinIcon aria-hidden="true" className="mt-0.5 size-4 text-ink-muted" />
                <span className="sr-only">{t('card.address')}</span>
              </dt>
              <dd>{record.address}</dd>
            </div>
          )}
          {record.website && (
            <div className="flex items-start gap-2">
              <dt>
                <ExternalLinkIcon aria-hidden="true" className="mt-0.5 size-4 text-ink-muted" />
                <span className="sr-only">{t('card.website')}</span>
              </dt>
              <dd>
                <a
                  href={record.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium break-all text-accent underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  {new URL(record.website).hostname}{' '}
                  <span className="sr-only">{t('card.newTab')}</span>
                </a>
              </dd>
            </div>
          )}
        </dl>
      )}
      <p className="text-xs text-ink-muted">
        {t('card.lastVerified', { date: formatDate(record.lastVerified, language) })}
      </p>
    </div>
  )
}
