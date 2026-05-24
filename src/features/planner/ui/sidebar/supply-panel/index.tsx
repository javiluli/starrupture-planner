import { getSupplyCountItemIds } from '@/features/planner/lib/supply-count'
import { Flex } from '@/shared/ui'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { SupplyModal } from './supply-modal'
import { SupplyCard } from './supply-card'

export const SupplyPanel = () => {
  // Filtramos solo nodos de produccion, es decir, que produzcan algo
  const supplyCountByItem = usePlannerStore(plannerSelectors.supplyCountByItem)

  return (
    <Flex direction="col" gap="md" className="h-full">
      <SupplyModal />
      <Flex direction="col" gap="md" className="flex-1 pr-3 overflow-y-auto">
        {getSupplyCountItemIds(supplyCountByItem).map((id) => (
          <SupplyCard key={id} itemId={id} value={supplyCountByItem[id]} />
        ))}
      </Flex>
    </Flex>
  )
}
