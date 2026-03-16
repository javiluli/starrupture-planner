import type { Stats } from '@/shared/@types/production'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { findRecipeForItem } from '@/features/planner/lib/recipes'
import { clampTargetIpm } from '@/features/planner/lib'
import { useDataStore } from '@/store/data.store'

export interface PlannerStoreState {
  // Estado
  targetId: string
  targetIpm: number
  plannerStats: Stats
  /**
   * ID del item - Cantidad "Supply"
   */
  supplies: Record<string, number>
  // Acciones
  setTargetId: (id: string) => void
  setTargetIpm: (value: number) => void
  setPlannerStats: (data: Stats) => void

  // Acciones para Suministros
  updateSupply: (itemId: string, amount: number) => void
  setSupplyAmount: (itemId: string, amount: number) => void
  incrementSupply: (itemId: string, delta: number) => void
  addSupplyNode: (itemId: string) => void
  removeSupply: (itemId: string) => void
}

export const plannerSelectors = {
  targetId: (state: PlannerStoreState) => state.targetId,
  targetIpm: (state: PlannerStoreState) => state.targetIpm,
  plannerStats: (state: PlannerStoreState) => state.plannerStats,
  supplies: (state: PlannerStoreState) => state.supplies,
  setTargetId: (state: PlannerStoreState) => state.setTargetId,
  setTargetIpm: (state: PlannerStoreState) => state.setTargetIpm,
  setPlannerStats: (state: PlannerStoreState) => state.setPlannerStats,
  updateSupply: (state: PlannerStoreState) => state.updateSupply,
  setSupplyAmount: (state: PlannerStoreState) => state.setSupplyAmount,
  incrementSupply: (state: PlannerStoreState) => state.incrementSupply,
  addSupplyNode: (state: PlannerStoreState) => state.addSupplyNode,
  removeSupply: (state: PlannerStoreState) => state.removeSupply,
}

/**
 * Store central para la planificacion de produccion.
 * Gestiona el item objetivo, la cantidad deseada y las estadisticas globales.
 *
 * Regla: la UI solo llama acciones o lee selectors. No se permite logica de negocio en componentes.
 */
export const usePlannerStore = create<PlannerStoreState>()(
  persist(
    (set, get) => ({
      // DATOS INICIALES
      targetId: '',
      targetIpm: 1,
      plannerStats: { buildings: 0, power: 0, heat: 0 },
      supplies: {},

      /**
       * Establece el item objetivo.
       * Si no hay id, resetea stats e ipm.
       * Si hay id, inicializa ipm al ratio base de la receta.
       *
       * @param id Id del item objetivo
       */
      setTargetId: (id: string) => {
        if (!id) {
          set({
            targetId: '',
            targetIpm: 0,
            plannerStats: { buildings: 0, power: 0, heat: 0 },
          })
          return
        }

        const buildings = useDataStore.getState().buildings
        const { recipe } = findRecipeForItem(buildings, id)

        set({
          targetId: id,
          targetIpm: recipe ? recipe.output.amount_per_minute : 1,
        })
      },

      /**
       * Actualiza la tasa objetivo. Se clamp a 0 o mas.
       *
       * @param value Nuevo ipm
       */
      setTargetIpm: (value: number) => {
        set({ targetIpm: clampTargetIpm(value) })
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
       * Establece el supply exacto. Si amount <= 0, elimina el supply.
       *
       * @param id Item supply
       * @param amount Cantidad
       */
      setSupplyAmount: (id, amount) =>
        set((state) => {
          if (Number.isNaN(amount) || amount <= 0) {
            const next = { ...state.supplies }
            delete next[id]
            return { supplies: next }
          }

          return {
            supplies: { ...state.supplies, [id]: amount },
          }
        }),

      /**
       * Incrementa o decrementa el supply. Si llega a 0, elimina el supply.
       *
       * @param id Item supply
       * @param delta Variacion
       */
      incrementSupply: (id, delta) =>
        set((state) => {
          const current = state.supplies[id] ?? 0
          const next = current + delta

          if (next <= 0) {
            const updated = { ...state.supplies }
            delete updated[id]
            return { supplies: updated }
          }

          return { supplies: { ...state.supplies, [id]: next } }
        }),

      /**
       * Alias legacy usado por nodos del flow.
       *
       * @param id Item supply
       * @param amount Cantidad
       */
      updateSupply: (id, amount) => get().setSupplyAmount(id, amount),

      /**
       * Agrega un supply si no existe.
       *
       * @param id Item supply
       */
      addSupplyNode: (id) =>
        set((state) => ({
          supplies: { ...state.supplies, [id]: state.supplies[id] || 0 },
        })),

      /**
       * Elimina completamente un supply.
       *
       * @param id Item supply
       */
      removeSupply: (id) =>
        set((state) => {
          const newSupplies = { ...state.supplies }
          delete newSupplies[id]
          return { supplies: newSupplies }
        }),
    }),
    {
      name: 'zstore.planner',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

