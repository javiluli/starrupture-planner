import type { Building } from '@/shared/@types/building.type'
import { Typography } from '@/shared/ui'
import { cn } from '@heroui/react'
import { CircleX } from 'lucide-react'
import { useReactFlow, type XYPosition } from '@xyflow/react'
import { BASE_FIELD_NODE_ID } from '../base-designer.config'
import { usePointerPosition } from '../hooks/use-pointer-position'
import { isBuildingAreaAvailable } from '../lib/building-collision'
import { calculateBuildingPlacement } from '../lib/create-building-node'
import { useBaseDesignerStore } from '@/store/base-designer.store'
import { BuildingIcon } from './building-icon'

interface DragPreviewProps {
  building: Building
  initialPosition: XYPosition
}

export const DragPreview = ({ building, initialPosition }: DragPreviewProps) => {
  const pointer = usePointerPosition(initialPosition)
  const { screenToFlowPosition, flowToScreenPosition } = useReactFlow()
  let previewPosition = pointer.position
  let isPlacementAvailable = true

  if (pointer.isOverCanvas) {
    const parentPosition = useBaseDesignerStore.getState().nodes.find((node) => node.id === BASE_FIELD_NODE_ID)?.position ?? {
      x: 0,
      y: 0,
    }
    const placement = calculateBuildingPlacement({
      buildingId: building.id,
      absolutePosition: screenToFlowPosition(pointer.position),
      parentPosition,
    })

    previewPosition = flowToScreenPosition({
      x: parentPosition.x + placement.position.x + placement.size.width / 2,
      y: parentPosition.y + placement.position.y + placement.size.height / 2,
    })
    isPlacementAvailable = isBuildingAreaAvailable(
      { position: placement.position, ...placement.size },
      useBaseDesignerStore.getState().nodes,
    )
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 size-24"
      style={{ transform: `translate3d(${previewPosition.x}px, ${previewPosition.y}px, 0) translate(-50%, -50%)` }}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-xl border bg-content1/90 shadow-lg backdrop-blur',
          isPlacementAvailable ? 'border-primary/70' : 'border-danger bg-danger-50/90',
        )}
      />
      {!isPlacementAvailable && (
        <span className="absolute right-1 top-1 rounded-full bg-danger p-0.5 text-danger-foreground">
          <CircleX className="size-3" />
        </span>
      )}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <BuildingIcon buildingId={building.id} label={building.name} width={52} />
      </div>
      <Typography
        variant="micro"
        className="absolute inset-x-2 bottom-1 truncate text-center"
      >
        {building.name}
      </Typography>
    </div>
  )
}
