import { CheckIcon, MapPinIcon } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { enabledModuleLayers, visibleRecords } from '@/core/filters/selectors'
import type { BaseRecord } from '@/core/schemas/base'
import { IDLE, type CollectionState } from '@/core/store/catalog'
import { isSelected } from '@/core/store/selection'
import { sortByName } from '@/core/services/sort'
import { pickText } from '@/core/types/bilingual'
import { recordPath } from '@/web/app/paths'
import { LayerFilter } from '@/web/filters/LayerFilter'
import { webModules } from '@/web/modules/registry'
import type { WebCategoryModule } from '@/web/modules/types'
import { catalogStore, filterStore, selectionStore, useAppStore } from '@/web/state/stores'
import { useLanguage } from '@/web/state/useLanguage'
import { useShowOnMap } from '@/web/state/useShowOnMap'
import { cx } from '@/web/ui/cx'
import { Badge } from '@/web/modules/shared/RecordBody'
import { RippleButton } from '@/web/ui/RippleButton'

type ListItemProps = {
  readonly module: WebCategoryModule
  readonly record: BaseRecord
  readonly selected: boolean
}

function ListItem({ module, record, selected }: ListItemProps) {
  const { t } = useTranslation()
  const language = useLanguage()
  const showOnMap = useShowOnMap()
  const itemRef = useRef<HTMLLIElement>(null)
  const name = pickText(record.name, language)
  const { Summary } = module

  // Coming back from the map: bring the selected item into view.
  useEffect(() => {
    if (selected) itemRef.current?.scrollIntoView?.({ block: 'center' })
  }, [selected])

  return (
    <li
      ref={itemRef}
      aria-current={selected ? 'true' : undefined}
      className={cx(
        'flex flex-col gap-1.5 rounded-xl border bg-surface p-4 text-sm shadow-sm',
        selected ? 'border-2 border-accent' : 'border-glass-border',
      )}
    >
      <h4 className="text-base leading-snug font-semibold text-ink">
        <Link
          to={recordPath({ category: module.id, id: record.id })}
          className="underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {name}
        </Link>
      </h4>
      <Summary record={record} />
      {record.address && <p className="text-ink-muted">{record.address}</p>}
      {(selected || record.sample) && (
        <p className="flex flex-wrap gap-1.5">
          {selected && (
            <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">
              <CheckIcon aria-hidden="true" className="size-3" strokeWidth={3} />
              {t('list.selected')}
            </span>
          )}
          {record.sample && <Badge tone="sample">{t('card.sample')}</Badge>}
        </p>
      )}
      <RippleButton
        aria-label={t('list.showOnMapNamed', { name })}
        onClick={() => showOnMap(module, record)}
        className="mt-1 flex min-h-11 items-center justify-center gap-2 self-start rounded-lg border border-accent px-3 font-semibold text-accent"
      >
        <MapPinIcon aria-hidden="true" className="size-4" />
        {t('events.showOnMap')}
      </RippleButton>
    </li>
  )
}

type CategorySectionProps = {
  readonly module: WebCategoryModule
  readonly collection: CollectionState
  readonly records: readonly BaseRecord[]
}

/** One category's heading and items, or its loading / error / empty state. */
function CategorySection({ module, collection, records }: CategorySectionProps) {
  const { t } = useTranslation()
  const headingId = useId()
  const selection = useAppStore(selectionStore, (state) => state.selected)
  const { Icon } = module
  const label = t(module.labelKey)

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h3 id={headingId} className="flex items-center gap-2 text-base font-semibold text-ink">
        <Icon aria-hidden="true" className="size-5 text-ink-muted" />
        {collection.status === 'success'
          ? t('list.categoryCount', { category: label, count: records.length })
          : label}
      </h3>
      {collection.status === 'error' ? (
        <div role="alert" className="flex items-center gap-3 text-sm text-ink">
          <p className="flex-1">{t('list.loadError', { category: label })}</p>
          <RippleButton
            onClick={() => void catalogStore.getState().load(module.core, { reload: true })}
            className="min-h-11 rounded-lg px-3 font-semibold text-accent"
          >
            {t('map.retry')}
          </RippleButton>
        </div>
      ) : collection.status !== 'success' ? (
        <p className="text-sm text-ink-muted">{t('list.loading')}</p>
      ) : records.length === 0 ? (
        <p className="text-sm text-ink-muted">{t('list.empty')}</p>
      ) : (
        <ul aria-labelledby={headingId} className="flex flex-col gap-3">
          {records.map((record) => (
            <ListItem
              key={record.id}
              module={module}
              record={record}
              selected={isSelected(selection, { category: module.id, id: record.id })}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

/**
 * The accessible equivalent of the map (specs/mission.md → Map-centric,
 * list-friendly): every visible item, grouped by category and sorted by name,
 * using the same layer filters (and URL) as the map. "Show on map" focuses an
 * item on the map; coming back highlights the item selected there.
 */
export function ListPage() {
  const { t } = useTranslation()
  const language = useLanguage()
  const enabled = useAppStore(filterStore, (state) => state.enabled)
  const collections = useAppStore(catalogStore, (state) => state.collections)
  const [now] = useState(() => new Date())

  useEffect(() => {
    for (const module of webModules) void catalogStore.getState().load(module.core)
  }, [])

  const sections = useMemo(
    () =>
      webModules
        .filter((module) => enabledModuleLayers(module.core, enabled).length > 0)
        .map((module) => {
          const collection: CollectionState = collections[module.id] ?? IDLE
          const records =
            collection.status === 'success'
              ? sortByName(visibleRecords(module.core, collection.records, enabled, now), language)
              : []
          return { module, collection, records }
        }),
    [collections, enabled, language, now],
  )
  const total = sections.reduce((sum, section) => sum + section.records.length, 0)
  const loaded = sections.every((section) => section.collection.status !== 'loading')

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      <h2 className="text-lg font-semibold text-ink">{t('pages.list.title')}</h2>
      <LayerFilter />
      {sections.length === 0 ? (
        <div className="flex flex-col items-start gap-2 text-sm">
          <p className="text-ink-muted">{t('list.noLayers')}</p>
          <RippleButton
            onClick={() => filterStore.getState().showAll()}
            className="min-h-11 rounded-lg border border-accent px-3 font-semibold text-accent"
          >
            {t('list.showAll')}
          </RippleButton>
        </div>
      ) : (
        <>
          <p role="status" className="text-sm text-ink-muted">
            {loaded ? t('list.count', { count: total }) : t('list.loading')}
          </p>
          {sections.map((section) => (
            <CategorySection key={section.module.id} {...section} />
          ))}
        </>
      )}
    </section>
  )
}
