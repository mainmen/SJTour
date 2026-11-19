import type { LatLng } from '@/core/types/geo'

/**
 * Which maps app the "Directions" hand-off opens. No API key either way; only
 * the destination is in the link, and the user's location never leaves the
 * device through us (specs/mission.md → Privacy).
 */
export type MapsProvider = 'apple' | 'google'

/** Apple devices (iPadOS reports "Macintosh") open Apple Maps; everything else Google Maps. */
export function detectMapsProvider(userAgent: string): MapsProvider {
  return /iPhone|iPad|iPod|Macintosh/.test(userAgent) ? 'apple' : 'google'
}

/** Up to ~1 m precision is plenty for a destination. */
const formatCoordinate = (value: number) => String(Number(value.toFixed(6)))

/**
 * A universal link that opens the device's maps app (or its website) with
 * directions to `destination`. The travel mode is left to the user.
 */
export function directionsUrl([lat, lng]: LatLng, provider: MapsProvider): string {
  const point = `${formatCoordinate(lat)},${formatCoordinate(lng)}`
  if (provider === 'apple') {
    return `https://maps.apple.com/?${new URLSearchParams({ daddr: point })}`
  }
  return `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', destination: point })}`
}
