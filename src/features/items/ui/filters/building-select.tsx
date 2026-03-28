import type { Building } from '@/shared/@types/production'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { itemsSelectors, useItemsStore } from '@/store/items.store'
import { Select, SelectItem } from '@heroui/react'
import { useMemo } from 'react'

const NON_PRODUCING_TYPES = new Set(['generator', 'transport', 'temperature', 'habitat', 'defense', 'storage', 'core'])

export const BuildingSelect = () => {
  const buildings = useDataStore(dataSelectors.buildings)
  const setSelectedBuildingId = useItemsStore(itemsSelectors.setSelectedBuildingId)

  const productionBuildings = useMemo(() => {
    return buildings.filter((b) => !NON_PRODUCING_TYPES.has(b.type))
  }, [buildings])

  return (
    <Select
      size="sm"
      variant="bordered"
      className="w-57.5"
      items={productionBuildings}
      isClearable={true}
      placeholder="Building by filter"
      maxListboxHeight={500}
      onChange={(e) => setSelectedBuildingId(e.target.value)}
      renderValue={(items) => {
        return items.map((item) => {
          const b = item.data as Building
          return (
            <Flex>
              <AssetImage kind="buildings" id={b.id} className="w-6 shrink-0" />
              <Typography as="span" variant="small" tone="muted">
                {b.name}
              </Typography>
            </Flex>
          )
        })
      }}
    >
      {(b) => (
        <SelectItem key={b.id} textValue={b.name}>
          <Flex>
            <AssetImage kind="buildings" id={b.id} className="w-8 shrink-0" />
            <Typography as="span" variant="small" tone="muted">
              {b.name}
            </Typography>
          </Flex>
        </SelectItem>
      )}
    </Select>
  )
}
