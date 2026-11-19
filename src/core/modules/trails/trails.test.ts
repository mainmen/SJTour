import { trailsModule } from '@/core/modules/trails/module'
import { trailSchema, type Trail } from '@/core/modules/trails/schema'
import {
  geometryLengthKm,
  isInTrailLayer,
  layersOfTrail,
  trailExtent,
  trailLines,
  trailsInLayer,
} from '@/core/modules/trails/selectors'
import { validateCollection } from '@/core/services/loader'
import { shippedRecords } from '@/core/test/records'

function trail(overrides: Partial<Trail> = {}): Trail {
  return {
    id: 'sentier',
    category: 'trails',
    name: { fr: 'Sentier', en: 'Trail' },
    description: { fr: 'Un sentier.', en: 'A trail.' },
    coordinates: [45.3, -73.25],
    lastVerified: '2026-11-19',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-73.25, 45.3],
        [-73.24, 45.31],
      ],
    },
    lengthKm: 1.4,
    type: 'walk',
    difficulty: 'easy',
    surface: 'paved',
    ...overrides,
  }
}

/** A GeoJSON feature for `trail`, as the data file stores it (no `coordinates`). */
function feature(record: Trail) {
  const { geometry, coordinates: _coordinates, ...properties } = record
  void _coordinates
  return { type: 'Feature', properties, geometry }
}

function collection(...features: unknown[]) {
  return { type: 'FeatureCollection', features }
}

describe('trailSchema', () => {
  it('accepts a LineString and a MultiLineString trail', () => {
    expect(trailSchema.safeParse(trail()).success).toBe(true)
    const multi = trail({
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [
            [-73.25, 45.3],
            [-73.24, 45.31],
          ],
          [
            [-73.23, 45.32],
            [-73.22, 45.33],
          ],
        ],
      },
    })
    expect(trailSchema.safeParse(multi).success).toBe(true)
  })

  it.each([
    ['an unknown type', { type: 'ski' }, 'type'],
    ['an unknown difficulty', { difficulty: 'extreme' }, 'difficulty'],
    ['an unknown surface', { surface: 'ice' }, 'surface'],
    ['an unknown network', { network: 'trans-canada' }, 'network'],
    ['a zero length', { lengthKm: 0 }, 'lengthKm'],
    [
      'a point geometry',
      { geometry: { type: 'Point', coordinates: [-73.25, 45.3] } },
      'geometry.type',
    ],
    [
      'a one-position line',
      { geometry: { type: 'LineString', coordinates: [[-73.25, 45.3]] } },
      'geometry.coordinates',
    ],
  ])('rejects %s', (_label, patch, path) => {
    const result = trailSchema.safeParse({ ...trail(), ...patch })
    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toContain(path)
  })

  it('rejects positions written as [lat, lng]', () => {
    const swapped = trail({
      geometry: {
        type: 'LineString',
        coordinates: [
          [45.3, -73.25],
          [45.31, -73.24],
        ],
      },
    })
    const result = trailSchema.safeParse(swapped)
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/\[lng, lat\]/)
  })
})

describe('trails GeoJSON file', () => {
  it('reads features into records, with the trailhead as coordinates', () => {
    const result = validateCollection(trailsModule, collection(feature(trail())))
    expect(result).toEqual({ status: 'success', records: [trail({ coordinates: [45.3, -73.25] })] })
  })

  it('takes the trailhead of a MultiLineString from its first line', () => {
    const multi = trail({
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [
            [-73.23, 45.32],
            [-73.22, 45.33],
          ],
        ],
      },
    })
    const result = validateCollection(trailsModule, collection(feature(multi)))
    expect(result.status === 'success' && result.records[0].coordinates).toEqual([45.32, -73.23])
  })

  it('rejects a file that is not a FeatureCollection', () => {
    const result = validateCollection(trailsModule, [trail()])
    expect(result.status).toBe('error')
    expect(result.status === 'error' && result.error.kind).toBe('invalid')
  })

  it('reports an invalid feature with its index', () => {
    const bad = { ...feature(trail()), properties: { ...feature(trail()).properties, type: 'ski' } }
    const result = validateCollection(trailsModule, collection(feature(trail({ id: 'a' })), bad))
    expect(
      result.status === 'error' && result.error.kind === 'invalid' && result.error.issues,
    ).toEqual([expect.objectContaining({ path: '1.type' })])
  })
})

describe('trail layers', () => {
  const walk = trail({ id: 'walk', type: 'walk' })
  const bike = trail({ id: 'bike', type: 'bike' })
  const both = trail({ id: 'both', type: 'both' })
  const all = [walk, bike, both]

  it('puts walk and both trails in the walking layer', () => {
    expect(trailsInLayer(all, 'walking').map((t) => t.id)).toEqual(['walk', 'both'])
  })

  it('puts bike and both trails in the biking layer', () => {
    expect(trailsInLayer(all, 'biking').map((t) => t.id)).toEqual(['bike', 'both'])
  })

  it('lists the layers of each trail', () => {
    expect(layersOfTrail(walk)).toEqual(['walking'])
    expect(layersOfTrail(bike)).toEqual(['biking'])
    expect(layersOfTrail(both)).toEqual(['walking', 'biking'])
    expect(isInTrailLayer(both, 'biking')).toBe(true)
    expect(isInTrailLayer(walk, 'biking')).toBe(false)
  })
})

describe('trail geometry helpers', () => {
  it('converts GeoJSON [lng, lat] lines to [lat, lng]', () => {
    expect(trailLines(trail())).toEqual([
      [
        [45.3, -73.25],
        [45.31, -73.24],
      ],
    ])
  })

  it('computes the extent and the drawn length', () => {
    expect(trailExtent(trail())).toEqual([
      [45.3, -73.25],
      [45.31, -73.24],
    ])
    expect(geometryLengthKm(trail())).toBeCloseTo(1.36, 1)
  })
})

describe('shipped trails', () => {
  const trails = shippedRecords(trailsModule)

  it('has 2 or 3 trails, including the Chambly Canal path on La Route verte', () => {
    expect(trails.length).toBeGreaterThanOrEqual(2)
    expect(trails.length).toBeLessThanOrEqual(3)
    const canal = trails.find((t) => t.id === 'piste-du-canal-de-chambly')
    expect(canal?.network).toBe('route-verte')
    expect(canal?.type).toBe('both')
  })

  it('fills both layers', () => {
    expect(trailsInLayer(trails, 'walking').length).toBeGreaterThan(0)
    expect(trailsInLayer(trails, 'biking').length).toBeGreaterThan(0)
  })

  it('states lengths within 10% of the drawn path', () => {
    for (const t of trails) {
      expect(Math.abs(geometryLengthKm(t) - t.lengthKm) / t.lengthKm, t.id).toBeLessThan(0.1)
    }
  })

  it('is all sample data', () => {
    expect(trails.every((t) => t.sample === true)).toBe(true)
  })
})
