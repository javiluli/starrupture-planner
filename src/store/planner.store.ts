import { normalizeTargetIpm } from '@/features/planner/lib/planner-logic'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface PlannerStoreState {
  targetId: string
  targetIpm: number
  supplyCountByItem: Record<string, number>
  buildingVariantByItemId: Record<string, string>
  setTargetId: (id: string) => void
  setTargetIpm: (value: number) => void
  setBuildingVariantForItem: (itemId: string, variantId: string) => void
  resetBuildingVariants: () => void
  setSupplyCount: (itemId: string, amount: number) => void
  incrementSupplyCount: (itemId: string, delta: number) => void
  addSupplyItem: (itemId: string) => void
  removeSupplyItem: (itemId: string) => void
}

export const plannerSelectors = {
  targetId: (state: PlannerStoreState) => state.targetId,
  targetIpm: (state: PlannerStoreState) => state.targetIpm,
  supplyCountByItem: (state: PlannerStoreState) => state.supplyCountByItem,
  buildingVariantByItemId: (state: PlannerStoreState) => state.buildingVariantByItemId,
  setTargetId: (state: PlannerStoreState) => state.setTargetId,
  setTargetIpm: (state: PlannerStoreState) => state.setTargetIpm,
  setBuildingVariantForItem: (state: PlannerStoreState) => state.setBuildingVariantForItem,
  resetBuildingVariants: (state: PlannerStoreState) => state.resetBuildingVariants,
  setSupplyCount: (state: PlannerStoreState) => state.setSupplyCount,
  incrementSupplyCount: (state: PlannerStoreState) => state.incrementSupplyCount,
  addSupplyItem: (state: PlannerStoreState) => state.addSupplyItem,
  removeSupplyItem: (state: PlannerStoreState) => state.removeSupplyItem,
}

const removeSupply = (supplyCountByItem: Record<string, number>, itemId: string) => {
  const nextSupply = { ...supplyCountByItem }
  delete nextSupply[itemId]
  return nextSupply
}

/** Stores only user-editable Planner inputs; calculated output remains derived state. */
export const usePlannerStore = create<PlannerStoreState>()(
  persist(
    (set) => ({
      targetId: '',
      targetIpm: 0,
      supplyCountByItem: {},
      buildingVariantByItemId: {},
      setTargetId: (targetId) =>
        set((state) => ({
          targetId,
          targetIpm: normalizeTargetIpm(state.targetIpm, Boolean(targetId)),
        })),
      setTargetIpm: (targetIpm) =>
        set((state) => ({ targetIpm: normalizeTargetIpm(targetIpm, Boolean(state.targetId)) })),
      setBuildingVariantForItem: (itemId, variantId) =>
        set((state) => ({
          buildingVariantByItemId: { ...state.buildingVariantByItemId, [itemId]: variantId },
        })),
      resetBuildingVariants: () => set({ buildingVariantByItemId: {} }),
      setSupplyCount: (itemId, amount) =>
        set((state) => ({
          supplyCountByItem:
            Number.isNaN(amount) || amount <= 0
              ? removeSupply(state.supplyCountByItem, itemId)
              : { ...state.supplyCountByItem, [itemId]: amount },
        })),
      incrementSupplyCount: (itemId, delta) =>
        set((state) => {
          const amount = (state.supplyCountByItem[itemId] ?? 0) + delta
          return {
            supplyCountByItem:
              amount <= 0
                ? removeSupply(state.supplyCountByItem, itemId)
                : { ...state.supplyCountByItem, [itemId]: amount },
          }
        }),
      addSupplyItem: (itemId) =>
        set((state) => ({
          supplyCountByItem: { ...state.supplyCountByItem, [itemId]: state.supplyCountByItem[itemId] ?? 0 },
        })),
      removeSupplyItem: (itemId) =>
        set((state) => ({ supplyCountByItem: removeSupply(state.supplyCountByItem, itemId) })),
    }),
    {
      name: 'zstore.planner',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => state?.setTargetIpm(state.targetIpm),
    },
  ),
)
