# StJeanTour — Mission

## Purpose

StJeanTour helps people discover Saint-Jean-sur-Richelieu, Quebec. It brings local companies, recreational activities, events and walking/biking trails together on one fast, mobile-first map.

## Audience

| Audience | What they need |
|---|---|
| **Residents** | Find what's happening this weekend, discover local businesses, find a new trail close to home. |
| **Tourists / visitors** | Get oriented quickly, see what's worth doing nearby, and get there. |

Both audiences are served equally. Neither one is treated as secondary.

## Language

- **Bilingual from day one: French (default) and English.**
- French is the primary language, in line with Quebec's language requirements (Charte de la langue française / Bill 96). English is a full translation, not an afterthought.
- Every user-facing string and every content record carries both `fr` and `en` values.

## Core principles

1. **Mobile-first.** We design for a phone in one hand on a sidewalk or a bike path, then scale up to desktop.
2. **Map-centric, list-friendly.** The map is the home screen. Every map item can also be reached in an accessible list view.
3. **Local and accurate.** Content is curated for Saint-Jean-sur-Richelieu, and accuracy matters more than volume. Every record shows a "last verified" date.
4. **Fast and light.** Pages load quickly on mid-range phones and spotty cellular data.
5. **Accessible.** We target WCAG 2.1 AA, with keyboard and screen-reader support and nothing conveyed by color alone.
6. **Modular.** Each content category (companies, activities, events, trails) is a self-contained module that can be added, changed or removed independently.
7. **Privacy-respecting.** No accounts are required. Geolocation is opt-in and never leaves the device. No third-party tracking.
8. **Free and open mapping.** We use OpenStreetMap data and tiles and attribute them properly.

## Content categories

- **Companies:** local businesses (restaurants, shops, services).
- **Activities:** recreational places and things to do (parks, museums, water sports, etc.).
- **Events:** dated happenings, such as festivals (e.g. the International Balloon Festival), markets and concerts.
- **Trails:** walking and biking routes shown as lines on the map (e.g. along the Richelieu River / Chambly Canal).

## Non-goals (for now)

- User accounts, reviews or user-generated content
- Booking, ticketing or payments
- Turn-by-turn navigation (we hand off to the device's maps app)
- Native iOS/Android apps (the PWA covers this need)
- Coverage outside Saint-Jean-sur-Richelieu

## Success looks like

- A visitor opens the app and finds something to do nearby within 30 seconds.
- A resident finds this weekend's events without searching multiple sites.
- A first visit loads in under 3 seconds on a 4G mobile connection.
