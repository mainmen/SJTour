import { useTranslation } from 'react-i18next'
import { selectCollection } from '@/core/store/catalog'
import type { WebCategoryModule } from '@/web/modules/types'
import { catalogStore, useAppStore } from '@/web/state/stores'
import { GlassCard } from '@/web/ui/GlassCard'
import { RippleButton } from '@/web/ui/RippleButton'

/**
 * A small alert naming the categories that failed to load, with a Retry button.
 * The categories that did load keep working (specs/2026-11-19-data-layer D7).
 */
export function LoadErrors({ modules }: { modules: readonly WebCategoryModule[] }) {
  const { t } = useTranslation()
  const failed = useAppStore(catalogStore, (state) =>
    modules
      .filter((module) => selectCollection(state, module.core).status === 'error')
      .map((module) => module.id)
      .join(','),
  )
  if (!failed) return null
  const failedModules = modules.filter((module) => failed.split(',').includes(module.id))

  const retry = () => {
    for (const module of failedModules) {
      void catalogStore.getState().load(module.core, { reload: true })
    }
  }

  return (
    <GlassCard
      role="alert"
      className="absolute inset-x-2 z-[1100] mx-auto flex max-w-md items-center gap-3 rounded-xl border py-1 pr-1 pl-4 text-sm text-ink shadow"
      style={{ top: 'calc(var(--shell-bar-height) + 1px + env(safe-area-inset-top) + 8px)' }}
    >
      <p className="flex-1">
        {t('map.loadError', {
          categories: failedModules.map((module) => t(module.labelKey)).join(', '),
        })}
      </p>
      <RippleButton
        onClick={retry}
        className="min-h-11 shrink-0 rounded-lg px-3 font-semibold text-accent"
      >
        {t('map.retry')}
      </RippleButton>
    </GlassCard>
  )
}
