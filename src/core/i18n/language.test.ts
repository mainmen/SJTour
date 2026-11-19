import { DEFAULT_LANGUAGE, isLanguage, resolveInitialLanguage } from '@/core/i18n/language'

describe('isLanguage', () => {
  it.each(['fr', 'en'])('accepts %s', (value) => expect(isLanguage(value)).toBe(true))
  it.each(['de', 'FR', 'fr-CA', '', null, undefined, 42])('rejects %s', (value) =>
    expect(isLanguage(value)).toBe(false),
  )
})

describe('resolveInitialLanguage', () => {
  it('defaults to French', () => {
    expect(DEFAULT_LANGUAGE).toBe('fr')
  })

  it('prefers a valid saved choice over the browser languages', () => {
    expect(resolveInitialLanguage('en', ['fr-CA'])).toBe('en')
    expect(resolveInitialLanguage('fr', ['en-US'])).toBe('fr')
  })

  it('ignores an invalid saved value', () => {
    expect(resolveInitialLanguage('klingon', ['en-US'])).toBe('en')
    expect(resolveInitialLanguage(null, ['fr-CA'])).toBe('fr')
  })

  it.each([
    [['en-CA'], 'en'],
    [['fr-CA'], 'fr'],
    [['de', 'en-US'], 'en'],
    [['de-DE', 'es'], 'fr'],
    [[], 'fr'],
    [['EN-gb'], 'en'],
    [['en_US'], 'en'],
  ] as const)('maps browser languages %j to %s', (languages, expected) => {
    expect(resolveInitialLanguage(null, languages)).toBe(expected)
  })
})
