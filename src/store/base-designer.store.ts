import { BASE_DESIGNER_FLOW_COLORS } from '@/features/base-designer/base-designer.config'
import { evaluateBaseDesignerConnection } from '@/features/base-designer/lib/connection-validation'
import { areChangedBuildingPositionsAvailable, isBuildingNodePlacementAvailable } from '@/features/base-designer/lib/building-collision'
import { createInitialBaseDesignerNodes } from '@/features/base-designer/lib/create-initial-nodes'
import {
  BASE_DESIGNER_STORAGE_KEY,
  BASE_DESIGNER_STORAGE_VERSION,
  migrateBaseDesignerPersistedState,
  restoreBaseDesignerDesign,
  serializeBaseDesignerDesign,
  type BaseDesignerPersistedStateV1,
} from '@/features/base-designer/lib/design-persistence'
import {
  captureBaseDesignerSnapshot,
  duplicateSelectedBuildingNodes,
  EMPTY_BASE_DESIGNER_HISTORY,
  haveNodePositionsChanged,
  pushBaseDesignerHistory,
  redoBaseDesignerHistory,
  removeSelectedBaseDesignerElements,
  undoBaseDesignerHistory,
  type BaseDesignerHistory,
} from '@/features/base-designer/lib/editor-operations'
import { createBaseDesignerStateStorage } from '@/features/base-designer/lib/design-storage'
import type { BaseDesignerBuildingNode, BaseDesignerEdge, BaseDesignerNode } from '@/features/base-designer/types'
import { buildings } from '@/shared/data'
import { addEdge, applyEdgeChanges, applyNodeChanges, type Connection, type EdgeChange, type NodeChange } from '@xyflow/react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface BaseDesignerStoreState {
  nodes: BaseDesignerNode[]
  edges: BaseDesignerEdge[]
  history: BaseDesignerHistory
  addBuildingNode: (node: BaseDesignerBuildingNode) => void
  applyNodeChanges: (changes: NodeChange<BaseDesignerNode>[]) => void
  applyEdgeChanges: (changes: EdgeChange<BaseDesignerEdge>[]) => void
  connectNodes: (connection: Connection) => void
  undo: () => void
  redo: () => void
  clearDesign: () => void
  selectAllBuildings: () => void
  clearSelection: () => void
  deleteSelection: () => void
  duplicateSelectedBuildings: () => void
}

export const baseDesignerSelectors = {
  nodes: (state: BaseDesignerStoreState) => state.nodes,
  edges: (state: BaseDesignerStoreState) => state.edges,
  buildingIdsKey: (state: BaseDesignerStoreState) =>
    state.nodes
      .flatMap((node) => (node.data.kind === 'building' ? [node.data.buildingId] : []))
      .sort()
      .join('|'),
  canUndo: (state: BaseDesignerStoreState) => state.history.past.length > 0,
  canRedo: (state: BaseDesignerStoreState) => state.history.future.length > 0,
  hasBuildings: (state: BaseDesignerStoreState) => state.nodes.some((node) => node.data.kind === 'building'),
  selectedBuildingCount: (state: BaseDesignerStoreState) =>
    state.nodes.filter((node) => node.data.kind === 'building' && Boolean(node.selected)).length,
  selectedEdgeCount: (state: BaseDesignerStoreState) => state.edges.filter((edge) => Boolean(edge.selected)).length,
  addBuildingNode: (state: BaseDesignerStoreState) => state.addBuildingNode,
  applyNodeChanges: (state: BaseDesignerStoreState) => state.applyNodeChanges,
  applyEdgeChanges: (state: BaseDesignerStoreState) => state.applyEdgeChanges,
  connectNodes: (state: BaseDesignerStoreState) => state.connectNodes,
  undo: (state: BaseDesignerStoreState) => state.undo,
  redo: (state: BaseDesignerStoreState) => state.redo,
  clearDesign: (state: BaseDesignerStoreState) => state.clearDesign,
  selectAllBuildings: (state: BaseDesignerStoreState) => state.selectAllBuildings,
  clearSelection: (state: BaseDesignerStoreState) => state.clearSelection,
  deleteSelection: (state: BaseDesignerStoreState) => state.deleteSelection,
  duplicateSelectedBuildings: (state: BaseDesignerStoreState) => state.duplicateSelectedBuildings,
}

