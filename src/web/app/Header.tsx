import { strings } from '@/web/app/strings'
import { GlassCard } from '@/web/ui/GlassCard'

export function Header() {
  return (
    <GlassCard
      as="header"
      className="relative z-10 shrink-0 border-b px-4 pt-[env(safe-area-inset-top)]"
    >
      <h1 className="py-3 text-xl font-bold tracking-tight text-accent">{strings.appName}</h1>
    </GlassCard>
  )
}
