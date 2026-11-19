// Test helper: the data files shipped in public/data, parsed (Vite glob import).
const files = import.meta.glob<unknown>('/public/data/*.json', { eager: true, import: 'default' })

/** Paths of every shipped data file, relative to `public/` (e.g. `data/companies.json`). */
export const dataFilePaths: readonly string[] = Object.keys(files).map((path) =>
  path.replace(/^\/public\//, ''),
)

/** The parsed content of `public/<path>`. */
export function readDataFile(path: string): unknown {
  return files[`/public/${path}`]
}
