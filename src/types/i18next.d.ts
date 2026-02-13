/**
 * MOLDE PARA EL AUTOCOMPLETADO (i18n)
 * Importamos los JSON de ingles como referencia para las llaves.
 */

import 'i18next'
import planner from '@/i18n/en/planner-page.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    // Namespace que se usa por defecto si t() esta vacio
    defaultNS: 'planner'

    // Registro de archivos: la 'key' es el nombre que usas en useTranslation('nombre')
    resources: {
      planner: typeof planner
    }
  }
}

/**
 * NOTA PARA EL FUTURO:
 * Si creas un JSON nuevo (no un idioma):
 * 1. Importalo arriba.
 * 2. Regístralo en 'resources'.
 * 3. Añadelo a la configuracion de 'i18n.ts'.
 */
