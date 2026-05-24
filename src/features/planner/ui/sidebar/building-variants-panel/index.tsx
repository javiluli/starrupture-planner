import { useProductionPlan } from '@/features/planner/hooks/use-production-plan'
import { getBuildingVariantOptions } from '@/features/planner/lib/building-variants'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { Card, CardBody, CardHeader, Chip, Tab, Tabs } from '@heroui/react'

/**
 * Panel de seleccion de variantes de edificios (V1/V2).
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
      <Flex align="center" justify="center" className="flex-1 py-6 text-center">
        <Typography tone="soft">Select a target item to enable variants.</Typography>
      </Flex>
    )
  }

  return (
    <Flex direction="col" className="flex-1 pr-3 overflow-y-auto">
      {steps.map((step) => {
        const options = getBuildingVariantOptions(buildings, step.buildingId, step.itemId)
        if (!options) return null

        const selectedId = buildingVariantByItemId[step.itemId] ?? options.baseId
        const itemName = itemNameMap.get(step.itemId) ?? step.itemId

        return (
          <div className="w-full">
            <Card className="bg-transparent">
              <CardHeader className="p-2 pb-1">
                <Flex direction="col">
                  <Flex>
                    <AssetImage id={step.itemId} kind={'items'} width={42} />
                    <Chip size="sm" color="primary" variant="flat">
                      {step.targetIpm.toFixed(2)}/min
                    </Chip>
                  </Flex>

                  <Typography>{itemName}</Typography>
                </Flex>
              </CardHeader>

              <CardBody className="p-2 pt-1">
                <Tabs
                  aria-label="Dynamic tabs"
                  items={options.options}
                  fullWidth
                  selectedKey={selectedId}
                  onSelectionChange={(value) => {
                    console.log(value)
                    if (value) setBuildingVariantForItem(step.itemId, value as string)
                  }}
                >
                  {(item) => (
                    <Tab
                      key={item.id}
                      title={
                        <Flex>
                          <AssetImage id={item.id} kind={'buildings'} width={32} />
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
  )
}
