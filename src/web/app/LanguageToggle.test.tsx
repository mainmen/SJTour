import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LANGUAGE_STORAGE_KEY } from '@/web/adapters/languageStorage'
import { renderRoute } from '@/web/app/renderRoute'
import { i18n } from '@/web/i18n'

function toggle() {
  return within(screen.getByRole('banner')).getByRole('button')
}

function navLinkNames() {
  return within(screen.getByRole('navigation'))
    .getAllByRole('link')
    .map((link) => link.textContent)
}

describe('LanguageToggle', () => {
  it('offers English, labelled in English, while the app is in French', () => {
    renderRoute('/')
    expect(document.documentElement.lang).toBe('fr')
    expect(toggle()).toHaveTextContent('EN')
    expect(toggle()).toHaveAccessibleName('Switch to English')
    expect(toggle()).toHaveAttribute('lang', 'en')
    expect(toggle()).toHaveAttribute('type', 'button')
  })

  it('switches the shell to English, updates <html lang> and saves the choice', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    expect(navLinkNames()).toEqual(['Carte', 'Liste', 'À propos'])
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBeNull()

    await user.click(toggle())

    expect(navLinkNames()).toEqual(['Map', 'List', 'About'])
    expect(screen.getByRole('navigation')).toHaveAccessibleName('Main navigation')
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
    expect(toggle()).toHaveTextContent('FR')
    expect(toggle()).toHaveAccessibleName('Passer au français')
    expect(toggle()).toHaveAttribute('lang', 'fr')
  })

  it('switches back to French on a second click', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await user.click(toggle())
    await user.click(toggle())
    expect(navLinkNames()).toEqual(['Carte', 'Liste', 'À propos'])
    expect(document.documentElement.lang).toBe('fr')
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('fr')
    expect(i18n.resolvedLanguage).toBe('fr')
  })

  it('is reachable by keyboard', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await user.tab()
    expect(toggle()).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(document.documentElement.lang).toBe('en')
  })
})
