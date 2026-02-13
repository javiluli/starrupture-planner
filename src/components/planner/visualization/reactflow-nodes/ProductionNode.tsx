import { BuildingImage, ItemImage } from '@/components/ui/asset-image'
import { type ProductionNodeData } from '@/types/production'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { NodeBuildingCountBadge, NodeBuildingRate, NodeHeader, NodeStatsContainer } from './node-parts'

export const ProductionNode = ({ data, selected }: NodeProps) => {
  const { buildingId, buildingName, buildingPower, buildingHeat, buildingLoad, buildingCount, itemId, itemName, baseIpm } =
    data as ProductionNodeData

  return (
    <div
      className="relative w-64 flex flex-col space-y-3 bg-content1 text-foreground px-6 py-4 rounded-2xl shadow-md"
      style={{
        border: `2px solid ${selected ? '#fff' : '#373a40'}`,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#ffffff' }} />
      <Handle type="source" position={Position.Right} className="opacity-0" />

      <div className="flex flex-col items-center gap-2">
        <NodeHeader title={buildingName} />

        <div className="relative">
          <BuildingImage id={buildingId} className="w-full h-40" />
          <div className="absolute left-1/2 bottom-0 bg-content2 ring-2 ring-foreground rounded-2xl z-10">
            <ItemImage id={itemId} className="w-full h-14" />
          </div>
        </div>
      </div>

      <NodeBuildingRate itemName={itemName} baseIpm={baseIpm} />

      <NodeStatsContainer buildingPower={buildingPower} buildingHeat={buildingHeat} />

      {/* Elemetos "absolute" */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
        <NodeBuildingCountBadge buildingLoad={buildingLoad} buildingCount={buildingCount} />
      </div>
    </div>
  )
}
