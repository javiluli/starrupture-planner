import { ORBITAL_CARGO_LAUNCHER_EXPORT_IPM, ORBITAL_CARGO_LAUNCHER_ID, ORBITAL_CARGO_LAUNCHER_NAME } from '@/features/planner/constants'
import type { OrbitalCargoLauncherFlowNode } from '@/features/planner/flow/types'
import { AssetImage, Flex } from '@/shared/ui'
import { Divider } from '@heroui/react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { FlowNodeShell } from './flow-node-shell'
import { FlowNodeCountBadge, FlowNodeHeader, FlowNodeOutputRate, FlowNodeStats } from './node-parts'

export const OrbitalCargoLauncherNode = ({ data, selected }: NodeProps<OrbitalCargoLauncherFlowNode>) => {
  const { buildingPower, buildingHeat, buildingCount, exportItemId, exportItemName } = data

  return (
    <FlowNodeShell selected={selected}>
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
    </FlowNodeShell>
  )
}
