import { activitiesModule } from '@/core/modules/activities/module'
import { companiesModule } from '@/core/modules/companies/module'
import type { CoreCategoryModule } from '@/core/types/module'

/**
 * Every category module's core side, in display order. Adding a category means
 * adding one entry here (and one in src/web/modules/registry.ts).
 */
export const coreModules: readonly CoreCategoryModule[] = [companiesModule, activitiesModule]
