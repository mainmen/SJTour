import { divIcon, DomEvent, point, type LeafletEvent, type Marker as LeafletMarker } from 'leaflet'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Marker, useMap } from 'react-leaflet'
import { CLUSTER_MAX_ZOOM } from '@/core/map/cluster'
import type { LatLng, LatLngBounds } from '@/core/types/geo'
import type { CategoryTone } from '@/core/types/module'
import { prefersReducedMotion } from '@/web/ui/motion'

const icons = new Map<CategoryTone, ReturnType<typeof divIcon>>()
function iconFor(tone: CategoryTone) {
  let icon = icons.get(tone)
  if (!icon) {
    icon = divIcon({
      className: `poi-marker poi-cluster poi-marker--${tone}`,
      html: '',
      iconSize: [44, 44],
      // A round badge, centred on the members' mean position.
      iconAnchor: [22, 22],
    })
    icons.set(tone, icon)
  }
  return icon
}

/** Finds the marker (or smaller cluster) that holds `recordKey` once the map has re-rendered. */
function focusMember(container: HTMLElement, recordKey: string) {
  const escaped = CSS.escape(recordKey)
  container
    .querySelector<HTMLElement>(`[data-record="${escaped}"], [data-cluster~="${escaped}"]`)
    ?.focus()
}

export type ClusterMarkerProps = {
  readonly position: LatLng
  readonly bounds: LatLngBounds
  /** `category/id` of each member, so focus can follow the first one after zooming. */
  readonly recordKeys: readonly string[]
  /** Accessible name and tooltip, in the active language. */
  readonly label: string
  readonly Icon: LucideIcon
  readonly tone: CategoryTone
}

/**
 * Several nearby records of one category drawn as a badge with their count
 * (specs/2026-11-19-mvp-release D2). Tapping it, or Enter / Space when focused,
 * zooms in until they split; keyboard focus then moves to the first member.
 */
export function ClusterMarker({
  position,
  bounds,
  recordKeys,
  label,
  Icon,
  tone,
}: ClusterMarkerProps) {
  const map = useMap()
  const markerRef = useRef<LeafletMarker>(null)
  const [element, setElement] = useState<HTMLElement | null>(null)
  const expandRef = useRef<(fromKeyboard: boolean) => void>(() => {})

  useEffect(() => {
    expandRef.current = (fromKeyboard) => {
      const target = Math.min(
        Math.max(
          map.getBoundsZoom([[...bounds[0]], [...bounds[1]]], false, point(64, 64)),
          map.getZoom() + 1,
        ),
        CLUSTER_MAX_ZOOM + 1,
      )
      if (fromKeyboard) {
        const first = recordKeys[0]
        if (first)
          map.once('zoomend', () => setTimeout(() => focusMember(map.getContainer(), first)))
      }
      const [[south, west], [north, east]] = bounds
      map.setView([(south + north) / 2, (west + east) / 2], target, {
        animate: !prefersReducedMotion(),
      })
    }
  }, [map, bounds, recordKeys])

  useEffect(() => {
    setElement(markerRef.current?.getElement() ?? null)
  }, [])

  useEffect(() => {
    if (!element) return
    element.setAttribute('aria-label', label)
    element.setAttribute('title', label)
    element.setAttribute('data-cluster', recordKeys.join(' '))
    element.removeAttribute('aria-pressed')
  }, [element, label, recordKeys])

  useEffect(() => {
    if (!element) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      event.stopPropagation()
      expandRef.current(true)
    }
    element.addEventListener('keydown', onKeyDown)
    return () => element.removeEventListener('keydown', onKeyDown)
  }, [element])

  return (
    <Marker
      ref={markerRef}
      position={[...position]}
      icon={iconFor(tone)}
      keyboard
      eventHandlers={{
        add: (event: LeafletEvent) =>
          setElement((event.target as LeafletMarker).getElement() ?? null),
        click: () => expandRef.current(false),
        dblclick: (event: LeafletEvent) => DomEvent.stopPropagation(event),
      }}
    >
      {element &&
        createPortal(
          <span className="poi-cluster__badge">
            <Icon aria-hidden="true" className="poi-cluster__icon" strokeWidth={2.5} />
            <span aria-hidden="true">{recordKeys.length}</span>
          </span>,
          element,
        )}
    </Marker>
  )
}
