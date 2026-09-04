import type { Building } from '@/shared/@types/building.type'
import { BASE_DESIGNER_FLOW_COLORS } from '../base-designer.config'
import type { BaseDesignerBuildingNode, BaseDesignerEdge, BaseDesignerNode } from '../types'
import { isBuildingNodePlacementAvailable } from './building-collision'
import { createBuildingNode } from './create-building-node'
import { footprintToPixels, getBuildingFootprint } from './building-dimensions'
import { createInitialBaseDesignerNodes } from './create-initial-nodes'
import { evaluateBaseDesignerConnection } from './connection-validation'

const BUILDING_NODE_PREFIX = 'building:'

export const BASE_DESIGNER_STORAGE_KEY = 'zstore.base-designer'
export const BASE_DESIGNER_STORAGE_VERSION = 1

export interface PersistedBuildingV1 {
  instanceId: string
  buildingId: string
  position: { x: number; y: number }
  selectedRecipeOutputId?: string
}

export interface PersistedConnectionV1 {
  sourceInstanceId: string
  targetInstanceId: string
  sourceHandle: string | null
  targetHandle: string | null
}

export interface BaseDesignerDesignV1 {
  buildings: PersistedBuildingV1[]
  connections: PersistedConnectionV1[]
}

export interface BaseDesignerPersistedStateV1 {
  design: BaseDesignerDesignV1
}

const EMPTY_DESIGN: BaseDesignerDesignV1 = { buildings: [], connections: [] }
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
const getBuildingInstanceId = (nodeId: string) =>
  nodeId.startsWith(BUILDING_NODE_PREFIX) ? nodeId.slice(BUILDING_NODE_PREFIX.length) : nodeId
const getBuildingNodeId = (instanceId: string) => `${BUILDING_NODE_PREFIX}${instanceId}`

const normalizeBuilding = (value: unknown): PersistedBuildingV1 | undefined => {
  if (!isRecord(value) || !isRecord(value.position)) return undefined
  if (typeof value.instanceId !== 'string' || typeof value.buildingId !== 'string') return undefined
  if (!isFiniteNumber(value.position.x) || !isFiniteNumber(value.position.y)) return undefined

  return {
    instanceId: value.instanceId,
    buildingId: value.buildingId,
    position: { x: value.position.x, y: value.position.y },
    ...(typeof value.selectedRecipeOutputId === 'string'
      ? { selectedRecipeOutputId: value.selectedRecipeOutputId }
      : {}),
  }
}

const normalizeConnection = (value: unknown): PersistedConnectionV1 | undefined => {
  if (!isRecord(value)) return undefined
  if (typeof value.sourceInstanceId !== 'string' || typeof value.targetInstanceId !== 'string') return undefined

  return {
    sourceInstanceId: value.sourceInstanceId,
    targetInstanceId: value.targetInstanceId,
    sourceHandle: typeof value.sourceHandle === 'string' ? value.sourceHandle : null,
    targetHandle: typeof value.targetHandle === 'string' ? value.targetHandle : null,
  }
}

const normalizeDesign = (value: unknown): BaseDesignerDesignV1 => {
  if (!isRecord(value)) return EMPTY_DESIGN

  const buildings = Array.isArray(value.buildings)
    ? value.buildings.flatMap((building) => {
        const normalized = normalizeBuilding(building)
        return normalized ? [normalized] : []
      })
    : []
  const connections = Array.isArray(value.connections)
    ? value.connections.flatMap((connection) => {
        const normalized = normalizeConnection(connection)
        return normalized ? [normalized] : []
      })
    : []

  return { buildings, connections }
}

/** Serializes only user-owned design input; visual and catalog-derived node data stays out of storage. */
export const serializeBaseDesignerDesign = (
  nodes: BaseDesignerNode[],
  edges: BaseDesignerEdge[],
): BaseDesignerDesignV1 => {
  const buildingNodes = nodes.filter((node): node is BaseDesignerBuildingNode => node.data.kind === 'building')
  const instanceIdByNodeId = new Map(buildingNodes.map((node) => [node.id, getBuildingInstanceId(node.id)]))

  return {
    buildings: buildingNodes.map((node) => ({
      instanceId: getBuildingInstanceId(node.id),
      buildingId: node.data.buildingId,
      position: { x: node.position.x, y: node.position.y },
      ...(node.data.selectedRecipeOutputId ? { selectedRecipeOutputId: node.data.selectedRecipeOutputId } : {}),
    })),
    connections: edges.flatMap((edge) => {
      const sourceInstanceId = instanceIdByNodeId.get(edge.source)
      const targetInstanceId = instanceIdByNodeId.get(edge.target)
      if (!sourceInstanceId || !targetInstanceId) return []

      return [
        {
          sourceInstanceId,
          targetInstanceId,
          sourceHandle: edge.sourceHandle ?? null,
          targetHandle: edge.targetHandle ?? null,
        },
      ]
    }),
  }
}

