import type { KeyboardEvent, PointerEvent } from 'react'
import type { Building } from '@/shared/@types/building.type'
import { Flex, Typography } from '@/shared/ui'
import { Card, CardBody, Chip, Tooltip } from '@heroui/react'
import { Flame, Zap, type LucideIcon } from 'lucide-react'
import { getBuildingFootprintInfo } from '../../lib/building-dimensions'
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

const BuildingFootprintBadge = ({ buildingId }: { buildingId: string }) => {
  const { footprint, isEstimated } = getBuildingFootprintInfo(buildingId)
  const dimensions = `${footprint.columns}×${footprint.rows}`
  const label = isEstimated ? `Estimated footprint: ${dimensions}` : `Footprint: ${dimensions}`

  return (
    <Tooltip content={label} delay={300}>
      <Chip size="sm" variant="flat" aria-label={label} className="font-mono text-xs tabular-nums">
        {dimensions} {isEstimated ? 'estimated' : ''}
      </Chip>
    </Tooltip>
  )
}

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
          <CardBody className="items-center justify-center gap-1 p-2">
            <BuildingIcon buildingId={building.id} width={64} />
            <BuildingFootprintBadge buildingId={building.id} />
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
          <Flex justify="between" className="w-full min-w-0">
            <Typography variant="h4" className="min-w-0 truncate">
              {building.name}
            </Typography>
            <BuildingFootprintBadge buildingId={building.id} />
          </Flex>
          <Flex gap="lg">
            <BuildingStat icon={Zap} value={Number(building.power) || 0} label="Power" />
            <BuildingStat icon={Flame} value={Number(building.heat) || 0} label="Heat" />
          </Flex>
        </Flex>

        <Flex justify="center" className="size-24 shrink-0 rounded-xl bg-content2/60">
          <BuildingIcon buildingId={building.id} width={84} />
        </Flex>
      </CardBody>
    </Card>
  )
}
