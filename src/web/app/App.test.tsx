import { render, screen } from '@testing-library/react'
import App from '@/web/app/App'

describe('App', () => {
  it('renders the StJeanTour heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'StJeanTour' })).toBeInTheDocument()
  })
})
