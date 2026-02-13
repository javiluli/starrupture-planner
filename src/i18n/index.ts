import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Cuidado: Tenías los nombres cruzados (esPagePlanner importaba de /en/)
import enPagePlanner from './en/planner-page.json'
import esPagePlanner from './es/planner-page.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        planner: enPagePlanner,
      },
      es: {
        planner: esPagePlanner,
      },
    },
    // Namespaces disponibles
    ns: ['planner'],
    defaultNS: 'planner', // Namespace por defecto

    lng: 'en',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Opcional: Priorizar la caché del navegador pero respetar el inglés al inicio
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
  })

export default i18n
