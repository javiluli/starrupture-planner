import { useOpenPlanner } from '@/features/planner'
import type { CorporationLevelRef } from '@/shared/@types/corporations.type'
import type { Item } from '@/shared/@types/item.type'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { Button, Chip } from '@heroui/react'

export const ItemCell = ({ item }: { item: Item }) => {
  return (
    <Flex gap="sm">
      <AssetImage kind="items" id={item.id} width={56} alt="" />
      <Typography as="span" variant="body">
        {item.name}
      </Typography>
    </Flex>
  )
}

export const CategoryCell = ({ itemType }: { itemType: string }) => {
  const bgColor = `color-mix(in srgb, var(--color-item-${itemType}), transparent 80%)`

  return (
    <Chip variant="flat" className="text-foreground" style={{ backgroundColor: bgColor }}>
      {itemType}
    </Chip>
  )
}

export const ProductionCell = ({ producerName }: { producerName: string | undefined }) => {
  return (
    <Typography as="span" variant="small" tone="muted">
      {producerName}
    </Typography>
  )
}

export const ActionsCell = ({ item }: { item: Item }) => {
  const openPlanner = useOpenPlanner()

  return (
    <Flex>
      <Button size="sm" onPress={() => openPlanner(item.id)}>
        Planner
      </Button>
    </Flex>
  )
}

export const CorporationsCell = ({ corporations }: { corporations: readonly CorporationLevelRef[] }) => {
  return (
    <Flex gap="lg" wrap="wrap">
      {corporations.map((corporation) => (
        <div key={`${corporation.corporationId}-${corporation.level}`} className="px-2 py-1">
          <Flex gap="sm">
            <AssetImage kind="corporations" id={corporation.corporationId} alt="" width={24} />
            <Typography as="span" variant="small" tone="soft" className="capitalize">
              {corporation.corporationName.split(' ')[0]} <span>L.{corporation.level}</span>
            </Typography>
          </Flex>
        </div>
      ))}
    </Flex>
  )
}
