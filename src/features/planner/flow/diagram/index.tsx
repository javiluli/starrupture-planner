import { Tab, Tabs } from '@heroui/react'
import { Factory, ListTree, Network, Package, type LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'

import { ProductionFlowDiagram } from './production-flow-diagram'
import { ProductionTreelistDiagram } from './production-treelist-diagram'
import { ProductionItemsDiagram } from './production-items-diagram'

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
  {
    key: 'buildings',
    label: 'Buildings',
    icon: Factory,
    component: ProductionItemsDiagram,
  },
]

export function ProductionDiagramTabs() {
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
          <Content />
        </Tab>
      ))}
    </Tabs>
  )
}
