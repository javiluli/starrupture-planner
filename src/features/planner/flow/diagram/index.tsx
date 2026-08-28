import { Tab, Tabs } from '@heroui/react'
import { ListTree, Network, Package } from 'lucide-react'
import { ProductionFlowDiagram } from './production-flow-diagram'
import { ProductionTreelistDiagram } from './production-treelist-diagram'
import { ProductionItemsDiagram } from './production-items-diagram'

export const ProductionDiagramTabs = () => {
  return (
    <Tabs
      placement="top"
      variant="underlined"
      aria-label="Options"
      fullWidth
      classNames={{
        tabWrapper: 'flex h-full min-h-0 w-full flex-col overflow-hidden',
        base: 'w-full shrink-0',
        tabList: 'w-full',
        panel: 'min-h-0 flex-1 overflow-hidden p-0',
      }}
    >
      <Tab
        key="network-graph"
        title={
          <div className="flex items-center gap-2">
            <Network size={22} />
            <span>Network graph</span>
          </div>
        }
      >
        <ProductionFlowDiagram />
      </Tab>

      <Tab
        key="tree-list"
        title={
          <div className="flex items-center gap-2">
            <ListTree size={22} />
            <span>Tree list</span>
          </div>
        }
      >
        <ProductionTreelistDiagram />
      </Tab>

      <Tab
        key="items"
        title={
          <div className="flex items-center gap-2">
            <Package size={22} />
            <span>Items</span>
          </div>
        }
      >
        <ProductionItemsDiagram />
      </Tab>
    </Tabs>
  )
}
