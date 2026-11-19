/** An sRGB colour with 0–255 channels and a 0–1 alpha. */
export type Rgba = { r: number; g: number; b: number; a: number }

/** Parses `#rrggbb` or `#rrggbbaa`. Throws on anything else. */
export function parseHex(hex: string): Rgba {
  const match = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(hex.trim())
  if (!match) throw new Error(`Expected #rrggbb or #rrggbbaa, got "${hex}"`)
  const [rgb, alpha] = [match[1], match[2]]
  return {
    r: parseInt(rgb.slice(0, 2), 16),
    g: parseInt(rgb.slice(2, 4), 16),
    b: parseInt(rgb.slice(4, 6), 16),
    a: alpha === undefined ? 1 : parseInt(alpha, 16) / 255,
  }
}

/** Composites a (possibly translucent) colour over an opaque backdrop. */
export function blend(top: Rgba, backdrop: Rgba): Rgba {
  const mix = (t: number, b: number) => t * top.a + b * (1 - top.a)
  return { r: mix(top.r, backdrop.r), g: mix(top.g, backdrop.g), b: mix(top.b, backdrop.b), a: 1 }
}

/** WCAG 2.x relative luminance of an opaque colour. */
export function relativeLuminance({ r, g, b }: Rgba): number {
  const channel = (c: number) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** WCAG 2.x contrast ratio between two opaque colours (1–21). */
export function contrastRatio(a: Rgba, b: Rgba): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
