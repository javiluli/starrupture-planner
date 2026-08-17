import { useProductionPlan } from '@/features/planner/hooks/use-production-plan'
import { PlannerTreeRow, getTreeNodeKey, type TreeNodeData, useTreeData } from '@/features/planner/ui/treelist-diagram'
import { Flex, TreeList, Typography } from '@/shared/ui'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { useCallback, useMemo } from 'react'

export function ProductionTreelistDiagram() {
  const items = useDataStore(dataSelectors.items)
  const plan = useProductionPlan()

  const itemNameMap = useMemo(() => new Map(items.map((item) => [item.id, item.name])), [items])
  const treeData = useTreeData(plan?.steps, plan?.supplyCountByItem)
  const getChildren = useCallback((node: TreeNodeData) => node.children ?? [], [])
  const getNodeId = useCallback((node: TreeNodeData, path: string) => getTreeNodeKey(path, node), [])

  if (!treeData) {
    return (
      <Flex align="center" justify="center" className="p-20 border border-dashed border-white/10 rounded-xl">
        <Typography className="text-slate-500 italic opacity-50">No production data available</Typography>
      </Flex>
    )
  }

  return (
    <div className="py-6">
      <TreeList data={[treeData]} getChildren={getChildren} getNodeId={getNodeId} defaultExpanded={true} className="py-2">
        {(nodeProps) => <PlannerTreeRow {...nodeProps} itemNameMap={itemNameMap} />}
      </TreeList>
    </div>
  )
}
