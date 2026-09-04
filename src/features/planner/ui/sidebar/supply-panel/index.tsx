import { getSupplyCountItemIds } from '@/features/planner/lib/supply-count'
import { Flex } from '@/shared/ui'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { SupplyModal } from './supply-modal'
import { SupplyCard } from './supply-card'

export const SupplyPanel = () => {
  // Filtramos solo nodos de produccion, es decir, que produzcan algo
  const items = useDataStore(dataSelectors.items)
  const supplyCountByItem = usePlannerStore(plannerSelectors.supplyCountByItem)
  const itemNameById = new Map(items.map((item) => [item.id, item.name]))

  return (
    <Flex direction="col" align="stretch" gap="md" className="px-3 py-2 h-full min-h-0 overflow-hidden">
      <div className="shrink-0">
        <SupplyModal />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Flex direction="col" align="stretch" gap="md">
          {getSupplyCountItemIds(supplyCountByItem).map((id) => (
            <SupplyCard key={id} itemId={id} itemName={itemNameById.get(id) ?? id.replaceAll('_', ' ')} value={supplyCountByItem[id]} />
          ))}
        </Flex>
      </div>
    </Flex>
  )
}
