import { Flex, Typography } from '@/shared/ui'
import { cn, Divider } from '@heroui/react'
import { FlameIcon, ZapIcon } from 'lucide-react'

export function FlowNodeHeader({ title, className }: { title: string; className?: string }) {
  return (
    <Typography as="h3" variant="h3" className={cn(className, 'font-bold')}>
      {title}
    </Typography>
  )
}

interface NodeStatBadgeProps {
  icon: React.ElementType
  value: number
  color: string
}

function NodeStatBadge({ icon: Icon, value, color }: NodeStatBadgeProps) {
  return (
    <Flex gap="xs">
      <Icon size={20} className={color} />
      <Typography as="span" variant="small" className="font-mono font-bold">
        {value}
      </Typography>
    </Flex>
  )
}

interface FlowNodeStatsProps {
  buildingPower: number
  buildingHeat: number
}

export function FlowNodeStats({ buildingPower, buildingHeat }: FlowNodeStatsProps) {
  return (
    <Flex direction="col" gap="sm">
      <NodeStatBadge icon={ZapIcon} value={buildingPower} color="text-warning" />
      <Divider />
      <NodeStatBadge icon={FlameIcon} value={buildingHeat} color="text-danger" />
    </Flex>
  )
}

interface FlowNodeCountBadgeProps {
  buildingCount: number
}

export function FlowNodeCountBadge({ buildingCount }: FlowNodeCountBadgeProps) {
  return (
    <div className="bg-secondary px-3 py-0.5 rounded-lg ring-2 ring-secondary">
      <Typography as="span" className="font-bold">
        {buildingCount.toFixed(0)}
      </Typography>
    </div>
  )
}

interface FlowNodeOutputRateProps {
  itemName: string
  baseIpm: number
}

export function FlowNodeOutputRate({ itemName, baseIpm }: FlowNodeOutputRateProps) {
  return (
    <Flex gap="md">
      <Flex direction="col" align="start" gap="xs">
        <Typography as="span" variant="small" tone="muted" className="font-semibold">
          {itemName}
        </Typography>
        <Typography as="span" variant="micro" tone="normal" className="font-bold">
          {baseIpm.toFixed(1)}/min
        </Typography>
      </Flex>
    </Flex>
  )
}

interface FlowNodeProductionRateProps {
  buildingLoad: number
  targetIpm: number
}

export function FlowNodeProductionRate({ buildingLoad, targetIpm }: FlowNodeProductionRateProps) {
  return (
    <Typography as="span" variant="small" tone="normal" className="font-semibold">
      x{buildingLoad.toFixed(2)} = {targetIpm.toFixed(1)}/min
    </Typography>
  )
}
