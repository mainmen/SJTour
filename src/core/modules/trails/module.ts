import { featureCollectionSchema } from '@/core/modules/trails/geojson'
import { trailSchema, type Trail } from '@/core/modules/trails/schema'
import { trailExtent } from '@/core/modules/trails/selectors'
import type { CoreCategoryModule } from '@/core/types/module'

export const trailsModule: CoreCategoryModule<Trail> = {
  id: 'trails',
  dataFile: 'data/trails.geojson',
  recordSchema: trailSchema,
  fileSchema: featureCollectionSchema,
  extentOf: trailExtent,
}
