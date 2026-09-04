import { normalizeTargetIpm } from '@/features/planner/lib/planner-logic'
import { isPositiveSupplyCount, normalizeSupplyCountByItem } from '@/features/planner/lib/supply-count'
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
  setSupply: (itemId: string, amount: number) => void
  incrementSupply: (itemId: string, delta: number) => void
  removeSupply: (itemId: string) => void
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
  setSupply: (state: PlannerStoreState) => state.setSupply,
  incrementSupply: (state: PlannerStoreState) => state.incrementSupply,
  removeSupply: (state: PlannerStoreState) => state.removeSupply,
}

const removeSupply = (supplyCountByItem: Record<string, number>, itemId: string) => {
  const nextSupply = { ...supplyCountByItem }
  delete nextSupply[itemId]
  return nextSupply
}

const setSupply = (supplyCountByItem: Record<string, number>, itemId: string, amount: number) =>
  isPositiveSupplyCount(amount) ? { ...supplyCountByItem, [itemId]: amount } : removeSupply(supplyCountByItem, itemId)

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeStringRecord = (value: unknown) => {
  if (!isRecord(value)) return {}

  const normalized: Record<string, string> = {}
  Object.entries(value).forEach(([key, entry]) => {
    if (typeof entry === 'string') normalized[key] = entry
  })
  return normalized
}

const mergePersistedPlannerState = (persistedState: unknown, currentState: PlannerStoreState): PlannerStoreState => {
  if (!isRecord(persistedState)) return currentState

  const targetId = typeof persistedState.targetId === 'string' ? persistedState.targetId : currentState.targetId
  const storedTargetIpm = typeof persistedState.targetIpm === 'number' ? persistedState.targetIpm : currentState.targetIpm

  return {
    ...currentState,
    targetId,
    targetIpm: normalizeTargetIpm(storedTargetIpm, Boolean(targetId)),
    supplyCountByItem: normalizeSupplyCountByItem(persistedState.supplyCountByItem),
    buildingVariantByItemId: normalizeStringRecord(persistedState.buildingVariantByItemId),
  }
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
      setTargetIpm: (targetIpm) => set((state) => ({ targetIpm: normalizeTargetIpm(targetIpm, Boolean(state.targetId)) })),
      setBuildingVariantForItem: (itemId, variantId) =>
        set((state) => ({
          buildingVariantByItemId: { ...state.buildingVariantByItemId, [itemId]: variantId },
        })),
      resetBuildingVariants: () => set({ buildingVariantByItemId: {} }),
      setSupply: (itemId, amount) =>
        set((state) => ({
          supplyCountByItem: setSupply(state.supplyCountByItem, itemId, amount),
        })),
      incrementSupply: (itemId, delta) =>
        set((state) => {
          const currentAmount = isPositiveSupplyCount(state.supplyCountByItem[itemId]) ? state.supplyCountByItem[itemId] : 0
          return { supplyCountByItem: setSupply(state.supplyCountByItem, itemId, currentAmount + delta) }
        }),
      removeSupply: (itemId) => set((state) => ({ supplyCountByItem: removeSupply(state.supplyCountByItem, itemId) })),
    }),
    {
      name: 'zstore.planner',
      storage: createJSONStorage(() => sessionStorage),
      merge: mergePersistedPlannerState,
    },
  ),
)
