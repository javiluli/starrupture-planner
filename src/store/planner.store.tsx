import type { Stats } from '@/types/production'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useDataStore } from './data.store'

interface PlannerStoreState {
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
  addSupplyNode: (itemId: string) => void
  removeSupply: (itemId: string) => void
  isItemExportableToCorporation: (itemId: string) => boolean
}

/**
 * Store central para la planificación de producción.
 * Gestiona el ítem objetivo, la cantidad deseada y las estadísticas globales.
 */
export const usePlannerStore = create<PlannerStoreState>()(
  persist(
    (set) => ({
      // DATOS INICIALES
      targetId: '',
      targetIpm: 1,
      plannerStats: { buildings: 0, power: 0, heat: 0 },
      supplies: {},

      /**
       * Actualiza el ítem que se quiere fabricar.
       * Al seleccionar uno nuevo, calcula automáticamente la producción de 1 máquina.
       */
      setTargetId: (id: string) => {
        // Si el usuario limpia la selección
        if (!id) {
          set({
            targetId: '',
            targetIpm: 0,
            plannerStats: { buildings: 0, power: 0, heat: 0 },
          })
          return
        }

        // Buscamos la capacidad de la máquina para este ítem
        const { recipe } = getRecipeForItem(id)

        set({
          targetId: id,
          // Si encontramos la receta, ponemos su producción base (ej. Glass = 20)
          // Si no (caso raro), ponemos 1 por defecto
          targetIpm: recipe ? recipe.output.amount_per_minute : 1,
        })
      },

      /**
       * Actualiza la cantidad manual que el usuario desea producir.
       */
      setTargetIpm: (value: number) => {
        set({ targetIpm: value })
      },

      /**
       * Actualiza los totales de la fábrica (Energía, Calor, Máquinas).
       */
      setPlannerStats: (data: Stats) => {
        set((state) => ({
          plannerStats: {
            ...state.plannerStats,
            ...data,
          },
        }))
      },

      // ACTUALIZAR CUÁNTO TRAEMOS DE FUERA (El numerito del input)
      updateSupply: (id, amount) =>
        set((state) => ({
          supplies: { ...state.supplies, [id]: amount },
        })),

      // AÑADIR UN PAQUETE NUEVO AL MAPA (Aparece el nodo verde)
      addSupplyNode: (id) =>
        set((state) => ({
          supplies: { ...state.supplies, [id]: state.supplies[id] || 0 },
        })),

      // BORRAR EL PAQUETE (El nodo verde desaparece)
      removeSupply: (id) =>
        set((state) => {
          const newSupplies = { ...state.supplies }
          delete newSupplies[id]
          return { supplies: newSupplies }
        }),

      /**
       * Esta fucnion determina si el item seleccionado, lo requiere alguna "Corporation" como suministro de entrega
       *
       * @param itemId Item seleccionado para fabricar/exportar
       * @returns True si lo requiere, o false si no.
       */
      isItemExportableToCorporation: (itemId) => {
        const corporations = useDataStore.getState().corporations
        return Object.values(corporations).some((corp) => corp.levels.some((level) => level.components.some((comp) => comp.id === itemId)))
      },
    }),
    {
      name: 'zstore.planner',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

/**
 * UTILIDAD: Busca en el catálogo qué edificio y qué receta
 * corresponden a un ítem específico.
 */
// Helper fuera del store (puro) para evitar dependencias circulares complejas
const getRecipeForItem = (itemId: string) => {
  const buildings = useDataStore.getState().buildings
  const building = buildings.find((b) => b.recipes?.some((r) => r.output.id === itemId))
  const recipe = building?.recipes?.find((r) => r.output.id === itemId)
  return { building, recipe }
}
