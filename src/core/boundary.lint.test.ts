// @vitest-environment node
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'

const cwd = fileURLToPath(new URL('../..', import.meta.url))
const eslint = new ESLint({ cwd })

async function ruleIds(code: string, filePath: string): Promise<string[]> {
  const [result] = await eslint.lintText(code, { filePath })
  return result.messages.map((m) => m.ruleId ?? 'fatal')
}

const CORE_FILE = 'src/core/__fixture__.ts'
const WEB_FILE = 'src/web/__fixture__.ts'

const forbiddenImports = [
  "import { createRoot } from 'react-dom/client'",
  "import ReactDOM from 'react-dom'",
  "import L from 'leaflet'",
  "import { MapContainer } from 'react-leaflet'",
  "import App from '@/web/app/App'",
  "import * as web from '@/web'",
  "import App from '../web/app/App'",
  "import App from '../../src/web/app/App'",
]

const forbiddenGlobals = [
  'window',
  'document',
  'localStorage',
  'sessionStorage',
  'navigator',
  'location',
]

describe('core boundary lint rule', () => {
  it.each(forbiddenImports)('rejects `%s` in core', async (statement) => {
    const ids = await ruleIds(`${statement}\nexport const x = 1\n`, CORE_FILE)
    expect(ids).toContain('no-restricted-imports')
  })

  it.each(forbiddenGlobals)('rejects the browser global `%s` in core', async (name) => {
    const ids = await ruleIds(`export const x = ${name}\n`, CORE_FILE)
    expect(ids).toContain('no-restricted-globals')
  })

  it('accepts a clean pure-TypeScript core file', async () => {
    const code = [
      "import { z } from 'zod'",
      "import type { Foo } from '@/core/types'",
      "import { helper } from './webhooks'",
      'export const double = (n: number): number => n * 2',
      'export type { Foo }',
      'export { z, helper }',
      '',
    ].join('\n')
    expect(await ruleIds(code, CORE_FILE)).toEqual([])
  })

  it('does not apply to the web layer', async () => {
    const code = [
      "import { createRoot } from 'react-dom/client'",
      "import App from '@/web/app/App'",
      'export const w = window',
      'export { createRoot, App }',
      '',
    ].join('\n')
    const ids = await ruleIds(code, WEB_FILE)
    expect(ids).not.toContain('no-restricted-imports')
    expect(ids).not.toContain('no-restricted-globals')
  })
})
