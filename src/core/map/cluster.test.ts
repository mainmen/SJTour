import {
  CLUSTER_MAX_ZOOM,
  CLUSTER_RADIUS_PX,
  clusterPoints,
  projectToPixels,
  unprojectFromPixels,
} from '@/core/map/cluster'
import type { LatLng } from '@/core/types/geo'

const CENTER: LatLng = [45.3073, -73.2625]

/** A point `dx`, `dy` screen pixels from CENTER at `zoom`. */
function offset(dx: number, dy: number, zoom: number): LatLng {
  const [x, y] = projectToPixels(CENTER, zoom)
  return unprojectFromPixels([x + dx, y + dy], zoom)
}

describe('Web Mercator projection', () => {
  it('matches Leaflet at zoom 0 (256 px world)', () => {
    expect(projectToPixels([0, 0], 0)).toEqual([128, 128])
    const [x] = projectToPixels([0, 180], 0)
    expect(x).toBeCloseTo(256)
  })

  it('doubles with each zoom level and round-trips', () => {
    const [x13, y13] = projectToPixels(CENTER, 13)
    const [x14, y14] = projectToPixels(CENTER, 14)
    expect(x14).toBeCloseTo(x13 * 2)
    expect(y14).toBeCloseTo(y13 * 2)
    const [lat, lng] = unprojectFromPixels([x13, y13], 13)
    expect(lat).toBeCloseTo(CENTER[0], 9)
    expect(lng).toBeCloseTo(CENTER[1], 9)
  })
})

describe('clusterPoints', () => {
  const zoom = 13

  it('keeps distant points apart', () => {
    const points = [
      { key: 'a', position: CENTER },
      { key: 'b', position: offset(CLUSTER_RADIUS_PX + 1, 0, zoom) },
    ]
    expect(clusterPoints(points, zoom).map((c) => c.keys)).toEqual([['a'], ['b']])
  })

  it('merges points within the radius, centred on their mean, with their extent', () => {
    const b = offset(20, 0, zoom)
    const clusters = clusterPoints(
      [
        { key: 'a', position: CENTER },
        { key: 'b', position: b },
      ],
      zoom,
    )
    expect(clusters).toHaveLength(1)
    const [cluster] = clusters
    expect(cluster!.keys).toEqual(['a', 'b'])
    const [mx] = projectToPixels(cluster!.position, zoom)
    expect(mx).toBeCloseTo(projectToPixels(CENTER, zoom)[0] + 10)
    expect(cluster!.bounds[0][1]).toBeCloseTo(CENTER[1])
    expect(cluster!.bounds[1][1]).toBeCloseTo(b[1])
  })

  it('measures from the seed, in input order (stable output)', () => {
    // b is near a, c is near b but not a: c starts its own cluster.
    const points = [
      { key: 'a', position: CENTER },
      { key: 'b', position: offset(30, 0, zoom) },
      { key: 'c', position: offset(60, 0, zoom) },
    ]
    expect(clusterPoints(points, zoom).map((c) => c.keys)).toEqual([['a', 'b'], ['c']])
    expect(clusterPoints(points, zoom)).toEqual(clusterPoints(points, zoom))
  })

  it('splits as you zoom in, and never clusters above the max zoom', () => {
    const points = [
      { key: 'a', position: CENTER },
      { key: 'b', position: offset(30, 0, zoom) },
    ]
    expect(clusterPoints(points, zoom)).toHaveLength(1)
    expect(clusterPoints(points, zoom + 1)).toHaveLength(2) // now 60 px apart
    const same = [
      { key: 'a', position: CENTER },
      { key: 'b', position: CENTER },
    ]
    expect(clusterPoints(same, CLUSTER_MAX_ZOOM)).toHaveLength(1)
    expect(clusterPoints(same, CLUSTER_MAX_ZOOM + 1)).toHaveLength(2)
  })

  it('handles no points and a custom radius', () => {
    expect(clusterPoints([], zoom)).toEqual([])
    const points = [
      { key: 'a', position: CENTER },
      { key: 'b', position: offset(5, 0, zoom) },
    ]
    expect(clusterPoints(points, zoom, 0)).toHaveLength(2)
  })
})
