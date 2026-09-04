import type { KeyboardEvent, PointerEvent } from 'react'
import type { Building } from '@/shared/@types/building.type'
import { Flex, Typography } from '@/shared/ui'
import { Card, CardBody, Tooltip } from '@heroui/react'
import { Flame, Zap, type LucideIcon } from 'lucide-react'
import { BuildingIcon } from '../building-icon'

export type BuildingCatalogView = 'list' | 'grid'

interface BuildingCatalogItemProps {
  building: Building
  view: BuildingCatalogView
  onStartDragging: (event: PointerEvent<HTMLElement>, buildingId: string) => void
  onAddWithKeyboard: (buildingId: string) => void
}

const handleKeyboardPlacement = (event: KeyboardEvent<HTMLElement>, buildingId: string, onAdd: (buildingId: string) => void) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  onAdd(buildingId)
}

const BuildingStat = ({ icon: Icon, value, label }: { icon: LucideIcon; value: number; label: string }) => (
  <Tooltip content={label} delay={300}>
    <Flex as="span" gap="xs" aria-label={`${label}: ${value}`}>
      <Icon aria-hidden className="size-4 text-foreground/60" />
      <Typography as="span" variant="small" className="font-mono font-semibold tabular-nums">
        {value}
      </Typography>
    </Flex>
  </Tooltip>
)

/** Building draggable del catalogo en su representacion de lista o rejilla. */
export const BuildingCatalogItem = ({ building, view, onStartDragging, onAddWithKeyboard }: BuildingCatalogItemProps) => {
  const interactionProps = {
    role: 'button',
    tabIndex: 0,
    'aria-label': `Place ${building.name}`,
    onPointerDown: (event: PointerEvent<HTMLElement>) => onStartDragging(event, building.id),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => handleKeyboardPlacement(event, building.id, onAddWithKeyboard),
  }

  if (view === 'grid') {
    return (
      <Tooltip content={building.name} delay={350}>
        <Card
          {...interactionProps}
          shadow="sm"
          className="
            deferred-render aspect-square w-full cursor-grab touch-pan-y border border-divider/70 bg-content1
            transition-colors hover:border-primary/50 hover:bg-content2/30 focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-focus active:cursor-grabbing
          "
        >
          <CardBody className="items-center justify-center p-3">
            <BuildingIcon buildingId={building.id} label={building.name} width={76} />
          </CardBody>
        </Card>
      </Tooltip>
    )
  }

  return (
    <Card
      {...interactionProps}
      shadow="sm"
      className="
        deferred-render group w-full shrink-0 cursor-grab touch-pan-y border border-divider/70 bg-content1
        transition-colors hover:border-primary/50 hover:bg-content2/30 focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-focus active:cursor-grabbing
      "
    >
      <CardBody className="flex-row items-center justify-between gap-4 p-3">
        <Flex direction="col" align="start" justify="center" gap="md" className="min-w-0 flex-1">
          <Typography variant="h4" className="w-full truncate">
            {building.name}
          </Typography>
          <Flex gap="lg">
            <BuildingStat icon={Zap} value={Number(building.power) || 0} label="Power" />
            <BuildingStat icon={Flame} value={Number(building.heat) || 0} label="Heat" />
          </Flex>
        </Flex>

        <Flex justify="center" className="size-24 shrink-0 rounded-xl bg-content2/60">
          <BuildingIcon buildingId={building.id} label={building.name} width={84} />
        </Flex>
      </CardBody>
    </Card>
  )
}
