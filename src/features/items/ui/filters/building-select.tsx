import { AssetImage, Flex, Typography } from '@/shared/ui'
import { dataSelectors, useDataStore } from '@/store/data.store'
import { Select, SelectItem } from '@heroui/react'
import { useMemo, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

const NON_PRODUCING_TYPES = new Set(['generator', 'transport', 'temperature', 'habitat', 'defense'])

export const BuildingSelect = ({ onChange }: { onChange: (value: string) => void }) => {
  const { t } = useTranslation('items')
  const buildings = useDataStore(dataSelectors.buildings)

  const productionBuildings = useMemo(() => {
    return buildings.filter((b) => !NON_PRODUCING_TYPES.has(b.type))
  }, [buildings])

  const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  return (
    <Select
      size="sm"
      variant="bordered"
      className="w-3xs"
      items={productionBuildings}
      isClearable={true}
      placeholder={t('building-filter-label')}
      maxListboxHeight={500}
      onChange={handleSelectionChange}
    >
      {(b) => (
        <SelectItem key={b.id} textValue={b.name}>
          <Flex>
            <AssetImage kind="buildings" id={b.id} className="h-8 shrink-0" />
            <Typography as="span" variant="small" tone="muted">
              {b.name}
            </Typography>
          </Flex>
        </SelectItem>
      )}
    </Select>
  )
}
