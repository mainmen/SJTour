import { isLayerId, LAYER_IDS, normalizeLayers } from '@/core/filters/layers'
import {
  enabledModuleLayers,
  filterRecords,
  isRecordVisible,
  recordLayers,
  visibleRecords,
} from '@/core/filters/selectors'
import { LAYERS_PARAM, parseLayersParam, serializeLayers } from '@/core/filters/url'
import { companiesModule } from '@/core/modules/companies/module'
import { eventsModule } from '@/core/modules/events/module'
import { coreModules } from '@/core/modules/registry'
import { trailsModule } from '@/core/modules/trails/module'
import type { Trail } from '@/core/modules/trails/schema'
import { createFilterStore, isLayerEnabled } from '@/core/store/filters'
import { shippedRecords } from '@/core/test/records'

const trails = shippedRecords(trailsModule)
const byId = (id: string) => trails.find((trail) => trail.id === id) as Trail
const canal = byId('piste-du-canal-de-chambly') // both
const bikePath = byId('piste-cyclable-iberville-exemple') // bike
const promenade = byId('promenade-riveraine-exemple') // walk

describe('layers', () => {
  it('are the four categories with trails split into walking and biking', () => {
    expect(LAYER_IDS).toEqual(['companies', 'activities', 'events', 'walking', 'biking'])
  })

  it('are each owned by exactly one module', () => {
    const owned = coreModules.flatMap((module) => module.layers.map((layer) => layer.id))
    expect([...owned].sort()).toEqual([...LAYER_IDS].sort())
  })

  it('recognises layer ids and normalizes lists', () => {
    expect(isLayerId('walking')).toBe(true)
    expect(isLayerId('trails')).toBe(false)
    expect(normalizeLayers(['biking', 'companies', 'biking'])).toEqual(['companies', 'biking'])
  })
})

describe('filter selectors', () => {
  it('puts a both trail in the walking and the biking layer', () => {
    expect(recordLayers(trailsModule, canal)).toEqual(['walking', 'biking'])
    expect(recordLayers(trailsModule, bikePath)).toEqual(['biking'])
    expect(recordLayers(trailsModule, promenade)).toEqual(['walking'])
  })

  it('shows a trail when any of its layers is on', () => {
    expect(filterRecords(trailsModule, trails, ['biking']).map((t) => t.id)).toEqual([
      canal.id,
      bikePath.id,
    ])
    expect(filterRecords(trailsModule, trails, ['walking']).map((t) => t.id)).toEqual([
      canal.id,
      promenade.id,
    ])
    expect(filterRecords(trailsModule, trails, ['companies'])).toEqual([])
    expect(isRecordVisible(trailsModule, canal, ['walking'])).toBe(true)
  })

  it('shows a point category only when its layer is on', () => {
    const companies = shippedRecords(companiesModule)
    expect(filterRecords(companiesModule, companies, LAYER_IDS)).toHaveLength(companies.length)
    expect(filterRecords(companiesModule, companies, ['events', 'walking'])).toEqual([])
  })

  it('lists the enabled layers of a module', () => {
    expect(enabledModuleLayers(trailsModule, ['companies', 'biking'])).toEqual(['biking'])
    expect(enabledModuleLayers(companiesModule, ['biking'])).toEqual([])
  })

  it('applies visibleOnMap before the layers (no past events)', () => {
    const events = shippedRecords(eventsModule)
    const now = new Date('2026-11-19T12:00:00-05:00')
    const visible = visibleRecords(eventsModule, events, LAYER_IDS, now)
    expect(visible.map((event) => event.id)).not.toContain('fete-de-la-rentree-exemple')
    expect(visible).toHaveLength(events.length - 1)
    expect(visibleRecords(eventsModule, events, ['companies'], now)).toEqual([])
  })
})

describe('filter store', () => {
  it('starts with every layer on', () => {
    expect(createFilterStore().getState().enabled).toEqual(LAYER_IDS)
  })

  it('toggles a layer off and back on, keeping display order', () => {
    const store = createFilterStore()
    store.getState().toggle('companies')
    expect(store.getState().enabled).toEqual(['activities', 'events', 'walking', 'biking'])
    expect(isLayerEnabled(store.getState(), 'companies')).toBe(false)
    store.getState().toggle('companies')
    expect(store.getState().enabled).toEqual(LAYER_IDS)
  })

  it('sets, enables and shows all', () => {
    const store = createFilterStore([])
    store.getState().setEnabled(['biking', 'events'])
    expect(store.getState().enabled).toEqual(['events', 'biking'])
    store.getState().enable(['companies', 'events'])
    expect(store.getState().enabled).toEqual(['companies', 'events', 'biking'])
    store.getState().showAll()
    expect(store.getState().enabled).toEqual(LAYER_IDS)
  })

  it('keeps the same state when nothing changes', () => {
    const store = createFilterStore()
    const listener = vi.fn()
    store.subscribe(listener)
    store.getState().setEnabled([...LAYER_IDS].reverse())
    store.getState().enable(['walking'])
    expect(listener).not.toHaveBeenCalled()
  })
})

describe('layers URL parameter', () => {
  it('is named "layers"', () => {
    expect(LAYERS_PARAM).toBe('layers')
  })

  it('has no opinion when absent', () => {
    expect(parseLayersParam(null)).toBeNull()
  })

  it('means every layer off when empty', () => {
    expect(parseLayersParam('')).toEqual([])
  })

  it('reads known ids in display order, ignoring unknown ones and spaces', () => {
    expect(parseLayersParam('walking, companies,nope')).toEqual(['companies', 'walking'])
  })

  it('is ignored when it lists no known layer', () => {
    expect(parseLayersParam('nope')).toBeNull()
  })

  it('is left out when every layer is on', () => {
    expect(serializeLayers(LAYER_IDS)).toBeNull()
  })

  it('lists the enabled layers otherwise, round-tripping', () => {
    expect(serializeLayers(['biking', 'companies'])).toBe('companies,biking')
    expect(serializeLayers([])).toBe('')
    expect(parseLayersParam(serializeLayers(['events', 'walking']))).toEqual(['events', 'walking'])
  })
})
