// @vitest-environment node
// Reads src/index.css from disk: Vitest stubs CSS imports, so `?raw` returns nothing.
import { readFileSync } from 'node:fs'
import { blend, contrastRatio, parseHex, type Rgba } from './contrast.ts'

const css = readFileSync(new URL('../../index.css', import.meta.url), 'utf8')

/** Reads a `--color-<name>` token from the @theme block in src/index.css. */
function token(name: string): Rgba {
  const match = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]+);`).exec(css)
  if (!match) throw new Error(`Token --color-${name} not found in src/index.css`)
  return parseHex(match[1])
}

const AA_TEXT = 4.5
const AA_NON_TEXT = 3
const white = parseHex('#ffffff')
const black = parseHex('#000000')

describe('design tokens meet WCAG AA', () => {
  const glass = token('glass')

  // Glass is checked against the worst cases: pure white or pure black content behind it.
  const surfaces: Record<string, Rgba> = {
    'solid surface': token('surface'),
    'glass over white': blend(glass, white),
    'glass over black': blend(glass, black),
  }

  it('the glass token is translucent and the surface token is opaque', () => {
    expect(glass.a).toBeLessThan(1)
    expect(token('surface').a).toBe(1)
  })

  for (const [surfaceName, bg] of Object.entries(surfaces)) {
    for (const text of ['ink', 'ink-muted', 'accent']) {
      it(`${text} text on ${surfaceName} is at least ${AA_TEXT}:1`, () => {
        expect(contrastRatio(token(text), bg)).toBeGreaterThanOrEqual(AA_TEXT)
      })
    }

    it(`focus ring on ${surfaceName} is at least ${AA_NON_TEXT}:1`, () => {
      expect(contrastRatio(token('focus'), bg)).toBeGreaterThanOrEqual(AA_NON_TEXT)
    })
  }
})
