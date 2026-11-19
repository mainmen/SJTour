import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '@/web/ui/cx'
import { pressableClass } from '@/web/ui/pressable'
import { useRipple } from '@/web/ui/useRipple'

export type RippleButtonProps = ComponentPropsWithoutRef<'button'>

/** A `<button>` with ripple tap feedback (none under reduced motion) and a static pressed tint. */
export function RippleButton({
  className,
  children,
  onPointerDown,
  type = 'button',
  ...rest
}: RippleButtonProps) {
  const ripple = useRipple<HTMLButtonElement>()
  return (
    <button
      type={type}
      className={cx(pressableClass, className)}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        ripple.onPointerDown(event)
      }}
      {...rest}
    >
      {children}
      {ripple.ripples}
    </button>
  )
}
