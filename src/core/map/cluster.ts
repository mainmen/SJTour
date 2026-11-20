import type { LatLng, LatLngBounds } from '@/core/types/geo'

/**
 * Marker clustering (specs/2026-11-19-mvp-release D2): greedy, distance-based,
 * in screen pixels at a given zoom. Pure and renderer-agnostic, so a native
 * map could reuse it.
 */

/** Markers closer than this on screen (px) merge; a marker is 44 px wide. */
export const CLUSTER_RADIUS_PX = 40
/** Above this zoom nothing is clustered (the reveal zoom, 16, shows every marker). */
export const CLUSTER_MAX_ZOOM = 15

/** Web Mercator tile size: the world is `256 × 2^zoom` px wide. */
const TILE_SIZE = 256
const MAX_LATITUDE = 85.0511287798

export type ClusterPoint<K> = { readonly key: K; readonly position: LatLng }

export type Cluster<K> = {
  /** Member keys, in input order; one key = a lone marker. */
  readonly keys: readonly K[]
  /** Where to draw it: the mean of its members' screen positions. */
  readonly position: LatLng
  /** The members' extent (zoom to it to split the cluster). */
  readonly bounds: LatLngBounds
}

/** World pixel coordinates of a position at `zoom` (Web Mercator, like Leaflet). */
export function projectToPixels([lat, lng]: LatLng, zoom: number): [number, number] {
  const scale = TILE_SIZE * 2 ** zoom
  const clamped = Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, lat))
  const sin = Math.sin((clamped * Math.PI) / 180)
  const x = ((lng + 180) / 360) * scale
  const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale
  return [x, y]
}

/** Inverse of `projectToPixels`. */
export function unprojectFromPixels([x, y]: readonly [number, number], zoom: number): LatLng {
  const scale = TILE_SIZE * 2 ** zoom
  const lng = (x / scale) * 360 - 180
  const n = Math.PI - (2 * Math.PI * y) / scale
  const lat = (180 / Math.PI) * Math.atan(Math.sinh(n))
  return [lat, lng]
}

function boundsOf(positions: readonly LatLng[]): LatLngBounds {
  const lats = positions.map(([lat]) => lat)
  const lngs = positions.map(([, lng]) => lng)
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ]
}

/**
 * Groups points that would overlap on screen at `zoom`. Each unassigned point,
 * in input order, seeds a cluster that takes every other unassigned point
 * within `radiusPx` of it, so the result is stable for a given input. Above
 * `CLUSTER_MAX_ZOOM` every point stays alone.
 */
export function clusterPoints<K>(
  points: readonly ClusterPoint<K>[],
  zoom: number,
  radiusPx: number = CLUSTER_RADIUS_PX,
): Cluster<K>[] {
  const single = (point: ClusterPoint<K>): Cluster<K> => ({
    keys: [point.key],
    position: point.position,
    bounds: [point.position, point.position],
  })
  if (zoom > CLUSTER_MAX_ZOOM) return points.map(single)

  const projected = points.map((point) => projectToPixels(point.position, zoom))
  const assigned = new Array<boolean>(points.length).fill(false)
  const clusters: Cluster<K>[] = []

  for (let seed = 0; seed < points.length; seed++) {
    if (assigned[seed]) continue
    assigned[seed] = true
    const [sx, sy] = projected[seed]!
    const members = [seed]
    for (let other = seed + 1; other < points.length; other++) {
      if (assigned[other]) continue
      const [ox, oy] = projected[other]!
      if (Math.hypot(ox - sx, oy - sy) <= radiusPx) {
        assigned[other] = true
        members.push(other)
      }
    }
    if (members.length === 1) {
      clusters.push(single(points[seed]!))
      continue
    }
    const meanX = members.reduce((sum, i) => sum + projected[i]![0], 0) / members.length
    const meanY = members.reduce((sum, i) => sum + projected[i]![1], 0) / members.length
    clusters.push({
      keys: members.map((i) => points[i]!.key),
      position: unprojectFromPixels([meanX, meanY], zoom),
      bounds: boundsOf(members.map((i) => points[i]!.position)),
    })
  }
  return clusters
}
