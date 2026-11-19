import { boundsOf, distanceKm, pathLengthKm } from '@/core/services/geo'

describe('distanceKm', () => {
  it('is zero for the same point', () => {
    expect(distanceKm([45.3, -73.26], [45.3, -73.26])).toBe(0)
  })

  it('measures one degree of latitude as about 111.2 km', () => {
    expect(distanceKm([45, -73], [46, -73])).toBeCloseTo(111.19, 1)
  })

  it('measures Saint-Jean to Chambly as about 16 km', () => {
    expect(distanceKm([45.3073, -73.2625], [45.4475, -73.286])).toBeCloseTo(15.7, 0)
  })

  it('is symmetric', () => {
    const a = [45.31, -73.25] as const
    const b = [45.29, -73.24] as const
    expect(distanceKm(a, b)).toBeCloseTo(distanceKm(b, a), 10)
  })
})

describe('pathLengthKm', () => {
  it('sums the segments of a polyline', () => {
    const points = [
      [45, -73],
      [45.5, -73],
      [46, -73],
    ] as const
    expect(pathLengthKm(points)).toBeCloseTo(111.19, 1)
  })

  it('is zero for fewer than two points', () => {
    expect(pathLengthKm([])).toBe(0)
    expect(pathLengthKm([[45, -73]])).toBe(0)
  })
})

describe('boundsOf', () => {
  it('returns the south-west and north-east corners', () => {
    expect(
      boundsOf([
        [45.31, -73.25],
        [45.29, -73.27],
        [45.3, -73.24],
      ]),
    ).toEqual([
      [45.29, -73.27],
      [45.31, -73.24],
    ])
  })

  it('throws on an empty list', () => {
    expect(() => boundsOf([])).toThrow()
  })
})
