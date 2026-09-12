import type { SupplyFlowNode } from '@/features/planner/flow/types'
import { AssetImage, Flex } from '@/shared/ui'
import { Divider } from '@heroui/react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { FlowNodeShell } from './flow-node-shell'
import { FlowNodeCountBadge, FlowNodeHeader, FlowNodeOutputRate, FlowNodeStats } from './node-parts'

export function SupplyNode({ data, selected }: NodeProps<SupplyFlowNode>) {
  const { buildingId, buildingName, buildingPower, buildingHeat, itemId, itemName, supplyCount } = data

  return (
    <FlowNodeShell selected={selected}>
      <Handle type="target" position={Position.Left} className="bg-foreground! opacity-0" />
      <Handle type="source" position={Position.Right} className="bg-foreground!" />

      <Flex direction="col">
        <FlowNodeHeader title={buildingName} />
        <FlowNodeHeader title="External supply" className="text-medium text-foreground/60 italic" />

        <Flex>
          <FlowNodeStats buildingPower={buildingPower} buildingHeat={buildingHeat} />

          <div className="relative">
            <AssetImage kind="buildings" id={buildingId} width={160} alt="" />
            <div className="absolute left-1/2 bottom-0 bg-content1 ring-2 ring-foreground rounded-2xl z-10">
              <AssetImage kind="items" id={itemId} width={64} alt="" />
            </div>
          </div>
        </Flex>
      </Flex>

      <Divider />
      <FlowNodeOutputRate itemName={itemName} baseIpm={supplyCount} />

      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
        <FlowNodeCountBadge buildingCount={1} />
      </div>
    </FlowNodeShell>
  )
}
