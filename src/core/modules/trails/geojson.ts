import { z } from 'zod'

/** The first position of a GeoJSON line geometry, as `[lat, lng]`, if it has one. */
function trailhead(geometry: unknown): [number, number] | undefined {
  if (typeof geometry !== 'object' || geometry === null) return undefined
  const { type, coordinates } = geometry as { type?: unknown; coordinates?: unknown }
  const first =
    type === 'LineString' && Array.isArray(coordinates)
      ? coordinates[0]
      : type === 'MultiLineString' && Array.isArray(coordinates) && Array.isArray(coordinates[0])
        ? coordinates[0][0]
        : undefined
  if (!Array.isArray(first) || typeof first[0] !== 'number' || typeof first[1] !== 'number') {
    return undefined
  }
  return [first[1], first[0]]
}

const featureSchema = z.object({
  type: z.literal('Feature'),
  geometry: z.unknown(),
  properties: z.record(z.string(), z.unknown()),
})

/**
 * Reads a GeoJSON FeatureCollection as a list of raw records: each feature's
 * properties plus its `geometry`, and `coordinates` set to the trailhead (the
 * first position, as `[lat, lng]`) so trails work wherever a point is needed
 * (marker, reveal, directions). The record schema then validates each one.
 */
export const featureCollectionSchema = z
  .object({ type: z.literal('FeatureCollection'), features: z.array(featureSchema) })
  .transform((collection): unknown[] =>
    collection.features.map((feature) => ({
      ...feature.properties,
      geometry: feature.geometry,
      coordinates: trailhead(feature.geometry),
    })),
  )
