import { Flex, Typography } from '@/shared/ui'
import { Divider } from '@heroui/react'
import { FlameIcon, ZapIcon } from 'lucide-react'

export function FlowNodeHeader({ title }: { title: string }) {
  return (
    <Typography as="h3" variant="h3" className="font-bold">
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
      <Typography as="span" variant="small" className={`font-mono font-bold ${color}`}>
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
      <Divider className="bg-divider/60" />
      <NodeStatBadge icon={FlameIcon} value={buildingHeat} color="text-danger" />
    </Flex>
  )
}

interface FlowNodeCountBadgeProps {
  buildingLoad: number
  buildingCount: number
}

export function FlowNodeCountBadge({ buildingLoad, buildingCount }: FlowNodeCountBadgeProps) {
  return (
    <>
      {buildingLoad % 1 !== 0 ? (
        <div className="bg-primary px-3 py-1 rounded-lg text-foreground">
          <Typography as="span" variant="small" tone="normal" className="font-bold">
            x{buildingLoad.toFixed(2)}
          </Typography>
        </div>
      ) : (
        <div className="bg-linear-90 from-secondary to-primary px-3 py-1 rounded-lg text-foreground ring-3 ring-secondary">
          <Typography as="span" variant="small" tone="normal" className="font-bold">
            x{buildingCount.toFixed(1)}
          </Typography>
        </div>
      )}
    </>
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
