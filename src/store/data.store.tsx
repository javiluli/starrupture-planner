import { translations } from '@/shared/i18n/game-data'
import type { Language } from '@/shared/@types/i18n'
import type { Building, CorporationLevelMatch, CorporationsData, Item } from '@/shared/@types/production'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface DataStoreState {
  language: Language
  items: Item[]
  buildings: Building[]
  corporations: CorporationsData
  setLanguage: (lang: Language) => void
}

export type ItemTableRow = Item & {
  buildingId: string | null
  production: string | undefined
  corporations: CorporationLevelMatch[] | undefined
}

const getBuildingForItem = (buildings: Building[], itemId: string) =>
  buildings.find((b) => b.recipes?.some((r) => r.output.id === itemId))

const getCorporationsForItem = (corporations: CorporationsData, itemId: string) =>
  Object.values(corporations).flatMap((corp) =>
    corp.levels
      .filter((level) => level.components.some((comp) => comp.id === itemId))
      .map((level) => ({
        corporationId: corp.id,
        level: level.level,
      })),
  )

export const buildItemsTableData = (
  items: Item[],
  buildings: Building[],
  corporations: CorporationsData,
): ItemTableRow[] =>
  items.map((item) => {
    const building = getBuildingForItem(buildings, item.id)
    const itemCorporations = getCorporationsForItem(corporations, item.id)

    return {
      ...item,
      buildingId: building?.id ?? null,
      production: building?.name,
      corporations: itemCorporations,
    }
  })

export const dataSelectors = {
  language: (state: DataStoreState) => state.language,
  items: (state: DataStoreState) => state.items,
  buildings: (state: DataStoreState) => state.buildings,
  corporations: (state: DataStoreState) => state.corporations,
  setLanguage: (state: DataStoreState) => state.setLanguage,
}

/**
 *
 * @module useDataStore
 */
export const useDataStore = create<DataStoreState>()(
  persist(
    (set) => ({
      // Valores iniciales (por defecto ingles)
      language: 'en',
      ...translations.en,

      setLanguage: (lang: Language) => {
        set({ language: lang, ...translations[lang] })
      },
    }),
    {
      name: 'zstore.data',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
