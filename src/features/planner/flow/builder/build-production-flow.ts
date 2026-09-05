import type { Node, Edge } from '@xyflow/react'
import type { Building } from '@/shared/@types/building.type'
import type { Item } from '@/shared/@types/item.type'
import { planToFlow } from '@/features/planner/flow/plan-to-flow'
import type { ProductionPlan } from '@/features/planner/lib/production-plan/types'

export interface FlowBuildParams {
  /** Lista de items del juego (nombre ya traducido). */
  items: readonly Item[]
  /** Lista de edificios con recetas. */
  buildings: readonly Building[]
  /** Plan de produccion ya calculado. */
  plan: ProductionPlan
  /** Callback para actualizar supply desde nodos. */
  setSupply: (id: string, val: number) => void
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
export const buildProductionFlowFromPlan = ({ plan, items, buildings, setSupply }: FlowBuildParams): FlowBuildResult => {
  const { nodes, edges } = planToFlow({
    plan,
    items,
    buildings,
    setSupply,
  })

  return {
    nodes,
    edges,
    stats: plan.stats,
  }
}
