/**
 * Release gate (specs/2026-11-19-mvp-release D1): fails while any shipped data
 * file still holds a record flagged `sample: true`. Run by the deploy workflow
 * before building; `npm run check:release` runs it locally.
 *
 * Plain Node (type stripping), no app imports: it reads the JSON files as data.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export type SampleRecord = { readonly file: string; readonly id: string }

/** Every object with `sample: true` in a parsed JSON value (arrays, GeoJSON properties…). */
export function findSamples(file: string, value: unknown): SampleRecord[] {
  if (Array.isArray(value)) return value.flatMap((item) => findSamples(file, item))
  if (typeof value !== 'object' || value === null) return []
  const record = value as Record<string, unknown>
  const here =
    record.sample === true ? [{ file, id: typeof record.id === 'string' ? record.id : '?' }] : []
  return [...here, ...Object.values(record).flatMap((child) => findSamples(file, child))]
}

/** The sample records in every `.json` / `.geojson` file of a data directory. */
export function samplesInDirectory(directory: string): SampleRecord[] {
  return readdirSync(directory)
    .filter((name) => /\.(geo)?json$/.test(name))
    .sort()
    .flatMap((name) =>
      findSamples(name, JSON.parse(readFileSync(join(directory, name), 'utf8')) as unknown),
    )
}

function main() {
  const directory = fileURLToPath(new URL('../public/data', import.meta.url))
  const samples = samplesInDirectory(directory)
  if (samples.length === 0) {
    console.log('Release check passed: no sample records in public/data.')
    return
  }
  console.error(`Release check failed: ${samples.length} sample record(s) would ship.`)
  for (const { file, id } of samples) console.error(`  ${file}: ${id}`)
  console.error('Replace them with real, verified entries (or remove them) before deploying.')
  process.exitCode = 1
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main()
