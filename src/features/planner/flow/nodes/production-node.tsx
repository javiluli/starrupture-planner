import { type ProductionNodeData } from '@/shared/@types/production'
import { AssetImage, Flex } from '@/shared/ui'
import { cn, Divider } from '@heroui/react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { FlowNodeCountBadge, FlowNodeHeader, FlowNodeOutputRate, FlowNodeProductionRate, FlowNodeStats } from './node-parts'

export const ProductionNode = ({ data, selected }: NodeProps) => {
  const { buildingId, buildingName, buildingPower, buildingHeat, buildingLoad, buildingCount, itemId, itemName, baseIpm, targetIpm } =
    data as ProductionNodeData

  return (
    <Flex
      direction="col"
      className={cn(
        'relative w-64 space-y-3 bg-content1/90 text-foreground px-6 py-4 shadow-xl rounded-3xl border-4 transition-all',
        selected ? 'border-content4' : 'border-content2',
        selected ? 'shadow-background/40' : 'shadow-none',
      )}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#ffffff' }} />
      <Handle type="source" position={Position.Right} className="opacity-0" />

      <Flex direction="col">
        <FlowNodeHeader title={buildingName} />

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
      <FlowNodeOutputRate itemName={itemName} baseIpm={baseIpm} />
      <Divider />
      <FlowNodeProductionRate buildingLoad={buildingLoad} targetIpm={targetIpm} />

      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
        <FlowNodeCountBadge buildingLoad={buildingLoad} buildingCount={buildingCount} />
      </div>
    </Flex>
  )
}
