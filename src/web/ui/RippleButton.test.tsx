import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { stubReducedMotion } from '@/test/matchMedia'
import { RippleButton } from '@/web/ui/RippleButton'

const ripples = (el: HTMLElement) => el.querySelectorAll('[data-ripple]')

describe('RippleButton', () => {
  it('defaults to type="button" and allows overriding it', () => {
    const { rerender } = render(<RippleButton>OK</RippleButton>)
    expect(screen.getByRole('button', { name: 'OK' })).toHaveAttribute('type', 'button')
    rerender(<RippleButton type="submit">OK</RippleButton>)
    expect(screen.getByRole('button', { name: 'OK' })).toHaveAttribute('type', 'submit')
  })

  it("calls the caller's onPointerDown and onClick", async () => {
    stubReducedMotion(false)
    const onPointerDown = vi.fn()
    const onClick = vi.fn()
    render(
      <RippleButton onPointerDown={onPointerDown} onClick={onClick}>
        OK
      </RippleButton>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onPointerDown).toHaveBeenCalledOnce()
    expect(onClick).toHaveBeenCalledOnce()
  })

  describe('with motion allowed', () => {
    beforeEach(() => stubReducedMotion(false))

    it('adds one ripple on pointer down and removes it when the animation ends', () => {
      render(<RippleButton>OK</RippleButton>)
      const button = screen.getByRole('button')

      fireEvent.pointerDown(button, { clientX: 10, clientY: 10 })
      const [ripple] = ripples(button)
      expect(ripples(button)).toHaveLength(1)

      fireEvent.animationEnd(ripple)
      expect(ripples(button)).toHaveLength(0)
    })

    it('hides ripples from assistive technology and keeps the accessible name', () => {
      render(<RippleButton>OK</RippleButton>)
      const button = screen.getByRole('button')
      fireEvent.pointerDown(button)
      expect(ripples(button)[0]).toHaveAttribute('aria-hidden', 'true')
      expect(ripples(button)[0]).toHaveClass('pointer-events-none')
      expect(button).toHaveAccessibleName('OK')
    })
  })

  describe('with prefers-reduced-motion: reduce', () => {
    beforeEach(() => stubReducedMotion(true))

    it('creates no ripple on pointer down', () => {
      render(<RippleButton>OK</RippleButton>)
      const button = screen.getByRole('button')
      fireEvent.pointerDown(button, { clientX: 10, clientY: 10 })
      fireEvent.pointerDown(button)
      expect(ripples(button)).toHaveLength(0)
    })

    it('still activates on click', async () => {
      const onClick = vi.fn()
      render(<RippleButton onClick={onClick}>OK</RippleButton>)
      await userEvent.click(screen.getByRole('button'))
      expect(onClick).toHaveBeenCalledOnce()
    })
  })

  it('does not ripple on keyboard activation', async () => {
    stubReducedMotion(false)
    const onClick = vi.fn()
    render(<RippleButton onClick={onClick}>OK</RippleButton>)
    const button = screen.getByRole('button')
    button.focus()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledOnce()
    expect(ripples(button)).toHaveLength(0)
  })
})
