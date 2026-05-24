import type { Node, Edge } from '@xyflow/react'
import type { Building } from '@/shared/@types/building.type'
import type { Item } from '@/shared/@types/item.type'
import { planToFlow } from '@/features/planner/flow/plan-to-flow'
import type { ProductionPlan } from '@/features/planner/lib/production-plan/types'

export interface FlowBuildParams {
  /** Lista de items del juego (nombre ya traducido). */
  items: Item[]
  /** Lista de edificios con recetas. */
  buildings: Building[]
  /** Plan de produccion ya calculado. */
  plan: ProductionPlan
  /** Callback para actualizar supply desde nodos. */
  setSupplyCount: (id: string, val: number) => void
}

export interface FlowBuildResult {
  nodes: Node[]
  edges: Edge[]
  stats: ProductionPlan['stats']
}

/**
 * Construye el flujo a partir de un plan ya calculado.
 * Evita recalcular el plan cuando la UI muestra varias vistas.
 */
export const buildProductionFlowFromPlan = ({ plan, items, buildings, setSupplyCount }: FlowBuildParams): FlowBuildResult => {
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
