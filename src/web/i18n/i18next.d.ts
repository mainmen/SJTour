import 'i18next'
import type fr from '@/web/i18n/fr.json'

// Type-checked translation keys: `t('nav.mapp')` fails the typecheck.
// French is the source language; resources.test.ts keeps en.json in sync with it.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: typeof fr }
  }
}
