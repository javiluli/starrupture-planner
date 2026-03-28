import type { Corporation } from '@/shared/@types/production'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { itemsSelectors, useItemsStore } from '@/store/items.store'
import { Select, SelectItem } from '@heroui/react'

export const CorporationSelect = () => {
  const corporations = useDataStore(dataSelectors.corporations)
  const setSelectedCorporationId = useItemsStore(itemsSelectors.setSelectedCorporationId)

  return (
    <Select
      size="sm"
      variant="bordered"
      className="w-67.5"
      items={Object.values(corporations)}
      isClearable={true}
      placeholder="Corporation by filter"
      maxListboxHeight={500}
      onChange={(e) => setSelectedCorporationId(e.target.value)}
      renderValue={(items) => {
        return items.map((item) => {
          const c = item.data as Corporation
          return (
            <Flex key={c.id} align="center" gap="sm">
              <AssetImage kind="corporations" id={c.id} className="w-4 rounded-none" />
              <Typography as="span" variant="small" tone="muted" className="capitalize">
                {c.id.replaceAll('_', ' ')}
              </Typography>
            </Flex>
          )
        })
      }}
    >
      {(c) => (
        <SelectItem key={c.id}>
          <Flex>
            <AssetImage kind="corporations" id={c.id} className="w-6 rounded-none" />
            <Typography as="span" variant="small" tone="muted" className="capitalize">
              {c.id.split('_').join(' ')}
            </Typography>
          </Flex>
        </SelectItem>
      )}
    </Select>
  )
}
