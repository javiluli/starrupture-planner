import * as en from './game-data/en/data'
import * as es from './game-data/es/data'
import type { Building, CorporationsData, Item } from '@/shared/@types/production'

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
