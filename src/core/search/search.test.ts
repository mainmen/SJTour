import { LAYER_IDS } from '@/core/filters/layers'
import { isRecordShown, visibleRecords } from '@/core/filters/selectors'
import {
  MAX_QUERY_LENGTH,
  parseSearchParam,
  SEARCH_PARAM,
  serializeSearch,
} from '@/core/filters/url'
import { activitiesModule } from '@/core/modules/activities/module'
import { eventsModule } from '@/core/modules/events/module'
import { trailsModule } from '@/core/modules/trails/module'
import {
  matchesSearch,
  normalizeSearchText,
  searchRecords,
  searchTokens,
  type Searchable,
} from '@/core/search/text'
import { createFilterStore } from '@/core/store/filters'
import { shippedRecords } from '@/core/test/records'

function record(nameFr: string, nameEn = nameFr, descFr = '', descEn = ''): Searchable {
  return { name: { fr: nameFr, en: nameEn }, description: { fr: descFr, en: descEn } }
}

const ids = (records: readonly { id: string }[]) => records.map((r) => r.id)

describe('normalizeSearchText', () => {
  it('ignores case and accents', () => {
    expect(normalizeSearchText('Musée ÉVÉNEMENT Çà')).toBe('musee evenement ca')
  })

  it('spells out ligatures', () => {
    expect(normalizeSearchText('Cœur ŒUVRE Æther')).toBe('coeur oeuvre aether')
  })

  it('turns punctuation, hyphens and apostrophes into single spaces', () => {
    expect(normalizeSearchText("  Saint-Jean,  d'Iberville (Route verte)! ")).toBe(
      'saint jean d iberville route verte',
    )
    expect(normalizeSearchText('L’International')).toBe('l international')
  })

  it('splits a query into words', () => {
    expect(searchTokens('  Vieux-Saint-Jean musée ')).toEqual(['vieux', 'saint', 'jean', 'musee'])
    expect(searchTokens('  ')).toEqual([])
    expect(searchTokens('—')).toEqual([])
  })
})

describe('matchesSearch', () => {
  const museum = record(
    'Musée du Haut-Richelieu',
    'Musée du Haut-Richelieu',
    "Musée régional consacré à l'histoire",
    'Regional museum devoted to history',
  )

  it('matches everything when the query is blank', () => {
    expect(matchesSearch(museum, '')).toBe(true)
    expect(matchesSearch(museum, '   ')).toBe(true)
  })

  it('finds words of the name or description in either language', () => {
    expect(matchesSearch(museum, 'richelieu')).toBe(true)
    expect(matchesSearch(museum, 'histoire')).toBe(true)
    expect(matchesSearch(museum, 'museum')).toBe(true)
    expect(matchesSearch(museum, 'kayak')).toBe(false)
  })

  it('ignores case, accents and punctuation in the query', () => {
    expect(matchesSearch(museum, 'MUSEE')).toBe(true)
    expect(matchesSearch(museum, 'haut richelieu')).toBe(true)
    expect(matchesSearch(museum, 'régional')).toBe(true)
    expect(matchesSearch(museum, "l'histoire")).toBe(true)
  })

  it('matches the start of words only', () => {
    expect(matchesSearch(museum, 'mus')).toBe(true)
    expect(matchesSearch(museum, 'hist')).toBe(true)
    expect(matchesSearch(museum, 'istoire')).toBe(false)
    expect(matchesSearch(record('Départ'), 'art')).toBe(false)
  })

  it('needs every word, in any order and any field', () => {
    expect(matchesSearch(museum, 'museum richelieu')).toBe(true)
    expect(matchesSearch(museum, 'museum kayak')).toBe(false)
  })

  it('is not fooled by text that only spans two fields', () => {
    // "Haut-Richelieu" ends the French name; "Musée" starts the English one.
    expect(matchesSearch(museum, 'richelieumusee')).toBe(false)
  })
})

