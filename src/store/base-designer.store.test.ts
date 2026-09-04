/* @vitest-environment jsdom */

import type { BaseDesignerBuildingNode } from '@/features/base-designer/types'
import { createInitialBaseDesignerNodes } from '@/features/base-designer/lib/create-initial-nodes'
import { BASE_DESIGNER_STORAGE_KEY, BASE_DESIGNER_STORAGE_VERSION } from '@/features/base-designer/lib/design-persistence'
import { beforeEach, describe, expect, it } from 'vitest'
import { useBaseDesignerStore } from './base-designer.store'

const createNode = (id: string, suppliesItems: boolean, acceptsItems: boolean): BaseDesignerBuildingNode => ({
  id,
  type: 'building',
  position: { x: id === 'target' ? 80 : 20, y: 20 },
  data: {
    kind: 'building',
    buildingId: id,
    label: id,
    buildingType: 'production',
    width: 40,
    height: 40,
    suppliesItems,
    acceptsItems,
    recipeProfiles: suppliesItems ? [{ outputItemId: 'shared-item', inputItemIds: acceptsItems ? ['shared-item'] : [] }] : [],
  },
})

const resetStore = () => {
  localStorage.clear()
  useBaseDesignerStore.setState({ nodes: createInitialBaseDesignerNodes(), edges: [], history: { past: [], future: [] } })
}

