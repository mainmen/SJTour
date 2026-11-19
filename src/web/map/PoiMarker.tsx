import { divIcon, DomEvent, type LeafletEvent, type Marker as LeafletMarker } from 'leaflet'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Marker } from 'react-leaflet'
import type { LatLng } from '@/core/types/geo'
import type { CategoryTone } from '@/core/types/module'

/** One shared icon per tone: a 44 × 44 px tap target with the pin drawn inside it. */
const icons = new Map<CategoryTone, ReturnType<typeof divIcon>>()
function iconFor(tone: CategoryTone) {
  let icon = icons.get(tone)
  if (!icon) {
    icon = divIcon({
      className: `poi-marker poi-marker--${tone}`,
      html: '',
      iconSize: [44, 44],
      // The pin's tip (bottom centre) sits on the coordinates.
      iconAnchor: [22, 42],
    })
    icons.set(tone, icon)
  }
  return icon
}

export type PoiMarkerProps = {
  readonly position: LatLng
  /** Accessible name and tooltip, in the active language. */
  readonly label: string
  /** `category/id`, so focus can return to this marker. */
  readonly recordKey: string
  readonly Icon: LucideIcon
  readonly tone: CategoryTone
  readonly selected: boolean
  readonly onSelect: () => void
}

/**
 * A map marker for one record: a keyboard-focusable button (Leaflet adds
 * `tabindex` and `role="button"`) showing the category icon. Enter or Space
 * selects it, like a tap.
 */
export function PoiMarker({
  position,
  label,
  recordKey,
  Icon,
  tone,
  selected,
  onSelect,
}: PoiMarkerProps) {
  const markerRef = useRef<LeafletMarker>(null)
  const [element, setElement] = useState<HTMLElement | null>(null)
  const onSelectRef = useRef(onSelect)
  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  // The child Marker has been added to the map by the time this runs.
  useEffect(() => {
    setElement(markerRef.current?.getElement() ?? null)
  }, [])

  useEffect(() => {
    if (!element) return
    element.setAttribute('aria-label', label)
    element.setAttribute('title', label)
    element.setAttribute('data-record', recordKey)
    element.setAttribute('aria-pressed', String(selected))
    element.classList.toggle('is-selected', selected)
  }, [element, label, recordKey, selected])

  useEffect(() => {
    if (!element) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      event.stopPropagation() // Leaflet's map keyboard handler must not also act on it.
      onSelectRef.current()
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
      zIndexOffset={selected ? 1000 : 0}
      eventHandlers={{
        add: (event: LeafletEvent) =>
          setElement((event.target as LeafletMarker).getElement() ?? null),
        click: () => onSelectRef.current(),
        // Two quick taps select twice; they must not also zoom the map.
        dblclick: (event: LeafletEvent) => DomEvent.stopPropagation(event),
      }}
    >
      {element &&
        createPortal(
          <span className="poi-marker__pin">
            <Icon aria-hidden="true" className="poi-marker__icon" strokeWidth={2.25} />
          </span>,
          element,
        )}
    </Marker>
  )
}
