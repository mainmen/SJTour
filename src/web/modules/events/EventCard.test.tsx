import { act, render, screen } from '@testing-library/react'
import type { EventRecord } from '@/core/modules/events/schema'
import { i18n } from '@/web/i18n'
import { EventCard } from '@/web/modules/events/EventCard'

const concert: EventRecord = {
  id: 'concert',
  category: 'events',
  name: { fr: 'Concert', en: 'Concert' },
  description: { fr: 'Un concert.', en: 'A concert.' },
  coordinates: [45.3091, -73.2621],
  lastVerified: '2026-11-19',
  startDate: '2026-12-05T19:30:00-05:00',
  endDate: '2026-12-05T22:00:00-05:00',
}

/** Matches text ignoring the kind of spaces Intl uses. */
const spaced = (text: string) => (content: string) => content.replace(/\s/g, ' ') === text

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('EventCard', () => {
  it('shows the status and the dates in French', () => {
    vi.setSystemTime(new Date('2026-11-19T12:00:00-05:00'))
    render(<EventCard record={concert} />)
    expect(screen.getByText('À venir')).toBeInTheDocument()
    expect(screen.getByText(spaced('sam. 5 décembre 2026, 19 h 30 – 22 h 00'))).toBeInTheDocument()
    expect(screen.getByText('Un concert.')).toBeInTheDocument()
  })

  it('shows the status and the dates in English', async () => {
    vi.setSystemTime(new Date('2026-11-19T12:00:00-05:00'))
    render(<EventCard record={concert} />)
    await act(() => i18n.changeLanguage('en'))
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
    expect(screen.getByText(spaced('Sat, December 5, 2026, 7:30–10:00 p.m.'))).toBeInTheDocument()
  })

  it('marks an event that ended recently', () => {
    vi.setSystemTime(new Date('2026-12-10T12:00:00-05:00'))
    render(<EventCard record={concert} />)
    expect(screen.getByText('Terminé récemment')).toBeInTheDocument()
  })
})
