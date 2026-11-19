import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '@/web/ui/cx'
import { pressableClass } from '@/web/ui/pressable'

export type TabItem = { readonly id: string; readonly label: ReactNode; readonly panel: ReactNode }

type TabsProps = {
  /** Accessible name of the tab list. */
  readonly label: string
  readonly tabs: readonly TabItem[]
}

/**
 * Accessible tabs (WAI-ARIA tabs pattern, automatic activation): one tab stop,
 * arrow keys move between tabs (wrapping), Home/End jump to the ends. The
 * selected tab is marked by colour, weight and an underline, not colour alone.
 */
export function Tabs({ label, tabs }: TabsProps) {
  const baseId = useId()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number) => {
    setSelectedIndex(index)
    tabRefs.current[index]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const last = tabs.length - 1
    const next = {
      ArrowRight: selectedIndex === last ? 0 : selectedIndex + 1,
      ArrowLeft: selectedIndex === 0 ? last : selectedIndex - 1,
      Home: 0,
      End: last,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next)
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex border-b border-glass-border"
      >
        {tabs.map((tab, index) => {
          const selected = index === selectedIndex
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              className={cx(
                pressableClass,
                'min-h-11 flex-1 px-3 text-sm',
                selected
                  ? 'font-semibold text-accent after:absolute after:inset-x-3 after:bottom-0 after:h-1 after:rounded-t after:bg-accent'
                  : 'text-ink-muted',
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={index !== selectedIndex}
          tabIndex={0}
          className="pt-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  )
}
