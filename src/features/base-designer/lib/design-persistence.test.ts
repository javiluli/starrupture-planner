import type { Building } from '@/shared/@types/building.type'
import { describe, expect, it } from 'vitest'
import { createBuildingNode } from './create-building-node'
import { createInitialBaseDesignerNodes } from './create-initial-nodes'
import {
  BASE_DESIGNER_STORAGE_VERSION,
  migrateBaseDesignerPersistedState,
  restoreBaseDesignerDesign,
  serializeBaseDesignerDesign,
} from './design-persistence'

const buildings = [
  {
    id: 'smelter',
    name: 'Smelter',
    type: 'production',
    power: 5,
    heat: 3,
    recipes: [{ output: { id: 'bar', amount_per_minute: 60 }, inputs: [{ id: 'ore', amount_per_minute: 60 }] }],
  },
  {
    id: 'fabricator',
    name: 'Fabricator',
    type: 'production',
    power: 10,
    heat: 5,
    recipes: [{ output: { id: 'part', amount_per_minute: 30 }, inputs: [{ id: 'bar', amount_per_minute: 30 }] }],
  },
] satisfies Building[]

const createRuntimeDesign = () => {
  const source = createBuildingNode({
    building: buildings[0],
    absolutePosition: { x: 120, y: 120 },
    instanceId: 'source',
  })
  const target = createBuildingNode({
    building: buildings[1],
    absolutePosition: { x: 240, y: 120 },
    instanceId: 'target',
  })
  source.data.selectedRecipeOutputId = 'bar'

  return {
    nodes: [...createInitialBaseDesignerNodes(), source, target],
    edges: [
      {
        id: 'edge-1',
        source: source.id,
        target: target.id,
        sourceHandle: 'item-output',
        targetHandle: 'item-input',
      },
    ],
  }
}

describe('base designer persistence', () => {
  it('serializes only editable buildings and their connections', () => {
    const runtime = createRuntimeDesign()
    const design = serializeBaseDesignerDesign(runtime.nodes, runtime.edges)

    expect(design.buildings).toEqual([
      {
        instanceId: 'source',
        buildingId: 'smelter',
        position: { x: 100, y: 100 },
        selectedRecipeOutputId: 'bar',
      },
      {
        instanceId: 'target',
        buildingId: 'fabricator',
        position: { x: 220, y: 100 },
      },
    ])
    expect(design.connections).toEqual([
      {
        sourceInstanceId: 'source',
        targetInstanceId: 'target',
        sourceHandle: 'item-output',
        targetHandle: 'item-input',
      },
    ])
  })

  it('restores runtime nodes from current catalog data', () => {
    const runtime = createRuntimeDesign()
    const restored = restoreBaseDesignerDesign(serializeBaseDesignerDesign(runtime.nodes, runtime.edges), buildings)

    expect(restored.nodes).toHaveLength(4)
    expect(restored.nodes.find((node) => node.id === 'building:source')).toMatchObject({
      position: { x: 100, y: 100 },
      data: { label: 'Smelter', selectedRecipeOutputId: 'bar' },
    })
    expect(restored.edges).toHaveLength(1)
    expect(restored.edges[0].data).toEqual({ compatibleItemIds: ['bar'], itemId: 'bar' })
  })

  it('drops missing catalog entries and invalid orphan connections', () => {
    const restored = restoreBaseDesignerDesign(
      {
        buildings: [{ instanceId: 'missing', buildingId: 'removed', position: { x: 20, y: 20 } }],
        connections: [
          {
            sourceInstanceId: 'missing',
            targetInstanceId: 'other',
            sourceHandle: 'item-output',
            targetHandle: 'item-input',
          },
        ],
      },
      buildings,
    )

    expect(restored.nodes).toHaveLength(2)
    expect(restored.edges).toEqual([])
  })

  it('migrates a legacy runtime snapshot into the V1 design DTO', () => {
    const runtime = createRuntimeDesign()
    const migrated = migrateBaseDesignerPersistedState(runtime, 0)

    expect(migrated.design.buildings).toHaveLength(2)
    expect(migrated.design.connections).toHaveLength(1)
    expect(migrateBaseDesignerPersistedState(migrated, BASE_DESIGNER_STORAGE_VERSION)).toEqual(migrated)
  })
})
