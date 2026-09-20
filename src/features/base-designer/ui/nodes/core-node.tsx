import { AssetImage } from '@/shared/ui'
import type { NodeProps } from '@xyflow/react'
import type { BaseDesignerCoreNode } from '../../types'

export const CoreNode = ({ data }: NodeProps<BaseDesignerCoreNode>) => {
  const imageSize = Math.min(data.width, data.height)

  return (
    <div
      role="img"
      aria-label="Base Core"
      className="flex h-full w-full items-center justify-center rounded-sm border border-primary/70 bg-content1"
    >
      <AssetImage kind="buildings" id={data.buildingId} width={imageSize} alt="" loading="eager" />
    </div>
  )
}
