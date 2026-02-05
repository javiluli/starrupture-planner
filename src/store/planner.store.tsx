import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Building, Stats, Item, Recipe } from '../types/production'
import ITEMS_DATA from '@/data/items_catalog.json'
import BUILDINGS_DATA from '@/data/buildings_and_recipes.json'

interface PlannerStoreState {
  // Estado
  items: Item[]
  buildings: Building[]
  targetId: string
  targetIpm: number
  plannerStats: Stats
  supplies: Record<string, number>
  // Acciones
  setTargetId: (id: string) => void
  setTargetIpm: (value: number) => void
  setPlannerStats: (data: Stats) => void
  // Acciones para Suministros
  updateSupply: (itemId: string, amount: number) => void
  addSupplyNode: (itemId: string) => void
  removeSupply: (itemId: string) => void
  // Helpers (utilidades internas)
  getRecipeForItem: (itemId: string) => { building?: Building; recipe?: Recipe }
}

/**
 * Store central para la planificación de producción.
 * Gestiona el ítem objetivo, la cantidad deseada y las estadísticas globales.
 */
export const usePlannerStore = create<PlannerStoreState>()(
  persist(
    (set, get) => ({
      // DATOS INICIALES
      items: ITEMS_DATA as Item[],
      buildings: BUILDINGS_DATA as Building[],
      targetId: '',
      targetIpm: 1,
      plannerStats: { buildings: 0, power: 0, heat: 0 },
      supplies: {},

      /**
       * UTILIDAD: Busca en el catálogo qué edificio y qué receta
       * corresponden a un ítem específico.
       */
      getRecipeForItem: (itemId: string) => {
        const buildings = get().buildings
        const building = buildings.find((b) => b.recipes?.some((r) => r.output.id === itemId))
        const recipe = building?.recipes?.find((r) => r.output.id === itemId)
        return { building, recipe }
      },

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
        const { recipe } = get().getRecipeForItem(id)

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
    }),
    {
      name: 'zstore.planner',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
