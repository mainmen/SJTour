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
3. **Local and accurate.** Content is curated for Saint-Jean-sur-Richelieu, and accuracy matters more than volume. Every record shows a "last verified" date. Sample data may be used during development, but it is always flagged as sample and never shown in production.
4. **Fast and light.** Pages load quickly on mid-range phones and spotty cellular data.
5. **Accessible.** We target WCAG 2.1 AA, with keyboard and screen-reader support and nothing conveyed by color alone.
6. **Modular.** Each content category (companies, activities, events, trails) is a self-contained module that can be added, changed or removed independently.
7. **Privacy-respecting.** No accounts are required. Geolocation is opt-in. The user's location leaves the device only when they explicitly use it as a route start point, and only to our routing service. No third-party tracking.
8. **Free and open mapping.** We use OpenStreetMap data and tiles and attribute them properly.
9. **Spec-driven.** For each feature, we define the TypeScript types and write unit tests for the data services before building the UI.
10. **Portable core.** Business logic, state and data access live in a platform-agnostic core with no browser or UI code. The core could later be reused in a native app (React Native/Expo or Capacitor) without a rewrite.
11. **Tactile, but never at the cost of access.** The interface feels polished, with glass panels and subtle touch feedback such as ripples. Animations respect the user's reduced-motion setting, and text on glass keeps AA contrast.

## Content categories

- **Companies:** local businesses (restaurants, shops, services) and industrial or tech parks (e.g. Parc industriel Iberville, downtown Vieux-Saint-Jean), tagged by sector. A **business network** view draws connection lines between partner companies, supply chains and industry clusters, filterable by sector. It only shows publicly documented relationships, each with a source and a "last verified" date.
- **Activities ("Things to do"):** recreational places, grouped into Parks, Culture/Museums (e.g. Musée du Haut-Richelieu), Dining and Outdoor Recreation.
- **Events:** dated happenings, such as festivals (e.g. L'International de montgolfières / the International Balloon Festival), markets and concerts. Shown as **Upcoming** and **Recent**, each with a "Show on map" action.
- **Trails:** shown as two separate layers, **walking paths** and **biking paths**. They include named networks such as La Route verte and the Chambly Canal path, plus pedestrian zones.

## Getting around

Users can pick any two places on the map (e.g. a company and a café) and see a **walking or biking route** with its distance and estimated travel time. Live, step-by-step guidance is still handed off to the device's maps app.

## Non-goals (for now)

- User accounts, reviews or user-generated content
- Booking, ticketing or payments
- Live turn-by-turn or voice navigation (route previews are in scope, and live guidance is handed off to the device's maps app)
- Native iOS/Android apps for now. The PWA covers this need. Because the core is portable (principle 10), a React Native or Capacitor app remains a possible later step.
- Coverage outside Saint-Jean-sur-Richelieu

## Success looks like

- A visitor opens the app and finds something to do nearby within 30 seconds.
- A resident finds this weekend's events without searching multiple sites.
- A first visit loads in under 3 seconds on a 4G mobile connection.
