import { cn } from '@heroui/react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { BaseDesignerBuildingNode } from '../../types'
import { BuildingIcon } from '../building-icon'

export const BuildingNode = ({ data, selected }: NodeProps<BaseDesignerBuildingNode>) => {
  const imageSize = Math.max(20, Math.min(data.width, data.height) - 4)

  return (
    <div
      aria-label={data.label}
      title={data.label}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-sm border bg-content1 transition-colors',
        selected ? 'border-primary ring-1 ring-primary/50' : 'border-divider',
      )}
    >
      <BuildingIcon buildingId={data.buildingId} width={imageSize} />

      {data.acceptsItems && (
        <Handle id="item-input" type="target" position={Position.Left} className="!size-2.5 !border-2 !border-background !bg-secondary" />
      )}
      {data.suppliesItems && (
        <Handle id="item-output" type="source" position={Position.Right} className="!size-2.5 !border-2 !border-background !bg-primary" />
      )}
    </div>
  )
}