describe('searching shipped records', () => {
  it('finds the balloon festival in French or English, with or without accents', () => {
    const events = shippedRecords(eventsModule)
    for (const query of ['montgolfières', 'MONTGOLFIERE', 'balloon', 'international balloon']) {
      expect(ids(searchRecords(events, query)), query).toEqual(['international-de-montgolfieres'])
    }
  })

  it('keeps the original order', () => {
    const activities = shippedRecords(activitiesModule)
    const parks = searchRecords(activities, 'parc')
    expect(ids(parks)).toEqual(['parc-riverain-exemple', 'parc-de-quartier-exemple'])
    expect(searchRecords(activities, '')).toEqual(activities)
  })
})

describe('selectors with a search', () => {
  const now = new Date('2026-11-19T12:00:00-05:00')

  it('apply the search after visibleOnMap and the layers', () => {
    const events = shippedRecords(eventsModule)
    // The back-to-school party matches but is over.
    expect(ids(visibleRecords(eventsModule, events, LAYER_IDS, now, 'fête'))).toEqual([])
    expect(ids(visibleRecords(eventsModule, events, LAYER_IDS, now, 'marché'))).toEqual([
      'marche-de-noel-exemple',
      'marche-d-automne-exemple',
    ])
    expect(visibleRecords(eventsModule, events, ['companies'], now, 'marché')).toEqual([])
  })

  it('combine layers and search for one record', () => {
    const trails = shippedRecords(trailsModule)
    const canal = trails.find((trail) => trail.id === 'piste-du-canal-de-chambly')!
    expect(isRecordShown(trailsModule, canal, ['biking'], 'chambly')).toBe(true)
    expect(isRecordShown(trailsModule, canal, ['biking'], 'kayak')).toBe(false)
    expect(isRecordShown(trailsModule, canal, ['companies'], 'chambly')).toBe(false)
    expect(isRecordShown(trailsModule, canal, ['walking'], '')).toBe(true)
  })
})

describe('search in the filter store', () => {
  it('starts blank and sets and clears the query', () => {
    const store = createFilterStore()
    expect(store.getState().query).toBe('')
    store.getState().setQuery('kayak')
    expect(store.getState().query).toBe('kayak')
    store.getState().clearQuery()
    expect(store.getState().query).toBe('')
  })

  it('keeps the query when showing every layer', () => {
    const store = createFilterStore([], 'parc')
    store.getState().showAll()
    expect(store.getState().enabled).toEqual(LAYER_IDS)
    expect(store.getState().query).toBe('parc')
  })

  it('does not notify when the query is unchanged', () => {
    const store = createFilterStore(LAYER_IDS, 'parc')
    const listener = vi.fn()
    store.subscribe(listener)
    store.getState().setQuery('parc')
    expect(listener).not.toHaveBeenCalled()
    store.getState().clearQuery()
    store.getState().clearQuery()
    expect(listener).toHaveBeenCalledTimes(1)
  })
})

describe('search URL parameter', () => {
  it('is named "q"', () => {
    expect(SEARCH_PARAM).toBe('q')
  })

  it('has no opinion when absent and keeps the text otherwise, capped', () => {
    expect(parseSearchParam(null)).toBeNull()
    expect(parseSearchParam('')).toBe('')
    expect(parseSearchParam('Musée du')).toBe('Musée du')
    expect(parseSearchParam('x'.repeat(500))).toHaveLength(MAX_QUERY_LENGTH)
  })

  it('is left out for a blank search and round-trips otherwise', () => {
    expect(serializeSearch('')).toBeNull()
    expect(serializeSearch('   ')).toBeNull()
    expect(serializeSearch('kayak ')).toBe('kayak ')
    expect(parseSearchParam(serializeSearch('Saint-Jean'))).toBe('Saint-Jean')
    expect(serializeSearch('x'.repeat(500))).toHaveLength(MAX_QUERY_LENGTH)
  })
})
