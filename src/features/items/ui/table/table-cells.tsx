import type { CorporationLevelRef } from '@/shared/@types/corporations.type'
import type { Item } from '@/shared/@types/item.type'
import { AssetImage, Flex, Typography } from '@/shared/ui'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { Button, Chip, Tooltip } from '@heroui/react'
import { Ruler } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const ItemCell = ({ item }: { item: Item }) => {
  return (
    <Flex gap="sm">
      <AssetImage kind="items" id={item.id} className="h-14" />
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
  const navigate = useNavigate()
  const setTargetId = usePlannerStore(plannerSelectors.setTargetId)

  const handlerRedirect = (id: string) => {
    setTargetId(id)
    // Un ligero delay, opcional permite que el estado se sincronice antes del cambio de vista
    setTimeout(() => {
      navigate('/')
    }, 100)
  }

  return (
    <Flex>
      {item.type !== 'raw' && (
        <Tooltip content="Open on planner">
          <Button isIconOnly variant="light" onPress={() => handlerRedirect(item.id)}>
            <Ruler />
          </Button>
        </Tooltip>
      )}
    </Flex>
  )
}

export const CorporationsCell = ({ corporations }: { corporations: CorporationLevelRef[] | undefined }) => {
  return (
    <Flex gap="lg">
      {corporations?.map((c) => (
        <Flex key={`${c.corporationId}-${c.level}`} gap="sm">
          <AssetImage kind="corporations" id={c.corporationId} className="h-6" />
          <Typography as="span" variant="small" tone="soft" className="capitalize">
            {c.corporationId.split('_')[0]} <span>L.{c.level}</span>
          </Typography>
        </Flex>
      ))}
    </Flex>
  )
}
