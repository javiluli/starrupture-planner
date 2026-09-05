import { Tab, Tabs } from '@heroui/react'
import { ListTree, Network, Package, type LucideIcon } from 'lucide-react'
import { lazy, Suspense, type ComponentType } from 'react'

import { NetworkGraphSkeleton } from './network-graph-skeleton'
import { ProductionTreelistDiagram } from './production-treelist-diagram'
import { ProductionItemsDiagram } from './production-items-diagram'
import { RawTargetDiagram } from './raw-target-diagram'
import { useProductionPlan } from '@/features/planner/hooks/use-production-plan'

const ProductionFlowDiagram = lazy(() => import('./production-flow-diagram').then((module) => ({ default: module.ProductionFlowDiagram })))

type DiagramTab = {
  key: string
  label: string
  icon: LucideIcon
  component: ComponentType
}

const DIAGRAM_TABS: DiagramTab[] = [
  {
    key: 'network-graph',
    label: 'Network graph',
    icon: Network,
    component: ProductionFlowDiagram,
  },
  {
    key: 'tree-list',
    label: 'Tree list',
    icon: ListTree,
    component: ProductionTreelistDiagram,
  },
  {
    key: 'items',
    label: 'Items',
    icon: Package,
    component: ProductionItemsDiagram,
  },
]

export function ProductionDiagramTabs() {
  const plan = useProductionPlan()

  if (plan?.isRawTarget) return <RawTargetDiagram />

  return (
    <Tabs
      fullWidth
      placement="top"
      variant="underlined"
      aria-label="Production diagram views"
      classNames={{
        tabWrapper: 'flex h-full min-h-0 w-full flex-col overflow-hidden',
        base: 'w-full shrink-0',
        tabList: 'w-full',
        panel: 'min-h-0 flex-1 overflow-hidden p-0',
      }}
    >
      {DIAGRAM_TABS.map(({ key, label, icon: Icon, component: Content }) => (
        <Tab
          key={key}
          title={
            <span className="flex items-center gap-2">
              <Icon size={22} aria-hidden />
              {label}
            </span>
          }
        >
          <Suspense fallback={<NetworkGraphSkeleton />}>
            <Content />
          </Suspense>
        </Tab>
      ))}
    </Tabs>
  )
}
