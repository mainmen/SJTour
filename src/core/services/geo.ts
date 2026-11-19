import type { LatLng, LatLngBounds } from '@/core/types/geo'

/** Mean Earth radius (IUGG), in km. */
const EARTH_RADIUS_KM = 6371.0088

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

/** Great-circle (haversine) distance between two points, in km. */
export function distanceKm([lat1, lng1]: LatLng, [lat2, lng2]: LatLng): number {
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Length of a polyline (the sum of its segments), in km. */
export function pathLengthKm(points: readonly LatLng[]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) total += distanceKm(points[i - 1], points[i])
  return total
}

/** The smallest box holding every point. Throws on an empty list. */
export function boundsOf(points: readonly LatLng[]): LatLngBounds {
  if (points.length === 0) throw new Error('boundsOf needs at least one point')
  let [south, west] = points[0]
  let [north, east] = points[0]
  for (const [lat, lng] of points) {
    south = Math.min(south, lat)
    north = Math.max(north, lat)
    west = Math.min(west, lng)
    east = Math.max(east, lng)
  }
  return [
    [south, west],
    [north, east],
  ]
}