/**
 * Rebuilds runtime React Flow nodes from the current game catalog.
 * Missing buildings and connections that are no longer valid are discarded safely.
 */
export const restoreBaseDesignerDesign = (
  input: unknown,
  buildings: Building[],
): { nodes: BaseDesignerNode[]; edges: BaseDesignerEdge[] } => {
  const design = normalizeDesign(input)
  const buildingById = new Map(buildings.map((building) => [building.id, building]))
  const usedInstanceIds = new Set<string>()
  const nodes: BaseDesignerNode[] = createInitialBaseDesignerNodes()

  for (const persistedBuilding of design.buildings) {
    const building = buildingById.get(persistedBuilding.buildingId)
    if (!building || usedInstanceIds.has(persistedBuilding.instanceId)) continue

    usedInstanceIds.add(persistedBuilding.instanceId)
    const size = footprintToPixels(getBuildingFootprint(building.id))
    const node = createBuildingNode({
      building,
      instanceId: persistedBuilding.instanceId,
      absolutePosition: {
        x: persistedBuilding.position.x + size.width / 2,
        y: persistedBuilding.position.y + size.height / 2,
      },
    })

    const selectedRecipeExists = building.recipes?.some(
      (recipe) => recipe.output.id === persistedBuilding.selectedRecipeOutputId,
    )
    if (selectedRecipeExists) node.data.selectedRecipeOutputId = persistedBuilding.selectedRecipeOutputId
    if (isBuildingNodePlacementAvailable(node, nodes)) nodes.push(node)
  }
  const edges: BaseDesignerEdge[] = []

  for (const connection of design.connections) {
    const candidate: BaseDesignerEdge = {
      id: `base-edge:${connection.sourceInstanceId}:${connection.targetInstanceId}:${connection.sourceHandle ?? ''}:${connection.targetHandle ?? ''}`,
      source: getBuildingNodeId(connection.sourceInstanceId),
      target: getBuildingNodeId(connection.targetInstanceId),
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'smoothstep',
      style: { stroke: BASE_DESIGNER_FLOW_COLORS.edge, strokeWidth: 2 },
    }

    const validation = evaluateBaseDesignerConnection({ connection: candidate, nodes, edges })
    if (validation.isValid) {
      candidate.data = {
        compatibleItemIds: validation.compatibleItemIds,
        ...(validation.compatibleItemIds.length === 1 ? { itemId: validation.compatibleItemIds[0] } : {}),
      }
      edges.push(candidate)
    }
  }

  return { nodes, edges }
}

/** Migrates persisted payloads without exposing legacy shapes to the runtime store. */
export const migrateBaseDesignerPersistedState = (
  persistedState: unknown,
  persistedVersion: number,
): BaseDesignerPersistedStateV1 => {
  if (persistedVersion === BASE_DESIGNER_STORAGE_VERSION && isRecord(persistedState)) {
    return { design: normalizeDesign(persistedState.design) }
  }

  if (persistedVersion === 0 && isRecord(persistedState)) {
    const legacyNodes = Array.isArray(persistedState.nodes)
      ? persistedState.nodes.filter(
          (node): node is BaseDesignerNode =>
            isRecord(node) &&
            typeof node.id === 'string' &&
            isRecord(node.position) &&
            isFiniteNumber(node.position.x) &&
            isFiniteNumber(node.position.y) &&
            isRecord(node.data) &&
            typeof node.data.kind === 'string',
        )
      : []
    const legacyEdges = Array.isArray(persistedState.edges)
      ? persistedState.edges.filter(
          (edge): edge is BaseDesignerEdge =>
            isRecord(edge) && typeof edge.id === 'string' && typeof edge.source === 'string' && typeof edge.target === 'string',
        )
      : []

    return { design: normalizeDesign(serializeBaseDesignerDesign(legacyNodes, legacyEdges)) }
  }

  return { design: EMPTY_DESIGN }
}
