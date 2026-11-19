import { LANGUAGE_STORAGE_KEY, loadLanguage, saveLanguage } from '@/web/adapters/languageStorage'

function throwingStorage(): Storage {
  const fail = () => {
    throw new DOMException('blocked', 'SecurityError')
  }
  return {
    length: 0,
    clear: fail,
    getItem: fail,
    key: fail,
    removeItem: fail,
    setItem: fail,
  }
}

describe('languageStorage', () => {
  it('returns null when nothing is saved', () => {
    expect(loadLanguage()).toBeNull()
  })

  it('round-trips a saved language', () => {
    saveLanguage('en')
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
    expect(loadLanguage()).toBe('en')
    saveLanguage('fr')
    expect(loadLanguage()).toBe('fr')
  })

  it('ignores an invalid saved value', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'de')
    expect(loadLanguage()).toBeNull()
  })

  it('does not throw when storage is unavailable', () => {
    vi.stubGlobal('localStorage', throwingStorage())
    expect(loadLanguage()).toBeNull()
    expect(() => saveLanguage('en')).not.toThrow()
  })
})
