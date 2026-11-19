import { z } from 'zod'
import { defineRecordSchema } from '@/core/schemas/base'
import type { JsonSource } from '@/core/services/loader'
import type { CoreCategoryModule } from '@/core/types/module'

/** A minimal module for testing the generic data layer. */
export const testSchema = defineRecordSchema('companies', { rank: z.number().optional() })
export type TestRecord = z.infer<typeof testSchema>

export const testModule: CoreCategoryModule<TestRecord> = {
  id: 'companies',
  layers: [{ id: 'companies' }],
  dataFile: 'data/test.json',
  recordSchema: testSchema,
}

/** A valid record of `testModule`, with overrides. */
export function testRecord(overrides: Partial<TestRecord> = {}): TestRecord {
  return {
    id: 'record-a',
    category: 'companies',
    name: { fr: 'Nom A', en: 'Name A' },
    description: { fr: 'Description A', en: 'Description A' },
    coordinates: [45.3073, -73.2625],
    lastVerified: '2026-11-19',
    ...overrides,
  }
}

/**
 * A fake source serving `files` by path. A path mapped to an `Error` rejects with it;
 * an unknown path rejects like a 404.
 */
export function fakeSource(files: Record<string, unknown>): JsonSource & { calls: string[] } {
  const calls: string[] = []
  return {
    calls,
    async getJson(path) {
      calls.push(path)
      if (!(path in files)) throw new Error(`HTTP 404 for ${path}`)
      const value = files[path]
      if (value instanceof Error) throw value
      return structuredClone(value)
    },
  }
}
