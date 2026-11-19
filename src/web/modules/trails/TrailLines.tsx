import { DomEvent, type LatLngTuple, type LeafletMouseEvent } from 'leaflet'
import { LayerGroup, Polyline } from 'react-leaflet'
import type { Trail } from '@/core/modules/trails/schema'
import { trailLines, trailsInLayer, type TrailLayer } from '@/core/modules/trails/selectors'
import { isSelected } from '@/core/store/selection'
import type { OverlayProps } from '@/web/modules/types'
import { selectionStore, useAppStore } from '@/web/state/stores'

/** Biking first, so walking's dashes are drawn on top where a `both` trail is in each. */
const DRAW_ORDER: readonly TrailLayer[] = ['biking', 'walking']

/**
 * Line style per layer. The colour comes from CSS (map.css, `--color-trail-*`);
 * walking is dashed and biking solid, so the layers differ by more than colour.
 */
const DASH: Record<TrailLayer, string | undefined> = { walking: '1 9', biking: undefined }
const WEIGHT = 5
const SELECTED_WEIGHT = 8

function TrailLine({ trail, layer }: { trail: Trail; layer: TrailLayer }) {
  const selected = useAppStore(selectionStore, (state) =>
    isSelected(state.selected, { category: 'trails', id: trail.id }),
  )
  return (
    <Polyline
      positions={trailLines(trail).map((line) => line.map(([lat, lng]): LatLngTuple => [lat, lng]))}
      // Set at creation: react-leaflet applies `pathOptions` with setStyle, which ignores classes.
      className={`trail-line trail-line--${layer}`}
      pathOptions={{
        weight: selected ? SELECTED_WEIGHT : WEIGHT,
        dashArray: DASH[layer],
        lineCap: 'round',
        lineJoin: 'round',
      }}
      eventHandlers={{
        click: (event: LeafletMouseEvent) => {
          DomEvent.stopPropagation(event)
          selectionStore.getState().select({ category: 'trails', id: trail.id, origin: 'map' })
        },
      }}
    />
  )
}

/**
 * The walking and biking layers: each trail drawn as a line in every layer it
 * belongs to (`both` trails in each). Keyboard and screen-reader users reach
 * trails through their trailhead markers, which open the same card.
 */
export function TrailLines({ records }: OverlayProps<Trail>) {
  return DRAW_ORDER.map((layer) => (
    <LayerGroup key={layer}>
      {trailsInLayer(records, layer).map((trail) => (
        <TrailLine key={trail.id} trail={trail} layer={layer} />
      ))}
    </LayerGroup>
  ))
}
