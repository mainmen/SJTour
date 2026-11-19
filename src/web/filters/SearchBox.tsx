import { SearchIcon, XIcon } from 'lucide-react'
import { useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { MAX_QUERY_LENGTH } from '@/core/filters/url'
import { filterStore, useAppStore } from '@/web/state/stores'
import { cx } from '@/web/ui/cx'
import { RippleButton } from '@/web/ui/RippleButton'

/**
 * Text search over names and descriptions in both languages
 * (specs/2026-11-19-search), bound to the shared filter store (map and list).
 * Escape or the Clear button empties it and keeps focus in the box; Enter
 * only closes the on-screen keyboard, since results update as you type.
 */
export function SearchBox({ className }: { className?: string }) {
  const { t } = useTranslation()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const query = useAppStore(filterStore, (state) => state.query)

  const clear = () => {
    filterStore.getState().clearQuery()
    inputRef.current?.focus()
  }

  return (
    <form
      role="search"
      aria-label={t('search.label')}
      className={cx(
        'glass flex min-h-11 items-center gap-2 rounded-full border border-glass-border pl-3 shadow-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus',
        className,
      )}
      onSubmit={(event) => {
        event.preventDefault()
        inputRef.current?.blur()
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        {t('search.input')}
      </label>
      <SearchIcon aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        maxLength={MAX_QUERY_LENGTH}
        placeholder={t('search.placeholder')}
        value={query}
        onChange={(event) => filterStore.getState().setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && query !== '') {
            event.preventDefault()
            clear()
          }
        }}
        // The box draws the focus ring; the native clear button is replaced by ours.
        className="min-w-0 flex-1 bg-transparent py-2 text-base text-ink outline-none placeholder:text-ink-muted [&::-webkit-search-cancel-button]:appearance-none"
      />
      {query !== '' && (
        <RippleButton
          aria-label={t('search.clear')}
          onClick={clear}
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-ink-muted"
        >
          <XIcon aria-hidden="true" className="size-4" />
        </RippleButton>
      )}
    </form>
  )
}
