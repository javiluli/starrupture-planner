import { cn } from '@heroui/react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { BuildingImage } from '@/components/ui/asset-image'
import type { BuildingNodeData } from '../../types'

const BuildingNode = ({ data }: NodeProps) => {
  const { id } = data as BuildingNodeData

  return (
    <div className={cn('bg-content1 border border-content3 rounded-xs')}>
      <BuildingImage id={id} className="w-full" />

      {/* si el Buildin es "ore_excavator" solo tiene 1 salida */}
      {id !== 'ore_excavator' && <Handle type="target" position={Position.Left} className="w-16 bg-[#3498db]!" />}
      <Handle type="source" position={Position.Right} className="w-16 bg-[#DE852C]!" />
    </div>
  )
}

export default BuildingNode
