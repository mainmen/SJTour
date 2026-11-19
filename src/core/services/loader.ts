import type { BaseRecord } from '@/core/schemas/base'
import type { CoreCategoryModule } from '@/core/types/module'

/**
 * Where data files come from. The web app fetches them over HTTP
 * (src/web/adapters/jsonSource.ts); tests pass a fake; a CMS can replace it later.
 * Implementations throw on any failure (network, HTTP status, JSON syntax).
 */
export interface JsonSource {
  getJson(path: string): Promise<unknown>
}

/** One validation problem, with the path to the bad value (`3.name.fr`). */
export type LoadIssue = { readonly path: string; readonly message: string }

export type LoadError =
  /** The source failed: offline, HTTP error, broken JSON… Retrying may help. */
  | { readonly kind: 'unavailable'; readonly message: string }
  /** The file loaded but does not match the schema. Retrying won't help. */
  | { readonly kind: 'invalid'; readonly issues: readonly LoadIssue[] }

export type LoadResult<T> =
  | { readonly status: 'success'; readonly records: readonly T[] }
  | { readonly status: 'error'; readonly error: LoadError }

export type LoadOptions = {
  /** Keep records flagged `sample: true` (specs/2026-11-19-data-layer D4). */
  readonly includeSamples: boolean
}

function formatPath(path: readonly PropertyKey[]): string {
  return path.map(String).join('.')
}

/** Drops placeholder records. */
export function excludeSamples<T extends BaseRecord>(records: readonly T[]): T[] {
  return records.filter((record) => record.sample !== true)
}

/**
 * Validates a parsed data file: an array of the module's records with unique ids.
 * Pure and synchronous, so the build-time data test can use it too.
 */
export function validateCollection<T extends BaseRecord>(
  module: CoreCategoryModule<T>,
  data: unknown,
): LoadResult<T> {
  if (!Array.isArray(data)) {
    return {
      status: 'error',
      error: { kind: 'invalid', issues: [{ path: '', message: 'Expected an array of records' }] },
    }
  }

  const records: T[] = []
  const issues: LoadIssue[] = []
  data.forEach((item, index) => {
    const parsed = module.recordSchema.safeParse(item)
    if (parsed.success) records.push(parsed.data)
    else {
      for (const issue of parsed.error.issues) {
        issues.push({ path: formatPath([index, ...issue.path]), message: issue.message })
      }
    }
  })

  const seen = new Set<string>()
  records.forEach((record) => {
    if (seen.has(record.id)) {
      issues.push({ path: record.id, message: `Duplicate id "${record.id}"` })
    }
    seen.add(record.id)
  })

  if (issues.length > 0) return { status: 'error', error: { kind: 'invalid', issues } }
  return { status: 'success', records }
}

/** Loads and validates a module's data file. Never throws: errors are returned as values (D7). */
export async function loadCollection<T extends BaseRecord>(
  source: JsonSource,
  module: CoreCategoryModule<T>,
  options: LoadOptions,
): Promise<LoadResult<T>> {
  let data: unknown
  try {
    data = await source.getJson(module.dataFile)
  } catch (error) {
    return {
      status: 'error',
      error: {
        kind: 'unavailable',
        message: error instanceof Error ? error.message : String(error),
      },
    }
  }

  const result = validateCollection(module, data)
  if (result.status === 'error' || options.includeSamples) return result
  return { status: 'success', records: excludeSamples(result.records) }
}
