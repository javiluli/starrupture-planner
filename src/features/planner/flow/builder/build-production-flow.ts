import type { Node, Edge } from '@xyflow/react'
import type { Building } from '@/shared/@types/building.type'
import type { Item } from '@/shared/@types/item.type'
import { buildProductionPlan } from '@/features/planner/lib/production-plan'
import { planToFlow } from '@/features/planner/flow/plan-to-flow'

export interface FlowBuildParams {
  /** Lista de items del juego (nombre ya traducido). */
  items: Item[]
  /** Lista de edificios con recetas. */
  buildings: Building[]
  /** Id del item objetivo a producir. */
  targetId: string
  /** Tasa objetivo en items por minuto. */
  targetIpm: number
  /** Inventario de suministros externos. */
  supplyCountByItem: Record<string, number>
  /** Indica si hay exportacion orbital. */
  isExportable: boolean
  /** Callback para actualizar supply desde nodos. */
  setSupplyCount: (id: string, val: number) => void
}

export interface FlowBuildResult {
  nodes: Node[]
  edges: Edge[]
  stats: ReturnType<typeof buildProductionPlan>['stats']
}

/**
 * API publica para construir el flujo completo y sus stats.
 *
 * Nota: contiene el layout completo para evitar pasos intermedios.
 *
 * @param params.items Lista de items del juego.
 * @param params.buildings Lista de edificios con recetas.
 * @param params.targetId Id del item objetivo.
 * @param params.targetIpm Produccion objetivo por minuto.
 * @param params.supplyCountByItem Suministros externos por item.
 * @param params.isExportable Si se agrega exportacion orbital.
 * @param params.setSupplyCount Callback para actualizar supply desde nodos.
 * @returns Nodos, edges y stats calculadas.
 */
export const buildProductionFlow = ({
  items,
  buildings,
  targetId,
  targetIpm,
  supplyCountByItem,
  isExportable,
  setSupplyCount,
}: FlowBuildParams): FlowBuildResult => {
  const plan = buildProductionPlan({
    buildings,
    targetId,
    targetIpm,
    supplyCountByItem,
    isExportable,
  })

  const { nodes, edges } = planToFlow({
    plan,
    items,
    buildings,
    setSupplyCount,
  })

  return {
    nodes,
    edges,
    stats: plan.stats,
  }
}
