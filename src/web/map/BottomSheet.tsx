import { ChevronRightIcon, XIcon } from 'lucide-react'
import { useEffect, useId, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { pickText } from '@/core/types/bilingual'
import { recordPath } from '@/web/app/paths'
import { useSelectedRecord } from '@/web/map/useSelectedRecord'
import { selectionStore } from '@/web/state/stores'
import { useLanguage } from '@/web/state/useLanguage'
import { GlassCard } from '@/web/ui/GlassCard'
import { RippleButton } from '@/web/ui/RippleButton'

/** Gap between the sheet and the nav, and between the sheet and the map controls above it. */
const SHEET_GAP_PX = 8

/** Focuses the marker of `recordKey` (`category/id`), if it is on the map. */
function focusMarker(recordKey: string) {
  document.querySelector<HTMLElement>(`[data-record="${CSS.escape(recordKey)}"]`)?.focus()
}

/**
 * The selected record's card, on a glass panel docked above the bottom nav.
 * A non-modal dialog (specs/2026-11-19-companies D2): the map stays usable.
 * Focus moves to it when it opens, and back to the marker when it closes.
 */
export function BottomSheet() {
  const { t } = useTranslation()
  const language = useLanguage()
  const selected = useSelectedRecord()
  const sheetRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const recordKey = selected && `${selected.module.id}/${selected.record.id}`

  const close = () => {
    selectionStore.getState().clear()
    if (recordKey) focusMarker(recordKey)
  }
  const closeRef = useRef(close)
  useEffect(() => {
    closeRef.current = close
  })

  // Focus the sheet when it opens or shows another record.
  useEffect(() => {
    if (recordKey) sheetRef.current?.focus()
  }, [recordKey])

  // Escape closes the sheet, wherever focus is.
  useEffect(() => {
    if (!recordKey) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [recordKey])

  // Lift the map's bottom controls and attribution above the sheet (D5), through
  // `--sheet-offset` on the sheet's container (which also holds the map). The
  // sheet's own ref is used: a parent's ref isn't attached yet when both mount
  // in the same commit (e.g. arriving from "Show on map" with the sheet open).
  useLayoutEffect(() => {
    const sheet = sheetRef.current
    const container = sheet?.parentElement
    if (!sheet || !container) return
    const update = () =>
      container.style.setProperty('--sheet-offset', `${sheet.offsetHeight + SHEET_GAP_PX}px`)
    update()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(sheet)
    return () => {
      observer?.disconnect()
      container.style.removeProperty('--sheet-offset')
    }
  }, [recordKey])

  if (!selected) return null
  const { module, record } = selected
  const { Card, Icon } = module

  return (
    <div
      ref={sheetRef}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="absolute inset-x-2 z-[1100] mx-auto max-w-md rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      style={{
        bottom: `calc(var(--shell-bar-height) + 1px + env(safe-area-inset-bottom) + ${SHEET_GAP_PX}px)`,
      }}
    >
      <GlassCard className="flex max-h-[55dvh] flex-col overflow-hidden rounded-2xl border shadow-lg">
        <div className="flex items-start gap-2 p-4 pb-2">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
              <Icon aria-hidden="true" className="size-4" />
              {t(module.labelKey)}
            </p>
            <h3 id={titleId} className="mt-0.5 text-lg leading-snug font-semibold text-ink">
              {pickText(record.name, language)}
            </h3>
          </div>
          <RippleButton
            aria-label={t('card.close')}
            onClick={close}
            className="-mt-1 -mr-1 flex size-11 shrink-0 items-center justify-center rounded-full text-ink-muted"
          >
            <XIcon aria-hidden="true" className="size-5" />
          </RippleButton>
        </div>
        <div className="overflow-y-auto px-4 pb-4">
          <Card record={record} />
          <Link
            to={recordPath({ category: module.id, id: record.id })}
            aria-label={t('card.detailsNamed', { name: pickText(record.name, language) })}
            className="mt-3 flex min-h-11 items-center justify-center gap-1 rounded-lg border border-accent px-3 text-sm font-semibold text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {t('card.details')}
            <ChevronRightIcon aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
