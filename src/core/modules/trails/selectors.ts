import type { LineGeometry, Trail, TrailType } from '@/core/modules/trails/schema'
import { boundsOf, pathLengthKm } from '@/core/services/geo'
import type { LatLng, LatLngBounds } from '@/core/types/geo'

/** The two trail map layers (specs/mission.md → Trails). */
export const TRAIL_LAYERS = ['walking', 'biking'] as const
export type TrailLayer = (typeof TRAIL_LAYERS)[number]

const LAYER_TYPES: Record<TrailLayer, readonly TrailType[]> = {
  walking: ['walk', 'both'],
  biking: ['bike', 'both'],
}

/** Whether a trail belongs to a layer: `both` trails belong to each. */
export function isInTrailLayer(trail: Trail, layer: TrailLayer): boolean {
  return LAYER_TYPES[layer].includes(trail.type)
}

/** Trails of one layer, in their original order. */
export function trailsInLayer(trails: readonly Trail[], layer: TrailLayer): Trail[] {
  return trails.filter((trail) => isInTrailLayer(trail, layer))
}

/** The layers a trail is drawn in. */
export function layersOfTrail(trail: Trail): TrailLayer[] {
  return TRAIL_LAYERS.filter((layer) => isInTrailLayer(trail, layer))
}

/** A geometry's lines, each as `[lat, lng]` points (GeoJSON stores `[lng, lat]`). */
export function geometryLines(geometry: LineGeometry): LatLng[][] {
  const lines = geometry.type === 'LineString' ? [geometry.coordinates] : geometry.coordinates
  return lines.map((line) => line.map(([lng, lat]): LatLng => [lat, lng]))
}

/** The trail's lines as `[lat, lng]` points. */
export function trailLines(trail: Trail): LatLng[][] {
  return geometryLines(trail.geometry)
}

/** The box around a trail's whole path. */
export function trailExtent(trail: Trail): LatLngBounds {
  return boundsOf(trailLines(trail).flat())
}

/** The length of a trail's drawn path, in km (sections are not joined). */
export function geometryLengthKm(trail: Trail): number {
  return trailLines(trail).reduce((total, line) => total + pathLengthKm(line), 0)
}
