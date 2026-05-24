import { Tab, Tabs } from '@heroui/react'
import { ListTree, Network, Package } from 'lucide-react'
import { ProductionFlowDiagram } from './production-flow-diagram'
import { ProductionTreelistDiagram } from './production-treelist-diagram'
import { ProductionItemsDiagram } from './production-items-diagram'

export const ProductionDiagramTabs = () => {
  return (
    <Tabs variant="underlined" aria-label="Options" fullWidth>
      <Tab
        key="network-graph"
        className="h-full"
        title={
          <div className="flex items-center space-x-2">
            <Network size={22} />
            <span>Network grap</span>
          </div>
        }
      >
        <ProductionFlowDiagram />
      </Tab>
      <Tab
        key="tree-list"
        title={
          <div className="flex items-center space-x-2">
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
          <div className="flex items-center space-x-2">
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
