import type { Stats } from '@/features/planner/types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const EMPTY_STATS: Stats = { buildings: 0, power: 0, heat: 0 }

export interface PlannerStoreState {
  // Estado
  targetId: string
  targetIpm: number
  plannerStats: Stats
  /**
   * ID del item - Cantidad "Supply"
   */
  supplyCountByItem: Record<string, number>
  /**
   * Id del item (nodo) -> Id de la variante seleccionada
   */
  buildingVariantByItemId: Record<string, string>
  // Acciones
  setTargetId: (id: string) => void
  setTargetIpm: (value: number) => void
  setPlannerStats: (data: Stats) => void
  setBuildingVariantForItem: (itemId: string, variantId: string) => void
  resetBuildingVariants: () => void
  // Acciones para Suministros
  setSupplyCount: (itemId: string, amount: number) => void
  incrementSupplyCount: (itemId: string, delta: number) => void
  addSupplyItem: (itemId: string) => void
  removeSupplyItem: (itemId: string) => void
}

export const plannerSelectors = {
  // Estado
  targetId: (state: PlannerStoreState) => state.targetId,
  targetIpm: (state: PlannerStoreState) => state.targetIpm,
  plannerStats: (state: PlannerStoreState) => state.plannerStats,
  supplyCountByItem: (state: PlannerStoreState) => state.supplyCountByItem,
  buildingVariantByItemId: (state: PlannerStoreState) => state.buildingVariantByItemId,
  // Acciones
  setTargetId: (state: PlannerStoreState) => state.setTargetId,
  setTargetIpm: (state: PlannerStoreState) => state.setTargetIpm,
  setPlannerStats: (state: PlannerStoreState) => state.setPlannerStats,
  setBuildingVariantForItem: (state: PlannerStoreState) => state.setBuildingVariantForItem,
  resetBuildingVariants: (state: PlannerStoreState) => state.resetBuildingVariants,
  // Acciones para Suministros
  setSupplyCount: (state: PlannerStoreState) => state.setSupplyCount,
  incrementSupplyCount: (state: PlannerStoreState) => state.incrementSupplyCount,
  addSupplyItem: (state: PlannerStoreState) => state.addSupplyItem,
  removeSupplyItem: (state: PlannerStoreState) => state.removeSupplyItem,
}

/**
 * Store central para la planificacion de produccion.
 * Gestiona el item objetivo, la cantidad deseada y las estadisticas globales.
 *
 * Regla: la UI solo llama acciones o lee selectors. No se permite logica de negocio en componentes.
 */
const removeSupply = (state: PlannerStoreState, id: string) => {
  const next = { ...state.supplyCountByItem }
  delete next[id]
  return next
}

export const usePlannerStore = create<PlannerStoreState>()(
  persist(
    (set) => ({
      // DATOS INICIALES
      targetId: '',
      targetIpm: 1,
      plannerStats: EMPTY_STATS,
      supplyCountByItem: {},
      buildingVariantByItemId: {},
      /**
       * Establece el item objetivo.
       *
       * @param id Id del item objetivo
       */
      setTargetId: (id: string) => {
        set({ targetId: id })
      },
      /**
       * Actualiza la tasa objetivo.
       *
       * @param value Nuevo ipm
       */
      setTargetIpm: (value: number) => {
        set({ targetIpm: value })
      },
      /**
       * Mezcla stats calculados en el estado actual.
       *
       * @param data Stats parciales
       */
      setPlannerStats: (data: Stats) => {
        set((state) => ({
          plannerStats: {
            ...state.plannerStats,
            ...data,
          },
        }))
      },
      /**
       * Selecciona variante para un edificio base.
       *
       * @param baseId Id del edificio base
       * @param variantId Id de la variante
       */
      setBuildingVariantForItem: (itemId, variantId) =>
        set((state) => ({
          buildingVariantByItemId: { ...state.buildingVariantByItemId, [itemId]: variantId },
        })),
      /**
       * Limpia todas las variantes seleccionadas (vuelve a V1).
       */
      resetBuildingVariants: () => set({ buildingVariantByItemId: {} }),
      /**
       * Establece el supply exacto. Si amount <= 0, elimina el supply.
       *
       * @param id Item supply
       * @param amount Cantidad
       */
      setSupplyCount: (id, amount) =>
        set((state) => {
          if (Number.isNaN(amount) || amount <= 0) {
            return { supplyCountByItem: removeSupply(state, id) }
          }
          return {
            supplyCountByItem: { ...state.supplyCountByItem, [id]: amount },
          }
        }),
      /**
       * Incrementa o decrementa el supply. Si llega a 0, elimina el supply.
       *
       * @param id Item supply
       * @param delta Variacion
       */
      incrementSupplyCount: (id, delta) =>
        set((state) => {
          const current = state.supplyCountByItem[id] ?? 0
          const next = current + delta
          if (next <= 0) {
            return { supplyCountByItem: removeSupply(state, id) }
          }
          return { supplyCountByItem: { ...state.supplyCountByItem, [id]: next } }
        }),
      /**
       * Agrega un supply si no existe.
       *
       * @param id Item supply
       */
      addSupplyItem: (id) =>
        set((state) => ({
          supplyCountByItem: { ...state.supplyCountByItem, [id]: state.supplyCountByItem[id] || 0 },
        })),
      /**
       * Elimina completamente un supply.
       *
       * @param id Item supply
       */
      removeSupplyItem: (id) =>
        set((state) => {
          return { supplyCountByItem: removeSupply(state, id) }
        }),
    }),
    {
      name: 'zstore.planner',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
