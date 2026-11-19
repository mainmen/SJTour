import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
  },
  {
    // Portable core boundary (specs/tech-stack.md → Architecture).
    files: ['src/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react-dom', message: 'core must stay platform-agnostic: no React DOM.' },
            { name: 'leaflet', message: 'core must stay platform-agnostic: no Leaflet.' },
            { name: 'react-leaflet', message: 'core must stay platform-agnostic: no Leaflet.' },
          ],
          patterns: [
            {
              group: ['react-dom/*'],
              message: 'core must stay platform-agnostic: no React DOM.',
            },
            {
              regex: '^(@/web|(\\.\\.?/)+([^/]+/)*web)(/|$)',
              message: 'core must never import from the web layer.',
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        ...['window', 'document', 'localStorage', 'sessionStorage', 'navigator', 'location'].map(
          (name) => ({
            name,
            message: `core must not use the browser global "${name}". Pass it in through an adapter interface implemented in src/web/adapters/.`,
          }),
        ),
      ],
    },
  },
  {
    files: ['*.config.{js,ts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  prettier,
])
