import { translations } from '@/data'
import type { Language } from '@/types/i18n'
import type { Building, CorporationsData, Item } from '@/types/production'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface DataStoreState {
  items: Item[]
  buildings: Building[]
  corporations: CorporationsData
  setLanguage: (lang: Language) => void
}

/**
 *
 * @module useDataStore
 */
export const useDataStore = create<DataStoreState>()(
  persist(
    (set) => ({
      // Valores iniciales (por defecto ingles)
      ...translations.en,

      setLanguage: (lang: Language) => {
        set({ ...translations[lang] })
      },
    }),
    {
      name: 'zstore.data',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
