// Test helper: the data files shipped in public/data, parsed (Vite glob import).
const jsonFiles = import.meta.glob<unknown>('/public/data/*.json', {
  eager: true,
  import: 'default',
})
// Vite only parses `.json` imports, so GeoJSON files are read as text.
const geojsonFiles = import.meta.glob<string>('/public/data/*.geojson', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const files: Record<string, unknown> = {
  ...jsonFiles,
  ...Object.fromEntries(
    Object.entries(geojsonFiles).map(([path, text]) => [path, JSON.parse(text) as unknown]),
  ),
}

/** Paths of every shipped data file, relative to `public/` (e.g. `data/companies.json`). */
export const dataFilePaths: readonly string[] = Object.keys(files).map((path) =>
  path.replace(/^\/public\//, ''),
)

/** The parsed content of `public/<path>`. */
export function readDataFile(path: string): unknown {
  return files[`/public/${path}`]
}
