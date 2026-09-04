import type { ProductionPlan } from '@/features/planner/lib/production-plan'
import type { Building } from '@/shared/@types/building.type'
import type { Item } from '@/shared/@types/item.type'
import { describe, expect, it } from 'vitest'
import { planToFlow } from './plan-to-flow'

const NODE_WIDTH = 260
const NODE_HEIGHT = 350

const items: Item[] = [
  { id: 'plate', name: 'Plate', type: 'processed' },
  { id: 'ingot', name: 'Ingot', type: 'processed' },
  { id: 'wire', name: 'Wire', type: 'component' },
  { id: 'ore', name: 'Ore', type: 'raw' },
  { id: 'copper', name: 'Copper', type: 'raw' },
]

const buildings: Building[] = [{ id: 'package_receiver', name: 'Package Receiver', power: 1, heat: 1, type: 'transport', recipes: [] }]

const plan: ProductionPlan = {
  targetId: 'plate',
  targetIpm: 10,
  supplyCountByItem: { ore: 40, copper: 20 },
  supplyCountInventory: { ore: 40, copper: 20 },
  isExportable: false,
  steps: [
    {
      itemId: 'plate',
      buildingId: 'assembler',
      buildingName: 'Assembler',
      recipeOutputIpm: 10,
      targetIpm: 10,
      buildingLoad: 1,
      buildingCount: 1,
      buildingPower: 10,
      buildingHeat: 4,
      supplyCount: 0,
      inputs: [
        { id: 'ingot', amount_per_minute: 20 },
        { id: 'wire', amount_per_minute: 10 },
      ],
    },
    {
      itemId: 'ingot',
      buildingId: 'smelter',
      buildingName: 'Smelter',
      recipeOutputIpm: 20,
      targetIpm: 20,
      buildingLoad: 1,
      buildingCount: 1,
      buildingPower: 5,
      buildingHeat: 2,
      supplyCount: 0,
      inputs: [{ id: 'ore', amount_per_minute: 40 }],
    },
    {
      itemId: 'wire',
      buildingId: 'wire_mill',
      buildingName: 'Wire Mill',
      recipeOutputIpm: 10,
      targetIpm: 10,
      buildingLoad: 1,
      buildingCount: 1,
      buildingPower: 5,
      buildingHeat: 2,
      supplyCount: 0,
      inputs: [{ id: 'copper', amount_per_minute: 20 }],
    },
  ],
  stats: { buildings: 3, power: 20, heat: 8 },
}

const rectanglesOverlap = (first: { position: { x: number; y: number } }, second: { position: { x: number; y: number } }) =>
  first.position.x < second.position.x + NODE_WIDTH &&
  first.position.x + NODE_WIDTH > second.position.x &&
  first.position.y < second.position.y + NODE_HEIGHT &&
  first.position.y + NODE_HEIGHT > second.position.y

describe('planToFlow layout', () => {
  it('keeps the production graph connected, left-to-right and without overlapping nodes', () => {
    const { nodes, edges } = planToFlow({ plan, items, buildings, setSupplyCount: () => undefined })
    const nodeById = new Map(nodes.map((node) => [node.id, node]))

    expect(new Set(nodes.map((node) => node.id))).toEqual(new Set(['plate', 'ingot', 'wire', 'supply-ore', 'supply-copper']))
    expect(new Set(edges.map((edge) => `${edge.source}->${edge.target}`))).toEqual(
      new Set(['ingot->plate', 'wire->plate', 'supply-ore->ingot', 'supply-copper->wire']),
    )

    nodes.forEach((node) => {
      expect(Number.isFinite(node.position.x)).toBe(true)
      expect(Number.isFinite(node.position.y)).toBe(true)
    })

    edges.forEach((edge) => {
      expect(nodeById.get(edge.source)?.position.x).toBeLessThan(nodeById.get(edge.target)?.position.x ?? Number.NEGATIVE_INFINITY)
    })

    nodes.forEach((node, index) => {
      nodes.slice(index + 1).forEach((otherNode) => {
        expect(rectanglesOverlap(node, otherNode), `${node.id} overlaps ${otherNode.id}`).toBe(false)
      })
    })
  })
})
