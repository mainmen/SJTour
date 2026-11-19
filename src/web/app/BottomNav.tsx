import { InfoIcon, ListIcon, MapIcon, type LucideIcon } from 'lucide-react'
import { strings } from '@/web/app/strings'

type NavItem = { to: string; label: string; Icon: LucideIcon }

const navItems: readonly NavItem[] = [
  { to: '/', label: strings.nav.map, Icon: MapIcon },
  { to: '/list', label: strings.nav.list, Icon: ListIcon },
  { to: '/about', label: strings.nav.about, Icon: InfoIcon },
]

export function BottomNav() {
  return (
    <nav
      aria-label={strings.nav.label}
      className="shrink-0 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md">
        {navItems.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <a
              href={to}
              className="flex min-h-14 min-w-11 flex-col items-center justify-center gap-0.5 px-2 py-1.5 text-xs text-slate-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-700"
            >
              <Icon aria-hidden="true" className="size-6" strokeWidth={2} />
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
