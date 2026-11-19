import { detectMapsProvider, directionsUrl } from '@/core/services/directions'

describe('detectMapsProvider', () => {
  it.each([
    ['Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15', 'apple'],
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', 'apple'],
    ['Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/131.0', 'google'],
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Edg/131.0', 'google'],
  ])('%s → %s', (userAgent, provider) => {
    expect(detectMapsProvider(userAgent)).toBe(provider)
  })
})

describe('directionsUrl', () => {
  it('builds a Google Maps directions link with only the destination', () => {
    expect(directionsUrl([45.3073, -73.2625], 'google')).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=45.3073%2C-73.2625',
    )
  })

  it('builds an Apple Maps directions link with only the destination', () => {
    expect(directionsUrl([45.3073, -73.2625], 'apple')).toBe(
      'https://maps.apple.com/?daddr=45.3073%2C-73.2625',
    )
  })

  it('rounds coordinates to 6 decimals', () => {
    expect(directionsUrl([45.30731234567, -73.2625], 'apple')).toBe(
      'https://maps.apple.com/?daddr=45.307312%2C-73.2625',
    )
  })
})
