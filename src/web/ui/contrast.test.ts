import { blend, contrastRatio, parseHex } from '@/web/ui/contrast'

const white = parseHex('#ffffff')
const black = parseHex('#000000')

describe('contrast helpers', () => {
  it('computes known WCAG ratios', () => {
    expect(contrastRatio(black, white)).toBeCloseTo(21, 5)
    expect(contrastRatio(white, white)).toBeCloseTo(1, 5)
    expect(contrastRatio(white, black)).toBeCloseTo(21, 5)
    // #767676 on white is the classic 4.54:1 AA threshold colour.
    expect(contrastRatio(parseHex('#767676'), white)).toBeCloseTo(4.54, 2)
  })

  it('parses 8-digit hex alpha and blends over a backdrop', () => {
    const halfBlack = parseHex('#00000080')
    expect(halfBlack.a).toBeCloseTo(0.5, 2)
    const mixed = blend(halfBlack, white)
    expect(mixed.r).toBeCloseTo(127, 0)
    expect(mixed.a).toBe(1)
  })

  it('rejects colours it cannot check', () => {
    expect(() => parseHex('rgb(0 0 0)')).toThrow()
    expect(() => parseHex('#fff')).toThrow()
  })
})
