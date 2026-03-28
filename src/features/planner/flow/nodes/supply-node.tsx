import type { SupplyNodeData } from '@/shared/@types/supply-node.type'
import { AssetImage, Flex } from '@/shared/ui'
import { cn, Divider } from '@heroui/react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { FlowNodeCountBadge, FlowNodeHeader, FlowNodeOutputRate, FlowNodeStats } from './node-parts'

export function SupplyNode({ data, selected }: NodeProps) {
  const { buildingId, buildingName, buildingPower, buildingHeat, itemId, itemName, supply } = data as SupplyNodeData

  return (
    <Flex
      direction="col"
      className={cn(
        'relative w-64 space-y-3 bg-content1/90 text-foreground px-6 py-4 shadow-xl rounded-3xl border-4 transition-all',
        selected ? 'border-content4' : 'border-content2',
        selected ? 'shadow-background/40' : 'shadow-none',
      )}
    >
      <Handle type="target" position={Position.Left} className="opacity-0" style={{ background: '#ffffff' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#ffffff' }} />

      <Flex direction="col">
        <FlowNodeHeader title={buildingName} className="italic" />

        <Flex>
          <FlowNodeStats buildingPower={buildingPower} buildingHeat={buildingHeat} />

          <div className="relative">
            <AssetImage kind="buildings" id={buildingId} className="h-40" />
            <div className="absolute left-1/2 bottom-0 bg-content1 ring-2 ring-foreground rounded-2xl z-10">
              <AssetImage kind="items" id={itemId} className="h-16" />
            </div>
          </div>
        </Flex>
      </Flex>

      <Divider />
      <FlowNodeOutputRate itemName={itemName} baseIpm={supply} />

      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
        <FlowNodeCountBadge buildingLoad={1} buildingCount={1} />
      </div>
    </Flex>
  )
}
