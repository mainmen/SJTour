/**
 * Portable core layer: types, schemas, stores, services and domain logic.
 *
 * Rules (enforced by ESLint, see eslint.config.js):
 * - No imports from `src/web/`, React DOM, Leaflet, react-leaflet or i18next.
 * - No browser globals (window, document, localStorage, …). Platform needs are
 *   passed in through small adapter interfaces implemented in `src/web/adapters/`.
 */
export {}
