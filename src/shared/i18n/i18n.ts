import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// Planner page
import enPagePlanner from './ui/en/planner-page.json'
import esPagePlanner from './ui/es/planner-page.json'
// Items page
import enPageItems from './ui/en/items-page.json'
import esPageItems from './ui/es/items-page.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        planner: enPagePlanner,
        items: enPageItems,
      },
      es: {
        planner: esPagePlanner,
        items: esPageItems,
      },
    },
    // Namespaces disponibles
    ns: ['planner', 'items'],
    defaultNS: 'planner', // default namespace

    lng: 'en',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
  })

export default i18n
