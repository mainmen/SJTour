import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { useSelectedRecord } from '@/web/map/useSelectedRecord'
import { prefersReducedMotion } from '@/web/ui/motion'

/** Zoom used when a list's "Show on map" reveals a record. */
export const REVEAL_ZOOM = 16

/** Share of the map height (from the bottom) the bottom sheet may cover. */
const SHEET_SHARE = 0.55
/** Room kept clear under the glass header, in px. */
const TOP_CLEARANCE_PX = 80

/**
 * Brings the selected record into the part of the map the sheet doesn't cover
 * (specs/2026-11-19-companies D4): from a list, zoom to it (or fit a trail's
 * whole path); from a tap, pan only if a point is off-screen or under the
 * sheet (a tapped trail line is already in view). No animation under reduced motion.
 */
export function RevealSelection() {
  const map = useMap()
  const selected = useSelectedRecord()
  const [lat, lng] = selected?.record.coordinates ?? []
  const origin = selected?.selection.origin
  const extent = selected?.module.core.extentOf?.(selected.record)
  const extentKey = extent ? extent.flat().join(',') : undefined

  useEffect(() => {
    if (lat === undefined || lng === undefined) return
    const animate = !prefersReducedMotion()
    const height = map.getSize().y
    if (extentKey) {
      if (origin !== 'list') return
      const [south, west, north, east] = extentKey.split(',').map(Number)
      map.fitBounds(
        [
          [south, west],
          [north, east],
        ],
        {
          animate,
          maxZoom: REVEAL_ZOOM,
          paddingTopLeft: [24, TOP_CLEARANCE_PX],
          paddingBottomRight: [24, height * SHEET_SHARE],
        },
      )
    } else if (origin === 'list') {
      // Centre the record in the visible band between the header and the sheet.
      const zoom = Math.max(map.getZoom(), REVEAL_ZOOM)
      const bandCentre = (TOP_CLEARANCE_PX + height * (1 - SHEET_SHARE)) / 2
      const point = map.project([lat, lng], zoom).add([0, height / 2 - bandCentre])
      map.setView(map.unproject(point, zoom), zoom, { animate })
    } else {
      map.panInside([lat, lng], {
        animate,
        paddingTopLeft: [24, TOP_CLEARANCE_PX],
        paddingBottomRight: [24, height * SHEET_SHARE],
      })
    }
  }, [map, lat, lng, origin, extentKey])

  return null
}
