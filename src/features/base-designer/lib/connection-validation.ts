import type { Connection, Edge } from '@xyflow/react'
import type { BaseDesignerEdge, BaseDesignerNode, BaseDesignerRecipeProfile } from '../types'

export type ConnectionRejectionReason =
  | 'missing-endpoint'
  | 'self-connection'
  | 'invalid-node-type'
  | 'invalid-handle'
  | 'unsupported-direction'
  | 'duplicate'
  | 'cycle'
  | 'incompatible-items'

export type ConnectionValidationResult =
  | { isValid: true; compatibleItemIds: string[] }
  | { isValid: false; reason: ConnectionRejectionReason }

interface ConnectionValidationOptions {
  connection: Connection | Edge
  nodes: BaseDesignerNode[]
  edges: BaseDesignerEdge[]
}

const getActiveRecipeProfiles = (
  recipeProfiles: BaseDesignerRecipeProfile[],
  selectedRecipeOutputId?: string,
) => {
  if (!selectedRecipeOutputId) return recipeProfiles
  return recipeProfiles.filter((recipe) => recipe.outputItemId === selectedRecipeOutputId)
}

const createsCycle = (sourceId: string, targetId: string, edges: BaseDesignerEdge[]) => {
  const targetsBySource = new Map<string, string[]>()
  for (const edge of edges) {
    const targets = targetsBySource.get(edge.source) ?? []
    targets.push(edge.target)
    targetsBySource.set(edge.source, targets)
  }

  const pending = [targetId]
  const visited = new Set<string>()
  while (pending.length > 0) {
    const current = pending.pop()
    if (!current || visited.has(current)) continue
    if (current === sourceId) return true

    visited.add(current)
    pending.push(...(targetsBySource.get(current) ?? []))
  }

  return false
}

/**
 * Evalua en una sola frontera las reglas estructurales y de recetas de una conexion.
 * Si no hay una receta seleccionada, considera todas las disponibles en el building.
 *
 * @returns Los items compatibles o un motivo estable por el que se rechaza el enlace.
 */
export const evaluateBaseDesignerConnection = ({
  connection,
  nodes,
  edges,
}: ConnectionValidationOptions): ConnectionValidationResult => {
  if (!connection.source || !connection.target) return { isValid: false, reason: 'missing-endpoint' }
  if (connection.source === connection.target) return { isValid: false, reason: 'self-connection' }
  if (connection.sourceHandle !== 'item-output' || connection.targetHandle !== 'item-input') {
    return { isValid: false, reason: 'invalid-handle' }
  }

  const source = nodes.find((node) => node.id === connection.source)
  const target = nodes.find((node) => node.id === connection.target)
  if (source?.data.kind !== 'building' || target?.data.kind !== 'building') {
    return { isValid: false, reason: 'invalid-node-type' }
  }
  if (!source.data.suppliesItems || !target.data.acceptsItems) {
    return { isValid: false, reason: 'unsupported-direction' }
  }

  const isDuplicate = edges.some(
    (edge) =>
      edge.source === connection.source &&
      edge.target === connection.target &&
      edge.sourceHandle === connection.sourceHandle &&
      edge.targetHandle === connection.targetHandle,
  )
  if (isDuplicate) return { isValid: false, reason: 'duplicate' }
  if (createsCycle(connection.source, connection.target, edges)) return { isValid: false, reason: 'cycle' }

  const sourceRecipes = getActiveRecipeProfiles(source.data.recipeProfiles, source.data.selectedRecipeOutputId)
  const targetRecipes = getActiveRecipeProfiles(target.data.recipeProfiles, target.data.selectedRecipeOutputId)
  const sourceOutputIds = new Set(sourceRecipes.map((recipe) => recipe.outputItemId))
  const targetInputIds = new Set(targetRecipes.flatMap((recipe) => recipe.inputItemIds))
  const compatibleItemIds = [...sourceOutputIds].filter((itemId) => targetInputIds.has(itemId)).sort()

  return compatibleItemIds.length > 0
    ? { isValid: true, compatibleItemIds }
    : { isValid: false, reason: 'incompatible-items' }
}

export const isBaseDesignerConnectionValid = (options: ConnectionValidationOptions) =>
  evaluateBaseDesignerConnection(options).isValid
