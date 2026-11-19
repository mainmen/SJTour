import { featureCollectionSchema } from '@/core/modules/trails/geojson'
import { trailSchema, type Trail } from '@/core/modules/trails/schema'
import { isInTrailLayer, trailExtent } from '@/core/modules/trails/selectors'
import type { CoreCategoryModule } from '@/core/types/module'

export const trailsModule: CoreCategoryModule<Trail> = {
  id: 'trails',
  // A `both` trail is in each layer.
  layers: [
    { id: 'walking', includes: (trail) => isInTrailLayer(trail, 'walking') },
    { id: 'biking', includes: (trail) => isInTrailLayer(trail, 'biking') },
  ],
  dataFile: 'data/trails.geojson',
  recordSchema: trailSchema,
  fileSchema: featureCollectionSchema,
  extentOf: trailExtent,
}
