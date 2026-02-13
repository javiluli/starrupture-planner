import { cn } from '@heroui/react'
import { Handle, Position } from '@xyflow/react'
import { BuildingImage } from '../../../ui/asset-image'

const CoreBaseNode = () => {
  return (
    <div className={cn('w-full h-full bg-content1 rounded-xs')}>
      <BuildingImage id="base_core" className="w-full h-full" />

      {/* Handles ocultos para que no estorben visualmente */}
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  )
}

export default CoreBaseNode
