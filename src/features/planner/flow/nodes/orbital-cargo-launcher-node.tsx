import { ORBITAL_CARGO_LAUNCHER_EXPORT_IPM, ORBITAL_CARGO_LAUNCHER_ID, ORBITAL_CARGO_LAUNCHER_NAME } from '@/features/planner/constants'
import { type OrbitalExportSystemNodeData } from '@/features/planner/types'
import { AssetImage, Flex } from '@/shared/ui'
import { cn, Divider } from '@heroui/react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { FlowNodeCountBadge, FlowNodeHeader, FlowNodeOutputRate, FlowNodeStats } from './node-parts'

export const OrbitalCargoLauncherNode = ({ data, selected }: NodeProps) => {
  const { buildingPower, buildingHeat, buildingCount, exportItemId, exportItemName } = data as OrbitalExportSystemNodeData

  return (
    <Flex
      direction="col"
      className={cn(
        'relative w-64 space-y-1 bg-content1/90 text-foreground px-4 py-3 shadow-xl rounded-2xl border-4 transition-all',
        selected ? 'border-primary' : 'border-content3',
        selected ? 'shadow-background' : 'shadow-none',
      )}
    >
      <Handle type="target" position={Position.Left} className="bg-foreground!" />
      <Handle type="source" position={Position.Right} className="opacity-0" />

      <Flex direction="col">
        <FlowNodeHeader title={ORBITAL_CARGO_LAUNCHER_NAME} />

        <Flex>
          <FlowNodeStats buildingPower={buildingPower} buildingHeat={buildingHeat} />

          <div className="relative">
            <AssetImage kind="buildings" id={ORBITAL_CARGO_LAUNCHER_ID} width={160} />
          </div>
        </Flex>
      </Flex>

      <Divider />

      <Flex gap="md">
        <div className="flex bg-content2 rounded-2xl">
          <AssetImage kind="items" id={exportItemId} width={40} />
        </div>
        <FlowNodeOutputRate itemName={exportItemName} baseIpm={ORBITAL_CARGO_LAUNCHER_EXPORT_IPM} />
      </Flex>

      {/* Elemetos "absolute" */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
        <FlowNodeCountBadge buildingCount={buildingCount} />
      </div>
    </Flex>
  )
}
