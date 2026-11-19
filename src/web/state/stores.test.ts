import { act } from '@testing-library/react'
import { i18n } from '@/web/i18n'
import { languageStore } from '@/web/state/stores'

describe('language store sync', () => {
  it('follows the i18next language', async () => {
    expect(languageStore.getState().language).toBe('fr')
    await act(() => i18n.changeLanguage('en'))
    expect(languageStore.getState().language).toBe('en')
    await act(() => i18n.changeLanguage('fr'))
    expect(languageStore.getState().language).toBe('fr')
  })
})
