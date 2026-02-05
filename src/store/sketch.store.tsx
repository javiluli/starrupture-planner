import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SketchStoreState {
  plannerStats: { heat: number; maxPower: number; restPower: number }
  setPlannerStats: (heat: number, maxPower: number, restPower: number) => void
}

/**
 *
 * @module useSketchStore
 */
export const useSketchStore = create<SketchStoreState>()(
  persist(
    (set) => ({
      plannerStats: { heat: 0, maxPower: 0, restPower: 0 },

      setPlannerStats: (heat, maxPower, restPower) => {
        set({ plannerStats: { heat, maxPower, restPower } })
      },
    }),
    {
      name: 'zstore.sketch',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
