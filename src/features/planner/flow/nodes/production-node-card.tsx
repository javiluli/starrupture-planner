import type { ReactNode } from 'react'
import { cn, Divider, Skeleton } from '@heroui/react'
import type { ProductionNodeData } from '@/features/planner/flow/types'
import { AssetImage, Flex } from '@/shared/ui'
import { FlowNodeShell } from './flow-node-shell'
import { FlowNodeCountBadge, FlowNodeHeader, FlowNodeOutputRate, FlowNodeProductionRate, FlowNodeStats } from './node-parts'

interface LoadingMaskProps {
  children: ReactNode
  className?: string
  loading: boolean
}

/** Preserves the real content dimensions while HeroUI paints its loading mask. */
function LoadingMask({ children, className, loading }: LoadingMaskProps) {
  if (!loading) return children
  return <Skeleton className={cn('rounded-lg', className)}>{children}</Skeleton>
}

interface ProductionNodeCardProps {
  children?: ReactNode
  data: ProductionNodeData
  selected?: boolean
  loading?: boolean
}

interface ProductionArtworkProps {
  buildingId: string
  itemId: string
  loading: boolean
}

/** Keeps the real media footprint without requesting preview-only icons. */
function ProductionArtwork({ buildingId, itemId, loading }: ProductionArtworkProps) {
  if (loading) return <div className="relative size-40" />

  return (
    <div className="relative">
      <AssetImage kind="buildings" id={buildingId} width={160} />
      <div className="absolute bottom-0 left-1/2 z-10 rounded-2xl bg-content1 ring-2 ring-foreground">
        <AssetImage kind="items" id={itemId} width={64} />
      </div>
    </div>
  )
}

/** Visual production-node card shared by React Flow and its loading preview. */
export function ProductionNodeCard({ children, data, selected = false, loading = false }: ProductionNodeCardProps) {
  const { buildingId, buildingName, buildingPower, buildingHeat, buildingLoad, buildingCount, itemId, itemName, baseIpm, targetIpm } = data

  return (
    <FlowNodeShell selected={selected} aria-hidden={loading || undefined}>
      {children}

      <Flex direction="col">
        <LoadingMask loading={loading} className="w-3/5">
          <FlowNodeHeader title={buildingName} />
        </LoadingMask>

        <LoadingMask loading={loading} className="w-full rounded-xl">
          <Flex>
            <FlowNodeStats buildingPower={buildingPower} buildingHeat={buildingHeat} />
            <ProductionArtwork buildingId={buildingId} itemId={itemId} loading={loading} />
          </Flex>
        </LoadingMask>
      </Flex>

      <Divider />
      <LoadingMask loading={loading} className="w-2/3">
        <FlowNodeOutputRate itemName={itemName} baseIpm={baseIpm} />
      </LoadingMask>
      <Divider />
      <LoadingMask loading={loading} className="w-3/4">
        <FlowNodeProductionRate buildingLoad={buildingLoad} targetIpm={targetIpm} />
      </LoadingMask>

      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
        <LoadingMask loading={loading}>
          <FlowNodeCountBadge buildingCount={buildingCount} />
        </LoadingMask>
      </div>
    </FlowNodeShell>
  )
}
