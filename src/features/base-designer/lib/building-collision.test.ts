import type { BaseDesignerBuildingNode, BaseDesignerNode } from '../types'
import { describe, expect, it } from 'vitest'
import {
  areChangedBuildingPositionsAvailable,
  doBuildingRectsOverlap,
  findNearestAvailableBuildingPosition,
  isBuildingAreaAvailable,
} from './building-collision'

const createBuildingNode = (id: string, x: number, y: number, width = 40, height = 40): BaseDesignerBuildingNode => ({
  id,
  type: 'building',
  position: { x, y },
  data: {
    kind: 'building',
    buildingId: id,
    label: id,
    buildingType: 'production',
    width,
    height,
    acceptsItems: false,
    suppliesItems: false,
    recipeProfiles: [],
  },
})

const nodes: BaseDesignerNode[] = [createBuildingNode('first', 0, 0)]

describe('base designer building collision', () => {
  it('allows touching borders but rejects intersecting footprints', () => {
    expect(
      doBuildingRectsOverlap({ position: { x: 0, y: 0 }, width: 40, height: 40 }, { position: { x: 40, y: 0 }, width: 40, height: 40 }),
    ).toBe(false)
    expect(
      doBuildingRectsOverlap({ position: { x: 0, y: 0 }, width: 40, height: 40 }, { position: { x: 30, y: 0 }, width: 40, height: 40 }),
    ).toBe(true)
  })

  it('checks placements against occupied building areas', () => {
    expect(isBuildingAreaAvailable({ position: { x: 40, y: 0 }, width: 40, height: 40 }, nodes)).toBe(true)
    expect(isBuildingAreaAvailable({ position: { x: 20, y: 0 }, width: 40, height: 40 }, nodes)).toBe(false)
  })

  it('validates all changed nodes in a multi-node movement', () => {
    const movedNodes: BaseDesignerNode[] = [createBuildingNode('first', 0, 0), createBuildingNode('second', 20, 0)]

    expect(areChangedBuildingPositionsAvailable(movedNodes, new Set(['second']))).toBe(false)
    expect(areChangedBuildingPositionsAvailable(movedNodes, new Set())).toBe(true)
  })

  it('finds the nearest free grid position to the requested point', () => {
    expect(findNearestAvailableBuildingPosition(nodes, { width: 40, height: 40 }, { x: 10, y: 0 })).toEqual({ x: 40, y: 0 })
  })
})
