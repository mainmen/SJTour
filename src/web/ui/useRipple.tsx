import { useCallback, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { prefersReducedMotion } from '@/web/ui/motion'

type Ripple = { id: number; x: number; y: number; size: number }

/**
 * Tap feedback: on pointer down, renders an expanding circle from the tap point.
 * The host must be `relative overflow-hidden` (see `pressableClass`).
 *
 * - Under `prefers-reduced-motion: reduce`, no ripple is created at all.
 * - Ripples are decorative: `aria-hidden` and `pointer-events-none`.
 * - Keyboard activation does not ripple; the focus ring is the feedback.
 */
export function useRipple<T extends HTMLElement>(): {
  onPointerDown: (event: PointerEvent<T>) => void
  ripples: ReactNode
} {
  const [items, setItems] = useState<Ripple[]>([])
  const nextId = useRef(0)

  const onPointerDown = useCallback((event: PointerEvent<T>) => {
    if (prefersReducedMotion()) return
    const rect = event.currentTarget.getBoundingClientRect()
    // Twice the longest side covers the host from any tap point.
    const size = Math.max(rect.width, rect.height) * 2
    const ripple: Ripple = {
      id: nextId.current++,
      x: event.clientX - rect.left - size / 2,
      y: event.clientY - rect.top - size / 2,
      size,
    }
    setItems((current) => [...current, ripple])
  }, [])

  const remove = useCallback((id: number) => {
    setItems((current) => current.filter((r) => r.id !== id))
  }, [])

  const ripples = items.map(({ id, x, y, size }) => (
    <span
      key={id}
      aria-hidden="true"
      data-ripple=""
      className="pointer-events-none absolute -z-10 rounded-full bg-current opacity-0 motion-safe:animate-ripple"
      style={{ left: x, top: y, width: size, height: size }}
      onAnimationEnd={() => remove(id)}
    />
  ))

  return { onPointerDown, ripples }
}
