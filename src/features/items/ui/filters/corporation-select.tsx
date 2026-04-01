import type { Corporation } from '@/shared/@types/corporations.type'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { Select, SelectItem } from '@heroui/react'
import { useItemsFilters } from '@/features/items/hooks/use-items-filters'

export const CorporationSelect = () => {
  const corporations = useDataStore(dataSelectors.corporations)
  const { filters, setSelectedCorporationId } = useItemsFilters()
  const selectedKeys = filters.selectedCorporationId ? [filters.selectedCorporationId] : []

  return (
    <Select
      size='sm'
      variant='bordered'
      className='w-67.5'
      items={Object.values(corporations)}
      isClearable={true}
      placeholder='Corporation by filter'
      maxListboxHeight={500}
      selectedKeys={selectedKeys}
      onChange={(e) => setSelectedCorporationId(e.target.value)}
      renderValue={(items) => {
        return items.map((item) => {
          const c = item.data as Corporation
          return (
            <Flex key={c.id} align='center' gap='sm'>
              <AssetImage kind='corporations' id={c.id} width={16} className='rounded-none' />
              <Typography as='span' variant='small' tone='muted' className='capitalize'>
                {c.id.replaceAll('_', ' ')}
              </Typography>
            </Flex>
          )
        })
      }}
    >
      {(c) => (
        <SelectItem key={c.id} className='py-3'>
          <Flex>
            <AssetImage kind='corporations' id={c.id} width={18} className='rounded-none' />
            <Typography as='span' variant='small' tone='muted' className='capitalize'>
              {c.id.split('_').join(' ')}
            </Typography>
          </Flex>
        </SelectItem>
      )}
    </Select>
  )
}
