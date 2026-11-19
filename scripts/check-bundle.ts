/**
 * Performance budget (specs/tech-stack.md: initial JS under ~200 kB gzipped).
 * Measures the JavaScript a first visit to `/` downloads: the entry chunk, the
 * map route's chunk (MapPage, the home page) and everything they import
 * statically. Run after `npm run build`; fails when over budget.
 *
 * Plain Node (type stripping), no dependencies.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

/** Budget for the home page's JavaScript, gzipped, in bytes (kB = 1000 B, as Vite reports). */
export const HOME_JS_BUDGET = 200_000

/** Static imports between built chunks: `import"./a.js"`, `from"./b.js"` (not `import("./c.js")`). */
export function staticImports(code: string): string[] {
  return [...code.matchAll(/(?:\bimport|\bfrom)\s*["']\.\/([\w.-]+\.js)["']/g)].map(
    (match) => match[1]!,
  )
}

/** Every chunk reachable from `roots` through static imports, read with `read(name)`. */
export function staticClosure(roots: readonly string[], read: (name: string) => string): string[] {
  const seen = new Set<string>()
  const visit = (name: string) => {
    if (seen.has(name)) return
    seen.add(name)
    for (const next of staticImports(read(name))) visit(next)
  }
  roots.forEach(visit)
  return [...seen]
}

function main() {
  const dist = fileURLToPath(new URL('../dist', import.meta.url))
  const assets = join(dist, 'assets')
  const html = readFileSync(join(dist, 'index.html'), 'utf8')
  const entry = /<script[^>]+src="[^"]*assets\/([\w.-]+\.js)"/.exec(html)?.[1]
  const home = readdirSync(assets).find((name) => /^MapPage-[\w-]+\.js$/.test(name))
  if (!entry || !home) {
    console.error('Bundle check: run `npm run build` first (entry or MapPage chunk not found).')
    process.exitCode = 1
    return
  }
  const read = (name: string) => readFileSync(join(assets, name), 'utf8')
  const chunks = staticClosure([entry, home], read)
  const sizes = chunks.map((name) => ({ name, gzip: gzipSync(read(name)).length }))
  const total = sizes.reduce((sum, { gzip }) => sum + gzip, 0)
  for (const { name, gzip } of sizes.sort((a, b) => b.gzip - a.gzip)) {
    console.log(`  ${(gzip / 1000).toFixed(1).padStart(6)} kB  ${name}`)
  }
  const summary = `Home page JS: ${(total / 1000).toFixed(1)} kB gzipped (budget ${HOME_JS_BUDGET / 1000} kB).`
  if (total > HOME_JS_BUDGET) {
    console.error(`Bundle check failed. ${summary}`)
    process.exitCode = 1
  } else {
    console.log(`Bundle check passed. ${summary}`)
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main()
