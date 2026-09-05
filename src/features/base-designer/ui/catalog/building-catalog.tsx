import type { PointerEvent } from 'react'
import { useState } from 'react'
import type { Building } from '@/shared/@types/building.type'
import { Flex, Typography } from '@/shared/ui'
import { Button, ButtonGroup, Chip, Input, Select, SelectItem, Tooltip } from '@heroui/react'
import { Grid3X3, List, Search, SearchX } from 'lucide-react'
import { BuildingCatalogItem, type BuildingCatalogView } from './building-catalog-item'
import { filterBuildingCatalog, getBuildingCatalogCategories } from './filter-building-catalog'

interface BuildingCatalogProps {
  buildings: readonly Building[]
  onStartDragging: (event: PointerEvent<HTMLElement>, buildingId: string) => void
  onAddWithKeyboard: (buildingId: string) => void
}

export const BuildingCatalog = ({ buildings, onStartDragging, onAddWithKeyboard }: BuildingCatalogProps) => {
  const [view, setView] = useState<BuildingCatalogView>('list')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const categories = getBuildingCatalogCategories(buildings)
  const filteredBuildings = filterBuildingCatalog(buildings, { category, query })
  const hasActiveFilters = Boolean(query || category)
  const resultCount = hasActiveFilters ? `${filteredBuildings.length}/${buildings.length}` : buildings.length

  const clearFilters = () => {
    setQuery('')
    setCategory('')
  }

  return (
    <Flex direction="col" align="stretch" className="h-full min-h-0 w-full overflow-hidden p-3">
      <Flex justify="between" className="mb-3 shrink-0">
        <Flex gap="sm">
          <Typography variant="h4">Buildings</Typography>
          <Chip size="sm" variant="flat" aria-label={`${filteredBuildings.length} buildings shown`}>
            {resultCount}
          </Chip>
        </Flex>

        <ButtonGroup size="sm" variant="flat">
          <Tooltip content="List view">
            <Button isIconOnly aria-label="List view" color={view === 'list' ? 'primary' : 'default'} onPress={() => setView('list')}>
              <List aria-hidden className="size-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Grid view">
            <Button isIconOnly aria-label="Grid view" color={view === 'grid' ? 'primary' : 'default'} onPress={() => setView('grid')}>
              <Grid3X3 aria-hidden className="size-4" />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Flex>

      <Typography variant="small" tone="soft" className="mb-3 shrink-0">
        Drag a building onto the field. Use Enter or Space for keyboard placement.
      </Typography>

      <Flex direction="col" align="stretch" gap="sm" className="mb-3 shrink-0">
        <Input
          type="search"
          size="sm"
          variant="bordered"
          isClearable
          aria-label="Search buildings"
          placeholder="Search buildings"
          startContent={<Search aria-hidden className="size-4 text-foreground/50" />}
          value={query}
          onValueChange={setQuery}
          onClear={() => setQuery('')}
        />
        <Select
          size="sm"
          variant="bordered"
          isClearable
          aria-label="Filter buildings by category"
          placeholder="All categories"
          items={categories}
          selectedKeys={category ? [category] : []}
          onChange={(event) => setCategory(event.target.value)}
        >
          {(item) => (
            <SelectItem key={item.id} textValue={item.label}>
              <Flex justify="between" className="w-full">
                <span>{item.label}</span>
                <span className="font-mono text-foreground/50 tabular-nums">{item.count}</span>
              </Flex>
            </SelectItem>
          )}
        </Select>
      </Flex>

      <div className="min-h-0 w-full flex-1 overflow-y-auto pr-2">
        {filteredBuildings.length > 0 ? (
          <div className={view === 'list' ? 'flex w-full flex-col gap-3' : 'grid w-full grid-cols-3 gap-3'}>
            {filteredBuildings.map((building) => (
              <BuildingCatalogItem
                key={building.id}
                building={building}
                view={view}
                onStartDragging={onStartDragging}
                onAddWithKeyboard={onAddWithKeyboard}
              />
            ))}
          </div>
        ) : (
          <Flex direction="col" justify="center" className="h-full min-h-40 text-center">
            <SearchX aria-hidden className="size-7 text-foreground/35" />
            <Typography variant="h4">No buildings found</Typography>
            <Typography variant="small" tone="soft">
              Try another name or category.
            </Typography>
            <Button size="sm" variant="flat" color="primary" onPress={clearFilters}>
              Clear filters
            </Button>
          </Flex>
        )}
      </div>
    </Flex>
  )
}
