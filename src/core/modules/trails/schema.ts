import { z } from 'zod'
import { isInBounds, MAX_BOUNDS } from '@/core/map/config'
import { defineRecordSchema } from '@/core/schemas/base'

/** Who a trail is for. A `both` trail is drawn in the walking and the biking layers. */
export const TRAIL_TYPES = ['walk', 'bike', 'both'] as const
export type TrailType = (typeof TRAIL_TYPES)[number]

export const DIFFICULTIES = ['easy', 'moderate', 'difficult'] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

export const SURFACES = ['paved', 'gravel', 'dirt', 'boardwalk', 'mixed'] as const
export type Surface = (typeof SURFACES)[number]

/** Named trail networks (translated in the UI). */
export const NETWORKS = ['route-verte'] as const
export type Network = (typeof NETWORKS)[number]

/**
 * A GeoJSON position, `[longitude, latitude]` (RFC 7946 order, the reverse of
 * the app's `[lat, lng]`), inside the map bounds. The bounds check catches
 * positions written as `[lat, lng]` (specs/2026-11-19-trails D3).
 */
export const positionSchema = z
  .tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)])
  .refine(([lng, lat]) => isInBounds([lat, lng], MAX_BOUNDS), {
    message: 'Positions must be [lng, lat] inside Saint-Jean-sur-Richelieu (MAX_BOUNDS)',
  })

const lineSchema = z.array(positionSchema).min(2, 'A line needs at least two positions')

/** A trail's path: one line, or several disconnected sections. */
export const lineGeometrySchema = z.discriminatedUnion('type', [
  z.strictObject({ type: z.literal('LineString'), coordinates: lineSchema }),
  z.strictObject({
    type: z.literal('MultiLineString'),
    coordinates: z.array(lineSchema).min(1, 'Expected at least one line'),
  }),
])

export type LineGeometry = z.infer<typeof lineGeometrySchema>

export const trailSchema = defineRecordSchema('trails', {
  geometry: lineGeometrySchema,
  /** Official or measured length; the data test checks it against the geometry. */
  lengthKm: z.number().positive(),
  type: z.enum(TRAIL_TYPES),
  difficulty: z.enum(DIFFICULTIES),
  surface: z.enum(SURFACES),
  network: z.enum(NETWORKS).optional(),
})

export type Trail = z.infer<typeof trailSchema>
