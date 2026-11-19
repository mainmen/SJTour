import { excludeSamples, loadCollection, validateCollection } from '@/core/services/loader'
import { fakeSource, testModule, testRecord } from '@/core/test/fixtures'

const a = testRecord()
const b = testRecord({ id: 'record-b', sample: true })

describe('validateCollection', () => {
  it('returns the parsed records', () => {
    expect(validateCollection(testModule, [a, b])).toEqual({ status: 'success', records: [a, b] })
  })

  it('rejects data that is not an array', () => {
    const result = validateCollection(testModule, { records: [a] })
    expect(result).toEqual({
      status: 'error',
      error: { kind: 'invalid', issues: [{ path: '', message: 'Expected an array of records' }] },
    })
  })

  it('reports every invalid record with the path to the bad value', () => {
    const result = validateCollection(testModule, [
      a,
      { ...b, name: { fr: '', en: 'B' } },
      { ...a, id: 'c', lastVerified: 'soon' },
    ])
    expect(result.status).toBe('error')
    if (result.status !== 'error' || result.error.kind !== 'invalid') throw new Error('expected')
    expect(result.error.issues.map((issue) => issue.path)).toEqual(['1.name.fr', '2.lastVerified'])
  })

  it('rejects duplicate ids', () => {
    const result = validateCollection(testModule, [a, { ...b, id: a.id }])
    expect(result).toEqual({
      status: 'error',
      error: { kind: 'invalid', issues: [{ path: a.id, message: `Duplicate id "${a.id}"` }] },
    })
  })
})

describe('loadCollection', () => {
  it('loads the module data file and returns its records', async () => {
    const source = fakeSource({ 'data/test.json': [a, b] })
    const result = await loadCollection(source, testModule, { includeSamples: true })
    expect(result).toEqual({ status: 'success', records: [a, b] })
    expect(source.calls).toEqual(['data/test.json'])
  })

  it('drops sample records when samples are excluded', async () => {
    const source = fakeSource({ 'data/test.json': [a, b] })
    const result = await loadCollection(source, testModule, { includeSamples: false })
    expect(result).toEqual({ status: 'success', records: [a] })
  })

  it('returns an unavailable error when the source fails, without throwing', async () => {
    const source = fakeSource({ 'data/test.json': new Error('Network down') })
    await expect(loadCollection(source, testModule, { includeSamples: true })).resolves.toEqual({
      status: 'error',
      error: { kind: 'unavailable', message: 'Network down' },
    })
  })

  it('returns an unavailable error for a missing file', async () => {
    const result = await loadCollection(fakeSource({}), testModule, { includeSamples: true })
    expect(result.status === 'error' && result.error.kind).toBe('unavailable')
  })

  it('handles a source that rejects with a non-Error value', async () => {
    const source = { getJson: () => Promise.reject('boom') }
    const result = await loadCollection(source, testModule, { includeSamples: true })
    expect(result).toEqual({ status: 'error', error: { kind: 'unavailable', message: 'boom' } })
  })

  it('returns an invalid error for data that fails validation', async () => {
    const source = fakeSource({ 'data/test.json': [{ ...a, coordinates: [0, 0] }] })
    const result = await loadCollection(source, testModule, { includeSamples: false })
    expect(result.status === 'error' && result.error.kind).toBe('invalid')
  })
})

describe('excludeSamples', () => {
  it('keeps only records not flagged as sample', () => {
    const c = testRecord({ id: 'record-c', sample: false })
    expect(excludeSamples([a, b, c])).toEqual([a, c])
  })
})
