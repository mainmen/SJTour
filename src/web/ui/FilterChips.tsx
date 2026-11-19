import { CheckIcon, type LucideIcon } from 'lucide-react'
import { cx } from '@/web/ui/cx'
import { RippleButton } from '@/web/ui/RippleButton'

export type FilterChip = {
  readonly id: string
  readonly label: string
  readonly Icon: LucideIcon
  readonly pressed: boolean
}

type FilterChipsProps = {
  /** Accessible name of the group. */
  readonly label: string
  readonly chips: readonly FilterChip[]
  readonly onToggle: (id: string) => void
  readonly className?: string
}

/**
 * A row of toggle buttons (`aria-pressed`) on glass. On: filled accent with a
 * check mark; off: outlined with the plain icon, so the state never relies on
 * colour alone. The row scrolls sideways on narrow screens.
 */
export function FilterChips({ label, chips, onToggle, className }: FilterChipsProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cx('flex gap-2 overflow-x-auto p-0.5 [scrollbar-width:none]', className)}
    >
      {chips.map(({ id, label: chipLabel, Icon, pressed }) => (
        <RippleButton
          key={id}
          aria-pressed={pressed}
          onClick={() => onToggle(id)}
          className={cx(
            'flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-medium whitespace-nowrap shadow-sm',
            pressed ? 'border-accent bg-accent text-white' : 'glass border-glass-border text-ink',
          )}
        >
          {pressed ? (
            <CheckIcon aria-hidden="true" className="size-4" strokeWidth={2.5} />
          ) : (
            <Icon aria-hidden="true" className="size-4 text-ink-muted" />
          )}
          {chipLabel}
        </RippleButton>
      ))}
    </div>
  )
}
