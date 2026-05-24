import { useProductionPlan } from '@/features/planner/hooks/use-production-plan'
import { Flex, Typography } from '@/shared/ui'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { useMemo } from 'react'
import { ItemsDiagramTable, PRODUCTION_ITEMS_COLUMNS, useItemsDiagramData } from '@/features/planner/ui/items-diagram'

export function ProductionItemsDiagram() {
  const items = useDataStore(dataSelectors.items)
  const plan = useProductionPlan()

  const itemNameMap = useMemo(() => {
    return new Map(items.map((item) => [item.id, item.name]))
  }, [items])

  const data = useItemsDiagramData(plan?.steps)

  if (!data) {
    return (
      <Flex align="center" justify="center" className="p-20 border border-dashed border-white/10 rounded-xl">
        <Typography className="text-slate-500 italic opacity-50">No production data available</Typography>
      </Flex>
    )
  }

  return (
    <div className="px-4 py-8">
      <ItemsDiagramTable columns={PRODUCTION_ITEMS_COLUMNS} rows={data} itemNameMap={itemNameMap} />
    </div>
  )
}
