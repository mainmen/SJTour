import { createCatalogStore, selectCollection } from '@/core/store/catalog'
import { createLanguageStore } from '@/core/store/language'
import { createSelectionStore, isSelected } from '@/core/store/selection'
import { fakeSource, testModule, testRecord } from '@/core/test/fixtures'
import type { JsonSource } from '@/core/services/loader'
import type { CoreCategoryModule } from '@/core/types/module'

describe('selection store', () => {
  it('starts with nothing selected', () => {
    expect(createSelectionStore().getState().selected).toBeNull()
  })

  it('selects a record with its origin, then clears it', () => {
    const store = createSelectionStore()
    store.getState().select({ category: 'events', id: 'fete', origin: 'list' })
    expect(store.getState().selected).toEqual({ category: 'events', id: 'fete', origin: 'list' })
    store.getState().select({ category: 'companies', id: 'cafe', origin: 'map' })
    expect(store.getState().selected).toEqual({ category: 'companies', id: 'cafe', origin: 'map' })
    store.getState().clear()
    expect(store.getState().selected).toBeNull()
  })

  it('isSelected matches on both category and id', () => {
    const selected = { category: 'events', id: 'a', origin: 'map' } as const
    expect(isSelected(selected, { category: 'events', id: 'a' })).toBe(true)
    expect(isSelected(selected, { category: 'companies', id: 'a' })).toBe(false)
    expect(isSelected(selected, { category: 'events', id: 'b' })).toBe(false)
    expect(isSelected(null, { category: 'events', id: 'a' })).toBe(false)
  })
})

describe('language store', () => {
  it('defaults to French', () => {
    expect(createLanguageStore().getState().language).toBe('fr')
  })

  it('accepts an initial language and changes it', () => {
    const store = createLanguageStore('en')
    expect(store.getState().language).toBe('en')
    store.getState().setLanguage('fr')
    expect(store.getState().language).toBe('fr')
  })
})

describe('catalog store', () => {
  const record = testRecord()
  const otherModule: CoreCategoryModule = { ...testModule, id: 'events', dataFile: 'data/x.json' }

  /** A source whose responses the test resolves by hand. */
  function deferredSource() {
    const pending: { resolve: (value: unknown) => void; reject: (error: Error) => void }[] = []
    const source: JsonSource = {
      getJson: () => new Promise((resolve, reject) => pending.push({ resolve, reject })),
    }
    return { source, pending }
  }

  it('starts idle for every category', () => {
    const store = createCatalogStore(fakeSource({}), { includeSamples: true })
    expect(selectCollection(store.getState(), testModule)).toEqual({ status: 'idle' })
  })

  it('goes from loading to success', async () => {
    const { source, pending } = deferredSource()
    const store = createCatalogStore(source, { includeSamples: true })
    const done = store.getState().load(testModule)
    expect(selectCollection(store.getState(), testModule)).toEqual({ status: 'loading' })
    pending[0].resolve([record])
    await done
    expect(selectCollection(store.getState(), testModule)).toEqual({
      status: 'success',
      records: [record],
    })
  })

  it('goes from loading to error, and a reload recovers', async () => {
    const files: Record<string, unknown> = { 'data/test.json': new Error('offline') }
    const store = createCatalogStore(fakeSource(files), { includeSamples: true })
    await store.getState().load(testModule)
    expect(selectCollection(store.getState(), testModule)).toEqual({
      status: 'error',
      error: { kind: 'unavailable', message: 'offline' },
    })

    files['data/test.json'] = [record]
    await store.getState().load(testModule, { reload: true })
    expect(selectCollection(store.getState(), testModule).status).toBe('success')
  })

  it('retries an errored category on a plain load too', async () => {
    const files: Record<string, unknown> = {}
    const source = fakeSource(files)
    const store = createCatalogStore(source, { includeSamples: true })
    await store.getState().load(testModule)
    files['data/test.json'] = [record]
    await store.getState().load(testModule)
    expect(source.calls).toHaveLength(2)
    expect(selectCollection(store.getState(), testModule).status).toBe('success')
  })

  it('does not load a category twice, unless asked to reload', async () => {
    const source = fakeSource({ 'data/test.json': [record] })
    const store = createCatalogStore(source, { includeSamples: true })
    await Promise.all([store.getState().load(testModule), store.getState().load(testModule)])
    await store.getState().load(testModule)
    expect(source.calls).toHaveLength(1)
    await store.getState().load(testModule, { reload: true })
    expect(source.calls).toHaveLength(2)
  })

  it('keeps categories independent', async () => {
    const source = fakeSource({ 'data/test.json': [record] })
    const store = createCatalogStore(source, { includeSamples: true })
    await store.getState().load(testModule)
    await store.getState().load(otherModule)
    expect(selectCollection(store.getState(), testModule).status).toBe('success')
    expect(selectCollection(store.getState(), otherModule).status).toBe('error')
  })

  it('applies the sample option', async () => {
    const sample = testRecord({ id: 'sample', sample: true })
    const store = createCatalogStore(fakeSource({ 'data/test.json': [record, sample] }), {
      includeSamples: false,
    })
    await store.getState().load(testModule)
    expect(selectCollection(store.getState(), testModule)).toEqual({
      status: 'success',
      records: [record],
    })
  })
})