describe('base designer store', () => {
  beforeEach(resetStore)

  it('adds controlled nodes and applies position changes', () => {
    const node = createNode('source', true, false)
    useBaseDesignerStore.getState().addBuildingNode(node)
    useBaseDesignerStore.getState().applyNodeChanges([{ id: node.id, type: 'position', position: { x: 80, y: 90 } }])

    expect(useBaseDesignerStore.getState().nodes.find((entry) => entry.id === node.id)?.position).toEqual({ x: 80, y: 90 })
  })

  it('rejects a building that overlaps an occupied footprint', () => {
    const first = createNode('first', true, false)
    const overlapping = createNode('second', true, false)

    useBaseDesignerStore.getState().addBuildingNode(first)
    useBaseDesignerStore.getState().addBuildingNode(overlapping)

    expect(useBaseDesignerStore.getState().nodes.filter((node) => node.data.kind === 'building')).toHaveLength(1)
  })

  it('rejects an overlapping drag without creating an empty history entry', () => {
    const source = createNode('source', true, false)
    const target = createNode('target', true, false)
    useBaseDesignerStore.getState().addBuildingNode(source)
    useBaseDesignerStore.getState().addBuildingNode(target)
    useBaseDesignerStore.setState({ history: { past: [], future: [] } })

    useBaseDesignerStore.getState().applyNodeChanges([{ id: target.id, type: 'position', position: { x: 40, y: 20 }, dragging: true }])
    useBaseDesignerStore.getState().applyNodeChanges([{ id: target.id, type: 'position', position: { x: 40, y: 20 }, dragging: false }])

    expect(useBaseDesignerStore.getState().nodes.find((node) => node.id === target.id)?.position).toEqual({ x: 80, y: 20 })
    expect(useBaseDesignerStore.getState().history.past).toEqual([])
  })
  it('creates only valid, non-duplicate connections', () => {
    const source = createNode('source', true, false)
    const target = createNode('target', true, true)
    const connection = { source: source.id, target: target.id, sourceHandle: 'item-output', targetHandle: 'item-input' }

    useBaseDesignerStore.getState().addBuildingNode(source)
    useBaseDesignerStore.getState().addBuildingNode(target)
    useBaseDesignerStore.getState().connectNodes(connection)
    useBaseDesignerStore.getState().connectNodes(connection)

    expect(useBaseDesignerStore.getState().edges).toHaveLength(1)
    expect(useBaseDesignerStore.getState().edges[0].data).toEqual({
      compatibleItemIds: ['shared-item'],
      itemId: 'shared-item',
    })
  })

  it('undoes and redoes one complete node drag as a single operation', () => {
    const node = createNode('source', true, false)
    useBaseDesignerStore.getState().addBuildingNode(node)
    useBaseDesignerStore.setState({ history: { past: [], future: [] } })

    useBaseDesignerStore.getState().applyNodeChanges([{ id: node.id, type: 'position', position: { x: 40, y: 40 }, dragging: true }])
    useBaseDesignerStore.getState().applyNodeChanges([{ id: node.id, type: 'position', position: { x: 60, y: 60 }, dragging: true }])
    useBaseDesignerStore.getState().applyNodeChanges([{ id: node.id, type: 'position', position: { x: 80, y: 80 }, dragging: false }])

    expect(useBaseDesignerStore.getState().history.past).toHaveLength(1)
    useBaseDesignerStore.getState().undo()
    expect(useBaseDesignerStore.getState().nodes.find((entry) => entry.id === node.id)?.position).toEqual({ x: 20, y: 20 })

    useBaseDesignerStore.getState().redo()
    expect(useBaseDesignerStore.getState().nodes.find((entry) => entry.id === node.id)?.position).toEqual({ x: 80, y: 80 })
  })

  it('moves multiple selected buildings as one undoable batch', () => {
    const source = { ...createNode('source', true, false), selected: true }
    const target = { ...createNode('target', true, false), selected: true }
    useBaseDesignerStore.getState().addBuildingNode(source)
    useBaseDesignerStore.getState().addBuildingNode(target)
    useBaseDesignerStore.setState({ history: { past: [], future: [] } })

    useBaseDesignerStore.getState().applyNodeChanges([
      { id: source.id, type: 'position', position: { x: 60, y: 60 }, dragging: true },
      { id: target.id, type: 'position', position: { x: 120, y: 60 }, dragging: true },
    ])
    useBaseDesignerStore.getState().applyNodeChanges([
      { id: source.id, type: 'position', position: { x: 60, y: 60 }, dragging: false },
      { id: target.id, type: 'position', position: { x: 120, y: 60 }, dragging: false },
    ])

    expect(useBaseDesignerStore.getState().history.past).toHaveLength(1)
    useBaseDesignerStore.getState().undo()
    expect(useBaseDesignerStore.getState().nodes.find((node) => node.id === source.id)?.position).toEqual({ x: 20, y: 20 })
    expect(useBaseDesignerStore.getState().nodes.find((node) => node.id === target.id)?.position).toEqual({ x: 80, y: 20 })
  })
  it('restores a deleted building and its connections with one undo', () => {
    const source = createNode('source', true, false)
    const target = createNode('target', true, true)
    useBaseDesignerStore.getState().addBuildingNode(source)
    useBaseDesignerStore.getState().addBuildingNode(target)
    useBaseDesignerStore.getState().connectNodes({
      source: source.id,
      target: target.id,
      sourceHandle: 'item-output',
      targetHandle: 'item-input',
    })
    const edgeId = useBaseDesignerStore.getState().edges[0].id
    useBaseDesignerStore.setState({ history: { past: [], future: [] } })

    useBaseDesignerStore.getState().applyNodeChanges([{ id: source.id, type: 'remove' }])
    useBaseDesignerStore.getState().applyEdgeChanges([{ id: edgeId, type: 'remove' }])

    expect(useBaseDesignerStore.getState().nodes.some((node) => node.id === source.id)).toBe(false)
    expect(useBaseDesignerStore.getState().edges).toEqual([])
    expect(useBaseDesignerStore.getState().history.past).toHaveLength(1)

    useBaseDesignerStore.getState().undo()
    expect(useBaseDesignerStore.getState().nodes.some((node) => node.id === source.id)).toBe(true)
    expect(useBaseDesignerStore.getState().edges).toHaveLength(1)
  })
  it('duplicates selected buildings as one undoable batch', () => {
    useBaseDesignerStore.getState().addBuildingNode({ ...createNode('source', true, false), selected: true })
    useBaseDesignerStore.getState().addBuildingNode({ ...createNode('target', true, false), selected: true })
    useBaseDesignerStore.setState({ history: { past: [], future: [] } })

    useBaseDesignerStore.getState().duplicateSelectedBuildings()

    const buildingNodes = useBaseDesignerStore.getState().nodes.filter((node) => node.data.kind === 'building')
    expect(buildingNodes).toHaveLength(4)
    expect(buildingNodes.filter((node) => node.selected)).toHaveLength(2)
    expect(useBaseDesignerStore.getState().history.past).toHaveLength(1)

    useBaseDesignerStore.getState().undo()
    expect(useBaseDesignerStore.getState().nodes.filter((node) => node.data.kind === 'building')).toHaveLength(2)
  })

  it('clears the design and restores it with undo', () => {
    useBaseDesignerStore.getState().addBuildingNode(createNode('source', true, false))
    useBaseDesignerStore.setState({ history: { past: [], future: [] } })

    useBaseDesignerStore.getState().clearDesign()
    expect(useBaseDesignerStore.getState().nodes).toHaveLength(2)

    useBaseDesignerStore.getState().undo()
    expect(useBaseDesignerStore.getState().nodes).toHaveLength(3)
  })
  it('persists a minimal versioned design payload', () => {
    useBaseDesignerStore.getState().addBuildingNode(createNode('source', true, false))

    const payload = JSON.parse(localStorage.getItem(BASE_DESIGNER_STORAGE_KEY) ?? '{}')
    expect(payload.version).toBe(BASE_DESIGNER_STORAGE_VERSION)
    expect(payload.state).toEqual({
      design: {
        buildings: [
          {
            instanceId: 'source',
            buildingId: 'source',
            position: { x: 20, y: 20 },
          },
        ],
        connections: [],
      },
    })
  })

  it('rehydrates persisted buildings through the current game catalog', async () => {
    localStorage.setItem(
      BASE_DESIGNER_STORAGE_KEY,
      JSON.stringify({
        version: BASE_DESIGNER_STORAGE_VERSION,
        state: {
          design: {
            buildings: [{ instanceId: 'persisted', buildingId: 'smelter', position: { x: 100, y: 120 } }],
            connections: [],
          },
        },
      }),
    )

    await useBaseDesignerStore.persist.rehydrate()

    expect(useBaseDesignerStore.getState().nodes.find((node) => node.id === 'building:persisted')).toMatchObject({
      position: { x: 100, y: 120 },
      data: { buildingId: 'smelter', label: 'Smelter' },
    })
  })
  it('resets editor input to its system nodes', () => {
    useBaseDesignerStore.getState().addBuildingNode(createNode('source', true, false))
    useBaseDesignerStore.getState().clearDesign()

    const state = useBaseDesignerStore.getState()
    expect(state.nodes).toHaveLength(2)
    expect(state.edges).toEqual([])
  })
  it('selects every building without selecting system nodes or edges', () => {
    const source = createNode('source', true, false)
    const target = createNode('target', true, true)
    useBaseDesignerStore.getState().addBuildingNode(source)
    useBaseDesignerStore.getState().addBuildingNode(target)
    useBaseDesignerStore.getState().connectNodes({
      source: source.id,
      target: target.id,
      sourceHandle: 'item-output',
      targetHandle: 'item-input',
    })
    useBaseDesignerStore.setState((state) => ({
      nodes: state.nodes.map((node) => ({ ...node, selected: node.data.kind !== 'building' })),
      edges: state.edges.map((edge) => ({ ...edge, selected: true })),
    }))

    useBaseDesignerStore.getState().selectAllBuildings()

    expect(
      useBaseDesignerStore
        .getState()
        .nodes.filter((node) => node.data.kind === 'building')
        .every((node) => node.selected),
    ).toBe(true)
    expect(
      useBaseDesignerStore
        .getState()
        .nodes.filter((node) => node.data.kind !== 'building')
        .some((node) => node.selected),
    ).toBe(false)
    expect(useBaseDesignerStore.getState().edges.some((edge) => edge.selected)).toBe(false)

    useBaseDesignerStore.getState().clearSelection()
    expect(useBaseDesignerStore.getState().nodes.some((node) => node.selected)).toBe(false)
  })

  it('deletes selected buildings and connected edges as one undoable operation', () => {
    const source = { ...createNode('source', true, false), selected: true }
    const target = createNode('target', true, true)
    useBaseDesignerStore.getState().addBuildingNode(source)
    useBaseDesignerStore.getState().addBuildingNode(target)
    useBaseDesignerStore.getState().connectNodes({
      source: source.id,
      target: target.id,
      sourceHandle: 'item-output',
      targetHandle: 'item-input',
    })
    useBaseDesignerStore.setState({ history: { past: [], future: [] } })

    useBaseDesignerStore.getState().deleteSelection()

    expect(useBaseDesignerStore.getState().nodes.some((node) => node.id === source.id)).toBe(false)
    expect(useBaseDesignerStore.getState().nodes.some((node) => node.id === target.id)).toBe(true)
    expect(useBaseDesignerStore.getState().nodes.filter((node) => node.data.kind !== 'building')).toHaveLength(2)
    expect(useBaseDesignerStore.getState().edges).toEqual([])
    expect(useBaseDesignerStore.getState().history.past).toHaveLength(1)

    useBaseDesignerStore.getState().undo()
    expect(useBaseDesignerStore.getState().nodes.some((node) => node.id === source.id)).toBe(true)
    expect(useBaseDesignerStore.getState().edges).toHaveLength(1)
  })

  it('deletes a selected edge without removing its buildings', () => {
    const source = createNode('source', true, false)
    const target = createNode('target', true, true)
    useBaseDesignerStore.getState().addBuildingNode(source)
    useBaseDesignerStore.getState().addBuildingNode(target)
    useBaseDesignerStore.getState().connectNodes({
      source: source.id,
      target: target.id,
      sourceHandle: 'item-output',
      targetHandle: 'item-input',
    })
    useBaseDesignerStore.setState((state) => ({
      edges: state.edges.map((edge) => ({ ...edge, selected: true })),
      history: { past: [], future: [] },
    }))

    useBaseDesignerStore.getState().deleteSelection()

    expect(useBaseDesignerStore.getState().nodes.filter((node) => node.data.kind === 'building')).toHaveLength(2)
    expect(useBaseDesignerStore.getState().edges).toEqual([])
  })
})
