import { useMemo } from 'react'
import type { ProductionStep } from '../../../lib'
import { buildTree } from '../lib/tree-build'
import type { TreeNodeData } from '../components/tree-node'

export const useTreeData = (steps: ProductionStep[] | undefined, supplyCountByItem?: Record<string, number>) => {
  return useMemo<TreeNodeData | null>(() => {
    if (!steps?.length) return null

    const rootNode = steps[0]
    const stepMap = new Map<string, ProductionStep>()
    steps.forEach((step) => stepMap.set(step.itemId, step))

    const supplyRemaining = new Map<string, number>()
    if (supplyCountByItem) {
      Object.entries(supplyCountByItem).forEach(([itemId, count]) => {
        supplyRemaining.set(itemId, count)
      })
    }

    return buildTree(stepMap, rootNode.itemId, true, rootNode.targetIpm, supplyRemaining)
  }, [steps, supplyCountByItem])
}
