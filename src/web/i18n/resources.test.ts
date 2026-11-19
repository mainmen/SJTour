import en from '@/web/i18n/en.json'
import fr from '@/web/i18n/fr.json'

/** Flattens nested translations to `{ 'nav.map': 'Carte', … }`. */
function flatten(tree: object, prefix = ''): Record<string, unknown> {
  return Object.entries(tree).reduce<Record<string, unknown>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (value !== null && typeof value === 'object') Object.assign(acc, flatten(value, path))
    else acc[path] = value
    return acc
  }, {})
}

const flatFr = flatten(fr)
const flatEn = flatten(en)

describe('translation resources', () => {
  it('fr and en have exactly the same keys', () => {
    expect(Object.keys(flatEn).sort()).toEqual(Object.keys(flatFr).sort())
  })

  it.each([
    ['fr', flatFr],
    ['en', flatEn],
  ])('every %s value is a non-empty string', (_lang, flat) => {
    for (const [key, value] of Object.entries(flat)) {
      expect(typeof value, key).toBe('string')
      expect((value as string).trim(), key).not.toBe('')
    }
  })
})
