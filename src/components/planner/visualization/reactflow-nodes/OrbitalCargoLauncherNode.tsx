import { BuildingImage, ItemImage } from '@/components/ui/asset-image'
import { type OrbitalExportSystemNodeData } from '@/types/production'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { NodeBuildingCountBadge, NodeBuildingRate, NodeHeader, NodeStatsContainer } from './node-parts'
import { ORBITAL_CARGO_LAUNCHER_EXPORT_IPM, ORBITAL_CARGO_LAUNCHER_ID, ORBITAL_CARGO_LAUNCHER_NAME } from '@/constants/planner'

export const OrbitalCargoLauncherNode = ({ data, selected }: NodeProps) => {
  const { buildingPower, buildingHeat, buildingCount, exportItemId, exportItemName } = data as OrbitalExportSystemNodeData

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
        <NodeHeader title={ORBITAL_CARGO_LAUNCHER_NAME} />

        <div className="relative">
          <BuildingImage id={ORBITAL_CARGO_LAUNCHER_ID} className="w-full h-40" />
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <div className="flex bg-content2 rounded-2xl">
          <ItemImage id={exportItemId} className="h-10" />
        </div>
        <NodeBuildingRate itemName={exportItemName} baseIpm={ORBITAL_CARGO_LAUNCHER_EXPORT_IPM} />
      </div>

      <NodeStatsContainer buildingPower={buildingPower} buildingHeat={buildingHeat} />

      {/* Elemetos "absolute" */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
        <NodeBuildingCountBadge buildingLoad={buildingCount} buildingCount={buildingCount} />
      </div>
    </div>
  )
}
