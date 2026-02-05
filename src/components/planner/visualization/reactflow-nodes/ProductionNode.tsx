import { BuildingImage, ItemImage } from '@/components/ui/asset-image'
import { type ProductionNodeData } from '@/types/production'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { FlameIcon, ZapIcon } from 'lucide-react'

export const ProductionNode = ({ data, selected }: NodeProps) => {
  const { buildingId, buildingName, buildingPower, buildingHeat, buildingLoad, buildingCount, itemId, itemName, baseIpm } =
    data as ProductionNodeData

  return (
    <div
      className="relative w-56 flex flex-col space-y-3 bg-content1 text-foreground p-4 rounded-2xl shadow-md"
      style={{
        border: `2px solid ${selected ? '#fff' : '#373a40'}`,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#ffffff' }} />
      <Handle type="source" position={Position.Right} className="opacity-0" />

      <div className="flex flex-col items-center gap-2 pb-1.5 mb-2">
        <span className="text-lg font-bold text-foreground">{buildingName}</span>
        <div className="relative">
          <BuildingImage id={buildingId} className="w-full h-40" />
          <div className="absolute left-1/2 bottom-0 bg-content2 ring-2 ring-foreground rounded-2xl z-10">
            <ItemImage id={itemId} className="w-full h-14" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <div className="justify-between items-center">
          <div className="text-md text-foreground/80 font-semibold">{itemName}</div>
          <div className="text-success text-sm font-semibold">{baseIpm.toFixed(1)}/min</div>
        </div>
      </div>

      <div className="mb-0 flex items-center justify-between">
        {/* TOP LEFT: Power/Heat */}
        <div className="flex space-x-2">
          {/* Power */}
          <div className="flex items-start justify-start">
            <div className="flex items-center gap-1.5">
              <ZapIcon size={16} className="text-warning" />
              <span className="text-md font-mono font-bold text-warning">{buildingPower}</span>
            </div>
          </div>
          {/* Heat */}
          <div className="flex items-start justify-start">
            <div className="flex items-center gap-1.5">
              <FlameIcon size={16} className="text-danger" />
              <span className="text-md font-mono font-bold text-danger">{buildingHeat}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Elemetos "absolute" */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
        {buildingLoad % 1 !== 0 ? (
          <div className="bg-primary px-3 py-1 rounded-lg text-foreground">
            <strong>x{buildingLoad.toFixed(2)}</strong>
          </div>
        ) : (
          <div className="bg-linear-90 from-secondary to-primary px-3 py-1 rounded-lg text-foreground text-sm ring-2 ring-secondary">
            <strong>x{buildingCount.toFixed(1)}</strong>
          </div>
        )}
      </div>
    </div>
  )
}
