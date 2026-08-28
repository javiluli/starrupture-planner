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
      <Flex align="center" justify="center" className="h-full min-h-0 p-6">
        <Flex align="center" justify="center" className="w-full rounded-xl border border-dashed border-white/10 p-20">
          <Typography className="text-slate-500 italic opacity-50">No production data available</Typography>
        </Flex>
      </Flex>
    )
  }

  return (
    <div className="h-full min-h-0 min-w-0 overflow-hidden">
      <div className="h-full min-h-0 overflow-x-auto overflow-y-auto overscroll-contain">
        <div className="px-4 py-8">
          <ItemsDiagramTable columns={PRODUCTION_ITEMS_COLUMNS} rows={data} itemNameMap={itemNameMap} />
        </div>
      </div>
    </div>
  )
}
