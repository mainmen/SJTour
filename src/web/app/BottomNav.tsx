import { InfoIcon, ListIcon, MapIcon, type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router'
import { strings } from '@/web/app/strings'

type NavItem = { to: string; label: string; Icon: LucideIcon }

const navItems: readonly NavItem[] = [
  { to: '/', label: strings.nav.map, Icon: MapIcon },
  { to: '/list', label: strings.nav.list, Icon: ListIcon },
  { to: '/about', label: strings.nav.about, Icon: InfoIcon },
]

const baseLink =
  'relative flex min-h-14 min-w-11 flex-col items-center justify-center gap-0.5 px-2 py-1.5 text-xs focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-700'
// Active state: color + bold label + top indicator bar, so it never relies on color alone.
const activeLink =
  'font-semibold text-sky-800 before:absolute before:inset-x-4 before:top-0 before:h-1 before:rounded-b before:bg-sky-800'
const inactiveLink = 'text-slate-600'

export function BottomNav() {
  return (
    <nav
      aria-label={strings.nav.label}
      className="shrink-0 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md">
        {navItems.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
            >
              {({ isActive }) => (
                <>
                  <Icon aria-hidden="true" className="size-6" strokeWidth={isActive ? 2.5 : 2} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
