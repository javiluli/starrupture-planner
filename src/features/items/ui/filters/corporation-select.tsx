import type { Corporation } from '@/shared/@types/corporations.type'
import { corporationsList } from '@/shared/data'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { Select, SelectItem } from '@heroui/react'
import { useItemsFilters } from '@/features/items/hooks/use-items-filters'

export const CorporationSelect = () => {
  const { filters, setSelectedCorporationId } = useItemsFilters()
  const selectedKeys = filters.selectedCorporationId ? [filters.selectedCorporationId] : []

  return (
    <Select
      aria-label="Filter items by corporation"
      size="sm"
      variant="bordered"
      className="w-full sm:w-67.5"
      items={corporationsList}
      isClearable={true}
      placeholder="Filter by Corporation"
      maxListboxHeight={500}
      selectedKeys={selectedKeys}
      onChange={(e) => setSelectedCorporationId(e.target.value)}
      renderValue={(items) => {
        return items.map((item) => {
          const c = item.data as Corporation
          return (
            <Flex key={c.id} align="center" gap="sm">
              <AssetImage kind="corporations" id={c.id} width={16} alt="" className="rounded-none" />
              <Typography as="span" variant="small" tone="muted" className="capitalize">
                {c.id.replaceAll('_', ' ')}
              </Typography>
            </Flex>
          )
        })
      }}
    >
      {(c) => (
        <SelectItem key={c.id} className="py-3">
          <Flex>
            <AssetImage kind="corporations" id={c.id} width={18} alt="" className="rounded-none" />
            <Typography as="span" variant="small" tone="muted" className="capitalize">
              {c.id.split('_').join(' ')}
            </Typography>
          </Flex>
        </SelectItem>
      )}
    </Select>
  )
}
