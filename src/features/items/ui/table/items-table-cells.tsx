import { useOpenPlanner } from '@/features/planner'
import { getCorporationLevelPath } from '@/features/corporations/lib/corporation-level-navigation'
import type { CorporationLevelRef } from '@/shared/@types/corporations.type'
import type { Item } from '@/shared/@types/item.type'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { Button, Chip } from '@heroui/react'
import { Link } from 'react-router-dom'

export const ItemCell = ({ item }: { item: Item }) => {
  return (
    <Flex gap="sm">
      <AssetImage kind="items" id={item.id} width={56} />
      <Typography as="span" variant="body" tone="muted">
        {item.name}
      </Typography>
    </Flex>
  )
}

export const CategoryCell = ({ itemType }: { itemType: string }) => {
  const bgColor = `color-mix(in srgb, var(--color-item-${itemType}), transparent 80%)`
  const color = `var(--color-item-${itemType})`

  return (
    <Chip variant="flat" style={{ backgroundColor: bgColor, color: color }}>
      {itemType}
    </Chip>
  )
}

export const ProductionCell = ({ itemProduction }: { itemProduction: string | undefined }) => {
  return (
    <Typography as="span" variant="small" tone="muted">
      {itemProduction}
    </Typography>
  )
}

export const ActionsCell = ({ item }: { item: Item }) => {
  const openPlanner = useOpenPlanner()

  return (
    <Flex>
      {item.type !== 'raw' && (
        <Button size="sm" onPress={() => openPlanner(item.id)}>
          Planner
        </Button>
      )}
    </Flex>
  )
}

export const CorporationsCell = ({ corporations }: { corporations: CorporationLevelRef[] | undefined }) => {
  return (
    <Flex gap="lg" wrap="wrap">
      {corporations?.map((corporation) => (
        <Link
          key={`${corporation.corporationId}-${corporation.level}`}
          to={getCorporationLevelPath(corporation.corporationId, corporation.level)}
          aria-label={`Open ${corporation.corporationName} level ${corporation.level}`}
          className="rounded-lg px-2 py-1 transition-colors hover:bg-content2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <Flex gap="sm">
            <AssetImage kind="corporations" id={corporation.corporationId} width={24} />
            <Typography as="span" variant="small" tone="soft" className="capitalize">
              {corporation.corporationName} <span>L.{corporation.level}</span>
            </Typography>
          </Flex>
        </Link>
      ))}
    </Flex>
  )
}
