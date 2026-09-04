import type { Building } from '@/shared/@types/building.type'
import { describe, expect, it } from 'vitest'
import { BASE_FIELD_NODE_ID } from '../base-designer.config'
import { createBuildingNode, findAvailableBuildingPosition } from './create-building-node'
import { createInitialBaseDesignerNodes } from './create-initial-nodes'

const smelter = {
  id: 'smelter',
  name: 'Smelter',
  type: 'production',
  power: 5,
  heat: 3,
  recipes: [
    {
      output: { id: 'bar', amount_per_minute: 60 },
      inputs: [{ id: 'ore', amount_per_minute: 60 }],
    },
  ],
} satisfies Building

describe('base designer node creation', () => {
  it('uses the game footprint, grid snapping and field parent', () => {
    const node = createBuildingNode({
      building: smelter,
      absolutePosition: { x: 103, y: 97 },
      instanceId: 'smelter-1',
    })

    expect(node).toMatchObject({
      id: 'building:smelter-1',
      parentId: BASE_FIELD_NODE_ID,
      position: { x: 80, y: 80 },
      style: { width: 40, height: 40 },
      data: { acceptsItems: true, suppliesItems: true },
    })
  })

  it('clamps nodes to the controlled field', () => {
    const node = createBuildingNode({
      building: smelter,
      absolutePosition: { x: 5000, y: -500 },
      instanceId: 'smelter-2',
    })

    expect(node.position).toEqual({ x: 980, y: 0 })
  })

  it('finds a free keyboard position without overlapping the Base Core', () => {
    const nodes = createInitialBaseDesignerNodes()
    expect(findAvailableBuildingPosition(nodes, smelter.id)).toEqual({ x: 20, y: 20 })
  })
})
