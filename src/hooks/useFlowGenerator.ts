import { type Edge, type Node } from '@xyflow/react'
import { useCallback } from 'react'
import { ITEM_COLORS, GRAPH_CONFIG } from '../constants/graph'
import BUILDINGS_DATA from '../data/buildings_and_recipes.json'
import ITEMS_DATA from '../data/items_catalog.json'
import { type Building, type Item } from '../types/production'

const buildings = BUILDINGS_DATA as Building[]
const itemsCatalog = ITEMS_DATA as Item[]

export const useFlowGenerator = () => {
  const generateFlow = useCallback(
    (
      targetId: string,
      targetIpm: number,
      supplies: Record<string, number>,
      calculateTotals: (id: string, qty: number, totals: Map<string, number>, supplyMap: Record<string, number>) => void,
      updateSupply: (itemId: string, amount: number) => void,
    ) => {
      const totals = new Map<string, number>()
      calculateTotals(targetId, targetIpm, totals, supplies)

      const levels: Record<string, number> = {}

      const traverse = (id: string, depth: number) => {
        if (!totals.has(id)) return
        levels[id] = Math.max(levels[id] || 0, depth)
        const b = buildings.find((b) => b.recipes?.some((r) => r.output.id === id))
        const r = b?.recipes?.find((r) => r.output.id === id)
        const netQty = Math.max(0, (totals.get(id) || 0) - (supplies[id] || 0))
        if (netQty > 0) {
          r?.inputs?.forEach((i) => traverse(i.id, depth + 1))
        }
      }
      traverse(targetId, 0)

      const levelsMap: Record<number, string[]> = {}
      Object.entries(levels).forEach(([id, lvl]) => {
        if (!levelsMap[lvl]) levelsMap[lvl] = []
        levelsMap[lvl].push(id)
      })

      const newNodes: Node[] = []
      const newEdges: Edge[] = []

      Object.keys(levelsMap).forEach((lvlStr) => {
        const lvl = parseInt(lvlStr)
        levelsMap[lvl].forEach((id, idx) => {
          const qty = totals.get(id) || 0
          // b = buildings
          const b = buildings.find((b) => b.recipes?.some((r) => r.output.id === id))
          // r = recipes
          const r = b?.recipes?.find((r) => r.output.id === id)

          // Buscamos el nombre del item en el catálogo
          const itemInfo = itemsCatalog.find((i) => i.id === id)

          if (!b || !r) return

          newNodes.push({
            id,
            type: 'productionNode',
            position: {
              x: GRAPH_CONFIG.X_START - lvl * GRAPH_CONFIG.X_GAP,
              y: idx * GRAPH_CONFIG.Y_GAP - ((levelsMap[lvl].length - 1) * GRAPH_CONFIG.Y_GAP) / 2 + GRAPH_CONFIG.Y_START,
            },
            data: {
              itemId: id,
              itemName: itemInfo?.name || id.replace(/_/g, ' '),
              buildingId: b.id,
              buildingName: b.name,
              count: Math.max(0, qty - (supplies[id] || 0)) / r.output.amount_per_minute,
              targetIpm: qty,
              supply: supplies[id],
              onSupplyChange: updateSupply,
            },
          })
        })
      })

      totals.forEach((qty, id) => {
        const b = buildings.find((b) => b.recipes?.some((r) => r.output.id === id))
        const r = b?.recipes?.find((r) => r.output.id === id)
        const netQty = Math.max(0, qty - (supplies[id] || 0))

        r?.inputs?.forEach((input) => {
          if (netQty > 0 && levels[input.id] !== undefined) {
            const flow = (input.amount_per_minute / r.output.amount_per_minute) * netQty
            const color = itemsCatalog.find((i) => i.id === input.id)?.type === 'raw' ? ITEM_COLORS.raw : ITEM_COLORS.processed
            newEdges.push({
              id: `e-${input.id}-${id}`,
              source: input.id,
              target: id,
              label: `${flow.toFixed(1)}/m`,
              style: { stroke: color, strokeWidth: 4, opacity: 0.6 },
              markerEnd: color,
            })
          }
        })
      })

      return { newNodes, newEdges }
    },
    [],
  )

  return { generateFlow }
}
