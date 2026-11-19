import { InfoIcon, ListIcon, MapIcon, type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router'
import { strings } from '@/web/app/strings'
import { cx } from '@/web/ui/cx'
import { GlassCard } from '@/web/ui/GlassCard'
import { pressableClass } from '@/web/ui/pressable'
import { useRipple } from '@/web/ui/useRipple'

type NavItemProps = { to: string; label: string; Icon: LucideIcon }

const navItems: readonly NavItemProps[] = [
  { to: '/', label: strings.nav.map, Icon: MapIcon },
  { to: '/list', label: strings.nav.list, Icon: ListIcon },
  { to: '/about', label: strings.nav.about, Icon: InfoIcon },
]

const baseLink =
  'flex min-h-14 min-w-11 flex-col items-center justify-center gap-0.5 px-2 py-1.5 text-xs focus-visible:-outline-offset-2'
// Active state: color + bold label + top indicator bar, so it never relies on color alone.
const activeLink =
  'font-semibold text-accent before:absolute before:inset-x-4 before:top-0 before:h-1 before:rounded-b before:bg-accent'
const inactiveLink = 'text-ink-muted'

function NavItem({ to, label, Icon }: NavItemProps) {
  const ripple = useRipple<HTMLAnchorElement>()
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onPointerDown={ripple.onPointerDown}
      className={({ isActive }) =>
        cx(pressableClass, baseLink, isActive ? activeLink : inactiveLink)
      }
    >
      {({ isActive }) => (
        <>
          <Icon aria-hidden="true" className="size-6" strokeWidth={isActive ? 2.5 : 2} />
          <span>{label}</span>
          {ripple.ripples}
        </>
      )}
    </NavLink>
  )
}

export function BottomNav() {
  return (
    <GlassCard
      as="nav"
      aria-label={strings.nav.label}
      className="relative z-10 shrink-0 border-t pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md">
        {navItems.map((item) => (
          <li key={item.to} className="flex-1">
            <NavItem {...item} />
          </li>
        ))}
      </ul>
    </GlassCard>
  )
}
