import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { staticClosure, staticImports } from './check-bundle.ts'
import { findSamples, samplesInDirectory } from './check-release.ts'

describe('release check', () => {
  it('finds sample records in arrays and in GeoJSON properties', () => {
    expect(
      findSamples('a.json', [
        { id: 'real', sample: false },
        { id: 'fake', sample: true },
      ]),
    ).toEqual([{ file: 'a.json', id: 'fake' }])
    expect(
      findSamples('t.geojson', {
        type: 'FeatureCollection',
        features: [{ type: 'Feature', properties: { id: 'path', sample: true } }],
      }),
    ).toEqual([{ file: 't.geojson', id: 'path' }])
    expect(findSamples('b.json', [{ id: 'x' }, 'text', 3, null])).toEqual([])
  })

  it('scans every data file of a directory', () => {
    const directory = mkdtempSync(join(tmpdir(), 'release-check-'))
    try {
      writeFileSync(join(directory, 'a.json'), JSON.stringify([{ id: 'one', sample: true }]))
      writeFileSync(join(directory, 'b.geojson'), JSON.stringify({ features: [] }))
      writeFileSync(join(directory, 'notes.txt'), 'sample: true')
      expect(samplesInDirectory(directory)).toEqual([{ file: 'a.json', id: 'one' }])
    } finally {
      rmSync(directory, { recursive: true })
    }
  })

  it('flags the sample records shipped today (the gate is closed until real data lands)', () => {
    const shipped = samplesInDirectory(join(import.meta.dirname, '../public/data'))
    expect(shipped.length).toBeGreaterThan(0)
  })
})

describe('bundle check', () => {
  it('follows static imports only', () => {
    const code = `import"./a-1.js";import{x}from"./b_2.js";const c=()=>import("./lazy-3.js")`
    expect(staticImports(code)).toEqual(['a-1.js', 'b_2.js'])
  })

  it('collects the static closure of the roots once each', () => {
    const files: Record<string, string> = {
      'entry.js': 'import"./shared.js";import("./lazy.js")',
      'home.js': 'import{a}from"./shared.js";import"./leaf.js"',
      'shared.js': '',
      'leaf.js': 'import"./shared.js"',
      'lazy.js': '',
    }
    expect(staticClosure(['entry.js', 'home.js'], (name) => files[name]!).sort()).toEqual([
      'entry.js',
      'home.js',
      'leaf.js',
      'shared.js',
    ])
  })
})
