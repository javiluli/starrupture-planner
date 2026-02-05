import type { Building, Item } from '@/types/production'
import { type Edge } from '@xyflow/react'
import dagre from 'dagre'

/**
 * CONSTRUCTOR DE CONEXIONES (LOGÍSTICA)
 * Analiza las recetas de entrada y decide de dónde viene cada material necesario.
 */
export const buildEdges = (
  targetId: string,
  targetIpm: number,
  totals: Map<string, number>,
  supplies: Record<string, number>,
  buildings: Building[],
  items: Item[],
  addOrgitalExportSystem: boolean,
  getItemColor: (id: string) => string,
  dagreGraph: dagre.graphlib.Graph,
): Edge[] => {
  const edges: Edge[] = []

  totals.forEach((qty, id) => {
    const supplyAmount = supplies[id] || 0
    const netQty = Math.max(0, qty - supplyAmount)

    // Condición de parada: No tiramos cables si el nodo no existe (salvo el target final)
    if (netQty <= 0 && id !== targetId) return

    const b = buildings.find((b) => b.recipes?.some((r) => r.output.id === id))
    const r = b?.recipes?.find((r) => r.output.id === id)
    if (!r) return

    r.inputs?.forEach((input) => {
      // Necesidad proporcional: (Cantidad_Receta / Salida_Receta) * Demanda_Neta_Actual
      const inputTotalNeeded = (input.amount_per_minute / r.output.amount_per_minute) * netQty
      if (inputTotalNeeded <= 0) return

      /**
       * FLUJO DE SUMINISTRO EXTERNO (Input -> Máquina)
       * Color: Verde esmeralda (#22c55e)
       * Estilo: Punteado animado (indica material que no se produce in-situ)
       */
      if (supplies[input.id] !== undefined) {
        const amountFromSupply = Math.min(supplies[input.id], inputTotalNeeded)

        edges.push({
          id: `e-supply-${input.id}-${id}`,
          source: `supply-${input.id}`,
          target: id,
          label: `${amountFromSupply.toFixed(1)}/m`,
          animated: true,
          style: { stroke: '#22c55e', strokeWidth: 3, strokeDasharray: '5, 5' },
          labelStyle: { fill: '#fff', fontSize: 16, fontWeight: 700 },
        })
        dagreGraph.setEdge(`supply-${input.id}`, id)
      }

      /**
       * FLUJO DE PRODUCCIÓN LOCAL (Máquina -> Máquina)
       * Color: Dinámico según ITEM_COLORS (basado en el tipo de ítem)
       * Estilo: Línea sólida
       */
      const inputProducedNet = Math.max(0, (totals.get(input.id) || 0) - (supplies[input.id] || 0))
      if (inputProducedNet > 0) {
        const amountFromProd = Math.min(inputProducedNet, inputTotalNeeded)
        edges.push({
          id: `e-${input.id}-${id}`,
          source: input.id,
          target: id,
          label: `${items.find((i) => i.id === input.id)?.name} x${amountFromProd.toFixed(1)}/m`,
          style: {
            stroke: getItemColor(input.id),
            strokeWidth: 3,
            opacity: 0.8,
          },
          labelStyle: { fill: '#fff', fontSize: 16, fontWeight: 700 },
        })
        // Registramos la relación en Dagre para jerarquizar los niveles (Ranks)
        dagreGraph.setEdge(input.id, id)
      }
    })
  })

  // CONEXIÓN FINAL: Del último proceso productivo al sistema de salida
  if (addOrgitalExportSystem) {
    // Si el objetivo final se cubre solo con supply, el cable sale del supply
    const finalSource = supplies[targetId] >= targetIpm ? `supply-${targetId}` : targetId
    const targetItemInfo = items.find((i) => i.id === targetId)

    edges.push({
      id: `e-final-launcher`,
      source: finalSource,
      target: 'terminal-launcher',
      label: `${targetItemInfo?.name} (${targetIpm.toFixed(1)}/min)`,
      style: { stroke: '#f97316', strokeWidth: 4 }, // Naranja vibrante para el output final
      labelStyle: { fill: '#fff', fontSize: 16, fontWeight: 700 },
    })
    dagreGraph.setEdge(finalSource, 'terminal-launcher')
  }

  return edges
}
