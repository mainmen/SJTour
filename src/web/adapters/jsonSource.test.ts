import { createFetchJsonSource } from '@/web/adapters/jsonSource'

function stubFetch(response: Response | Error) {
  const fetchMock = vi.fn(() =>
    response instanceof Error ? Promise.reject(response) : Promise.resolve(response),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('createFetchJsonSource', () => {
  it('fetches the path relative to the base URL and parses JSON', async () => {
    const fetchMock = stubFetch(new Response('[{"id":"a"}]', { status: 200 }))
    await expect(createFetchJsonSource('/app').getJson('data/x.json')).resolves.toEqual([
      { id: 'a' },
    ])
    expect(fetchMock).toHaveBeenCalledWith('/app/data/x.json')
  })

  it('defaults to the Vite base URL', async () => {
    const fetchMock = stubFetch(new Response('[]'))
    await createFetchJsonSource().getJson('data/x.json')
    expect(fetchMock).toHaveBeenCalledWith('/data/x.json')
  })

  it('throws on a non-2xx response', async () => {
    stubFetch(new Response('Not found', { status: 404 }))
    await expect(createFetchJsonSource('/').getJson('data/x.json')).rejects.toThrow(
      'GET /data/x.json failed: HTTP 404',
    )
  })

  it('throws on invalid JSON and on network errors', async () => {
    stubFetch(new Response('{oops'))
    await expect(createFetchJsonSource('/').getJson('data/x.json')).rejects.toThrow()
    stubFetch(new TypeError('Failed to fetch'))
    await expect(createFetchJsonSource('/').getJson('data/x.json')).rejects.toThrow(
      'Failed to fetch',
    )
  })
})
