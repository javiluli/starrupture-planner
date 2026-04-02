import { Flex, Typography } from '@/shared/ui'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { useMemo } from 'react'
import { useProductionPlan } from '@/features/planner/hooks/use-production-plan'
import { TreeNode, useTreeData, useTreeExpansion } from '@/features/planner/ui/treelist-diagram'
import { Button } from '@heroui/react'

export function ProductionTreelistDiagram() {
  const items = useDataStore(dataSelectors.items)
  const plan = useProductionPlan()

  console.log(plan)

  const itemNameMap = useMemo(() => {
    return new Map(items.map((item) => [item.id, item.name]))
  }, [items])

  const treeData = useTreeData(plan?.steps, plan?.supplyCountByItem)
  const rootPath = treeData ? treeData.itemId : 'root'
  const { expandedMap, toggle, expandAll, collapseAll } = useTreeExpansion(treeData, rootPath)

  if (!treeData) {
    return (
      <Flex align="center" justify="center" className="p-20 border border-dashed border-white/10 rounded-xl">
        <Typography className="text-slate-500 italic opacity-50">No production data available</Typography>
      </Flex>
    )
  }

  return (
    <div className="py-6">
      <Flex align="center" justify="end" gap="sm" className="pb-4">
        <Button variant="bordered" size="sm" onPress={expandAll}>
          Expand all
        </Button>
        <Button variant="bordered" size="sm" onPress={collapseAll}>
          Collapse all
        </Button>
      </Flex>
      <TreeNode
        node={treeData}
        nodePath={rootPath}
        itemNameMap={itemNameMap}
        depth={0}
        isLast={true}
        ancestorLineFlags={[]}
        isExpandedById={expandedMap}
        onToggle={toggle}
      />
    </div>
  )
}
