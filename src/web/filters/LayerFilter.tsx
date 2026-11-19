import { useTranslation } from 'react-i18next'
import { isLayerId } from '@/core/filters/layers'
import { webModules } from '@/web/modules/registry'
import { filterStore, useAppStore } from '@/web/state/stores'
import { FilterChips } from '@/web/ui/FilterChips'

/** Every module's layers, in registry order (companies … biking). */
const layers = webModules.flatMap((module) => module.layers)

/** The layer toggle chips, bound to the shared filter store (map and list). */
export function LayerFilter({ className }: { className?: string }) {
  const { t } = useTranslation()
  const enabled = useAppStore(filterStore, (state) => state.enabled)
  return (
    <FilterChips
      label={t('layers.label')}
      className={className}
      chips={layers.map(({ id, labelKey, Icon }) => ({
        id,
        label: t(labelKey),
        Icon,
        pressed: enabled.includes(id),
      }))}
      onToggle={(id) => {
        if (isLayerId(id)) filterStore.getState().toggle(id)
      }}
    />
  )
}
