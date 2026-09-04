import { useProductionPlan } from '@/features/planner/hooks/use-production-plan'
import { getBuildingVariantOptions } from '@/features/planner/lib/building-variants'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { Card, CardBody, CardHeader, Chip, Tab, Tabs } from '@heroui/react'

/**
 * Panel de selección de variantes de edificios (V1/V2).
 * Se muestra dentro del sidebar como pestaña independiente.
 */
export const BuildingVariantsPanel = () => {
  const buildings = useDataStore(dataSelectors.buildings)
  const items = useDataStore(dataSelectors.items)

  const plan = useProductionPlan()

  const buildingVariantByItemId = usePlannerStore(plannerSelectors.buildingVariantByItemId)
  const setBuildingVariantForItem = usePlannerStore(plannerSelectors.setBuildingVariantForItem)

  const itemNameMap = new Map(items.map((item) => [item.id, item.name]))
  const steps = plan?.steps ?? []

  if (!steps.length) {
    return (
      <Flex align="center" justify="center" className="h-full min-h-0 text-center">
        <Typography tone="soft">Select a target item to enable variants.</Typography>
      </Flex>
    )
  }

  return (
    <div className="px-3 py-2 h-full min-h-0 min-w-0 overflow-hidden">
      <div className="h-full min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain pr-3">
        <Flex direction="col" align="stretch" gap="md" className="min-w-0">
          {steps.map((step) => {
            const options = getBuildingVariantOptions(buildings, step.buildingId, step.itemId)

            if (!options) return null

            const selectedId = buildingVariantByItemId[step.itemId] ?? options.baseId

            const itemName = itemNameMap.get(step.itemId) ?? step.itemId

            return (
              <div key={step.itemId} className="min-w-0">
                <Card>
                  <CardHeader className="p-2 pb-1">
                    <Flex align="center">
                      <AssetImage id={step.itemId} kind="items" width={38} />
                      <Typography variant="micro">{itemName}</Typography>
                      <Chip size="sm" color="primary" variant="flat">
                        {step.targetIpm.toFixed(2)}/min
                      </Chip>
                    </Flex>
                  </CardHeader>

                  <CardBody className="p-2 pt-1">
                    <Tabs
                      size="sm"
                      aria-label="Building variant"
                      items={options.options}
                      fullWidth
                      selectedKey={selectedId}
                      onSelectionChange={(value) => {
                        if (value) {
                          setBuildingVariantForItem(step.itemId, value as string)
                        }
                      }}
                    >
                      {(item) => (
                        <Tab
                          key={item.id}
                          title={
                            <Flex>
                              <AssetImage id={item.id} kind="buildings" width={28} />
                              <span className="text-xs">{item.name}</span>
                            </Flex>
                          }
                        />
                      )}
                    </Tabs>
                  </CardBody>
                </Card>
              </div>
            )
          })}
        </Flex>
      </div>
    </div>
  )
}
