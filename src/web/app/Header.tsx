import { strings } from '@/web/app/strings'

export function Header() {
  return (
    <header className="shrink-0 border-b border-slate-200 bg-white px-4 pt-[env(safe-area-inset-top)]">
      <h1 className="py-3 text-xl font-bold tracking-tight text-sky-800">{strings.appName}</h1>
    </header>
  )
}
