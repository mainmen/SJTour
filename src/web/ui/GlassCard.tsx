import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { cx } from '@/web/ui/cx'

/** Tags a glass panel may render as. Landmarks stay semantic (e.g. the shell's header and nav). */
export type GlassTag = 'div' | 'section' | 'article' | 'header' | 'nav' | 'aside'

export type GlassCardProps<T extends GlassTag = 'div'> = { as?: T } & ComponentPropsWithoutRef<T>

/**
 * A glass panel: translucent and blurred where supported, with a solid fallback
 * (see the `glass` utility in src/index.css). It sets the border colour only;
 * callers choose border widths, radius and padding.
 */
export function GlassCard<T extends GlassTag = 'div'>({
  as,
  className,
  ...rest
}: GlassCardProps<T>) {
  const Tag: ElementType = as ?? 'div'
  return <Tag className={cx('glass border-glass-border', className)} {...rest} />
}
