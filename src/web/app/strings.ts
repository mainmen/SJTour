/**
 * All user-facing shell strings, in French (the default language).
 * Phase 2 replaces this file with react-i18next keys (fr + en).
 */
export const strings = {
  appName: 'StJeanTour',
  nav: {
    label: 'Navigation principale',
    map: 'Carte',
    list: 'Liste',
    about: 'À propos',
  },
  pages: {
    map: {
      title: 'Carte',
      placeholder: 'La carte de Saint-Jean-sur-Richelieu arrive bientôt.',
    },
    list: {
      title: 'Liste',
      placeholder: 'La liste des lieux et des événements arrive bientôt.',
    },
    about: {
      title: 'À propos',
      placeholder: 'StJeanTour vous aide à découvrir Saint-Jean-sur-Richelieu.',
    },
    notFound: {
      title: 'Page introuvable',
      message: "Cette page n'existe pas.",
      backHome: "Retour à l'accueil",
    },
  },
} as const
