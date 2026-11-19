import { activitiesWebModule } from '@/web/modules/activities'
import { companiesWebModule } from '@/web/modules/companies'
import { eventsWebModule } from '@/web/modules/events'
import { trailsWebModule } from '@/web/modules/trails'
import type { WebCategoryModule } from '@/web/modules/types'

/**
 * Every category module's web side, in display order (the core side is in
 * src/core/modules/registry.ts). Adding a category means adding one entry here.
 */
export const webModules: readonly WebCategoryModule[] = [
  companiesWebModule,
  activitiesWebModule,
  eventsWebModule,
  trailsWebModule,
]

/** The web module for a category, if registered. */
export function findWebModule(category: string): WebCategoryModule | undefined {
  return webModules.find((module) => module.id === category)
}
