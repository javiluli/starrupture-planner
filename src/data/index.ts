import * as en from './en'
import * as es from './es'
import type { Building, CorporationsData, Item } from '@/types/production'

// Estructura de datos por idioma
export const translations = {
  en: {
    items: en.items as Item[],
    buildings: en.buildings as Building[],
    corporations: en.corporations as CorporationsData,
  },
  es: {
    items: es.items as Item[],
    buildings: es.buildings as Building[],
    corporations: es.corporations as CorporationsData,
  },
} as const

export type TranslationData = (typeof translations)['en']