const createInstanceId = () => crypto.randomUUID()
const captureCurrentState = (state: BaseDesignerStoreState) => captureBaseDesignerSnapshot(state.nodes, state.edges)
const commitHistory = (state: BaseDesignerStoreState) =>
  pushBaseDesignerHistory(state.history, state.history.dragStart ?? captureCurrentState(state))

const hasRecordableNodeChange = (changes: NodeChange<BaseDesignerNode>[]) =>
  changes.some(
    (change) =>
      change.type === 'add' ||
      change.type === 'remove' ||
      change.type === 'replace' ||
      (change.type === 'position' && change.dragging !== true),
  )

const hasRecordableEdgeChange = (changes: EdgeChange<BaseDesignerEdge>[]) =>
  changes.some((change) => change.type === 'add' || change.type === 'remove' || change.type === 'replace')

/**
 * Source of truth for the controlled base editor.
 * Runtime nodes and edges live here; storage keeps a minimal versioned design DTO.
 */
export const useBaseDesignerStore = create<BaseDesignerStoreState>()(
  persist<BaseDesignerStoreState, [], [], BaseDesignerPersistedStateV1>(
    (set) => ({
      nodes: createInitialBaseDesignerNodes(),
      edges: [],
      history: EMPTY_BASE_DESIGNER_HISTORY,
      addBuildingNode: (node) =>
        set((state) => {
          if (!isBuildingNodePlacementAvailable(node, state.nodes)) return state

          return {
            nodes: [...state.nodes, node],
            history: commitHistory(state),
          }
        }),
      applyNodeChanges: (changes) =>
        set((state) => {
          const candidateNodes = applyNodeChanges(changes, state.nodes)
          const changedPositionIds = new Set(changes.flatMap((change) => (change.type === 'position' ? [change.id] : [])))
          const positionsAreAvailable = areChangedBuildingPositionsAvailable(candidateNodes, changedPositionIds)
          const appliedChanges = positionsAreAvailable ? changes : changes.filter((change) => change.type !== 'position')
          const nodes = positionsAreAvailable ? candidateNodes : applyNodeChanges(appliedChanges, state.nodes)
          const removedNodeIds = new Set(appliedChanges.flatMap((change) => (change.type === 'remove' ? [change.id] : [])))
          const edges =
            removedNodeIds.size > 0
              ? state.edges.filter((edge) => !removedNodeIds.has(edge.source) && !removedNodeIds.has(edge.target))
              : state.edges
          const isDragging = changes.some((change) => change.type === 'position' && change.dragging === true)
          const dragFinished = changes.some((change) => change.type === 'position' && change.dragging === false)

          if (isDragging) {
            return {
              nodes,
              history: state.history.dragStart ? state.history : { ...state.history, dragStart: captureCurrentState(state) },
            }
          }

          if (dragFinished && state.history.dragStart) {
            const history = haveNodePositionsChanged(state.history.dragStart, nodes)
              ? pushBaseDesignerHistory(state.history, state.history.dragStart)
              : { ...state.history, dragStart: undefined }

            return { nodes, history }
          }

          return {
            nodes,
            ...(edges !== state.edges ? { edges } : {}),
            ...(hasRecordableNodeChange(appliedChanges) ? { history: commitHistory(state) } : {}),
          }
        }),
      applyEdgeChanges: (changes) =>
        set((state) => {
          const edges = applyEdgeChanges(changes, state.edges)
          const didChange = edges.length !== state.edges.length || edges.some((edge, index) => edge !== state.edges[index])

          return {
            edges,
            ...(didChange && hasRecordableEdgeChange(changes) ? { history: commitHistory(state) } : {}),
          }
        }),
      connectNodes: (connection) =>
        set((state) => {
          const validation = evaluateBaseDesignerConnection({ connection, nodes: state.nodes, edges: state.edges })
          if (!validation.isValid) return state

          return {
            edges: addEdge(
              {
                ...connection,
                type: 'smoothstep',
                data: {
                  compatibleItemIds: validation.compatibleItemIds,
                  ...(validation.compatibleItemIds.length === 1 ? { itemId: validation.compatibleItemIds[0] } : {}),
                },
                style: { stroke: BASE_DESIGNER_FLOW_COLORS.edge, strokeWidth: 2 },
              },
              state.edges,
            ),
            history: commitHistory(state),
          }
        }),
      undo: () =>
        set((state) => {
          const result = undoBaseDesignerHistory(state.history, captureCurrentState(state))
          return result ? { ...result.snapshot, history: result.history } : state
        }),
      redo: () =>
        set((state) => {
          const result = redoBaseDesignerHistory(state.history, captureCurrentState(state))
          return result ? { ...result.snapshot, history: result.history } : state
        }),
      clearDesign: () =>
        set((state) => {
          if (!state.nodes.some((node) => node.data.kind === 'building') && state.edges.length === 0) return state

          return {
            nodes: createInitialBaseDesignerNodes(),
            edges: [],
            history: commitHistory(state),
          }
        }),
      selectAllBuildings: () =>
        set((state) => {
          const hasUnselectedBuilding = state.nodes.some((node) => node.data.kind === 'building' && !node.selected)
          const hasSelectedNonBuilding = state.nodes.some((node) => node.data.kind !== 'building' && node.selected)
          const hasSelectedEdge = state.edges.some((edge) => edge.selected)
          if (!hasUnselectedBuilding && !hasSelectedNonBuilding && !hasSelectedEdge) return state

          return {
            nodes: state.nodes.map((node) => ({ ...node, selected: node.data.kind === 'building' })),
            edges: state.edges.map((edge) => (edge.selected ? { ...edge, selected: false } : edge)),
          }
        }),
      clearSelection: () =>
        set((state) => {
          const hasSelectedNode = state.nodes.some((node) => node.selected)
          const hasSelectedEdge = state.edges.some((edge) => edge.selected)
          if (!hasSelectedNode && !hasSelectedEdge) return state

          return {
            nodes: state.nodes.map((node) => (node.selected ? { ...node, selected: false } : node)),
            edges: state.edges.map((edge) => (edge.selected ? { ...edge, selected: false } : edge)),
          }
        }),
      deleteSelection: () =>
        set((state) => {
          const snapshot = removeSelectedBaseDesignerElements(state.nodes, state.edges)
          return snapshot ? { ...snapshot, history: commitHistory(state) } : state
        }),
      duplicateSelectedBuildings: () =>
        set((state) => {
          const nodes = duplicateSelectedBuildingNodes(state.nodes, createInstanceId)
          return nodes ? { nodes, history: commitHistory(state) } : state
        }),
    }),
    {
      name: BASE_DESIGNER_STORAGE_KEY,
      version: BASE_DESIGNER_STORAGE_VERSION,
      storage: createJSONStorage(() => createBaseDesignerStateStorage()),
      partialize: (state) => ({ design: serializeBaseDesignerDesign(state.nodes, state.edges) }),
      migrate: migrateBaseDesignerPersistedState,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...restoreBaseDesignerDesign(migrateBaseDesignerPersistedState(persistedState, BASE_DESIGNER_STORAGE_VERSION).design, buildings),
        history: EMPTY_BASE_DESIGNER_HISTORY,
      }),
    },
  ),
)
