import type { ReactNode } from 'react'

/** Temporary page body until each route gets its real content. */
export function PlaceholderPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-md p-4">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-2 text-slate-700">{children}</div>
    </section>
  )
}
