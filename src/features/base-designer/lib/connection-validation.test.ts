import type { BaseDesignerBuildingNode, BaseDesignerEdge, BaseDesignerRecipeProfile } from '../types'
import { describe, expect, it } from 'vitest'
import { evaluateBaseDesignerConnection, isBaseDesignerConnectionValid } from './connection-validation'

const createNode = (
  id: string,
  recipeProfiles: BaseDesignerRecipeProfile[],
  selectedRecipeOutputId?: string,
): BaseDesignerBuildingNode => ({
  id,
  type: 'building',
  position: { x: 0, y: 0 },
  data: {
    kind: 'building',
    buildingId: id,
    label: id,
    buildingType: 'production',
    width: 40,
    height: 40,
    suppliesItems: recipeProfiles.length > 0,
    acceptsItems: recipeProfiles.some((recipe) => recipe.inputItemIds.length > 0),
    recipeProfiles,
    selectedRecipeOutputId,
  },
})

const createConnection = (source: string, target: string) => ({
  source,
  target,
  sourceHandle: 'item-output',
  targetHandle: 'item-input',
})

const source = createNode('source', [
  { outputItemId: 'iron', inputItemIds: [] },
  { outputItemId: 'copper', inputItemIds: [] },
])
const target = createNode('target', [
  { outputItemId: 'plate', inputItemIds: ['iron'] },
  { outputItemId: 'wire', inputItemIds: ['copper'] },
])
const connection = createConnection(source.id, target.id)

describe('evaluateBaseDesignerConnection', () => {
  it('returns every item compatible across available recipes', () => {
    expect(evaluateBaseDesignerConnection({ connection, nodes: [source, target], edges: [] })).toEqual({
      isValid: true,
      compatibleItemIds: ['copper', 'iron'],
    })
  })

  it('uses selected recipes to constrain source outputs and target inputs', () => {
    const selectedSource = createNode('source', source.data.recipeProfiles, 'copper')
    const incompatibleTarget = createNode('target', target.data.recipeProfiles, 'plate')
    const compatibleTarget = createNode('target', target.data.recipeProfiles, 'wire')

    expect(
      evaluateBaseDesignerConnection({ connection, nodes: [selectedSource, incompatibleTarget], edges: [] }),
    ).toEqual({ isValid: false, reason: 'incompatible-items' })
    expect(evaluateBaseDesignerConnection({ connection, nodes: [selectedSource, compatibleTarget], edges: [] })).toEqual({
      isValid: true,
      compatibleItemIds: ['copper'],
    })
  })

  it('rejects invalid handles, self links and duplicates', () => {
    expect(
      evaluateBaseDesignerConnection({
        connection: { ...connection, sourceHandle: 'wrong' },
        nodes: [source, target],
        edges: [],
      }),
    ).toEqual({ isValid: false, reason: 'invalid-handle' })
    expect(
      evaluateBaseDesignerConnection({
        connection: createConnection(source.id, source.id),
        nodes: [source, target],
        edges: [],
      }),
    ).toEqual({ isValid: false, reason: 'self-connection' })
    expect(
      evaluateBaseDesignerConnection({
        connection,
        nodes: [source, target],
        edges: [{ id: 'edge-1', ...connection }],
      }),
    ).toEqual({ isValid: false, reason: 'duplicate' })
  })

  it('rejects connections that would create a directed cycle', () => {
    const recipes = [{ outputItemId: 'shared', inputItemIds: ['shared'] }]
    const first = createNode('first', recipes)
    const second = createNode('second', recipes)
    const third = createNode('third', recipes)
    const edges: BaseDesignerEdge[] = [
      { id: 'first-second', ...createConnection(first.id, second.id) },
      { id: 'second-third', ...createConnection(second.id, third.id) },
    ]

    expect(
      evaluateBaseDesignerConnection({
        connection: createConnection(third.id, first.id),
        nodes: [first, second, third],
        edges,
      }),
    ).toEqual({ isValid: false, reason: 'cycle' })
  })

  it('keeps a boolean wrapper for React Flow isValidConnection', () => {
    expect(isBaseDesignerConnectionValid({ connection, nodes: [source, target], edges: [] })).toBe(true)
  })
})
