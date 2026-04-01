import {
  CorporationLevelRequirements,
  ProductionFlowDiagram,
  ProductionItemsDiagram,
  ProductionTreelistDiagram,
  RandomItemMarquee,
  StatsBar,
  SupplySidebar,
  TargetItemSelect,
  TargetRateInput,
} from '@/features/planner'
import { Flex, Grid, PageContainer, Panel, Typography } from '@/shared/ui'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'
import { Tab, Tabs } from '@heroui/react'
import { ListTree, Network, Package, Rows } from 'lucide-react'

const PagePlanner = () => {
  const targetId = usePlannerStore(plannerSelectors.targetId)

  return (
    <PageContainer>
      {/* Submenu superior */}
      <Panel padding="sm">
        <Flex wrap="wrap" gap="lg">
          <Flex>
            {/* Selector de item */}
            <TargetItemSelect />
            {/* Cantidad de items/min a generar */}
            <TargetRateInput />
          </Flex>
          {/* Stats power/heat del "Core Base" */}
          <StatsBar />
          {/* Tiempo y cantidad de items para completar el nivel segun la "Corporation" */}
          <CorporationLevelRequirements />
        </Flex>
      </Panel>

      {/* Se muetsra el Flow si hay un items seleccionado */}
      {targetId ? (
        <Grid className="flex-1 grid-cols-[minmax(0,1fr)_20rem] gap-4 items-stretch">
          {/* Diagrama principal React Flow */}
          <div className="panel-muted h-full overflow-hidden">
            <div className="flex w-full h-full flex-col">
              <Tabs aria-label="Options" variant="bordered" size="lg" fullWidth>
                <Tab
                  key="network-graph"
                  className="h-full"
                  title={
                    <div className="flex items-center space-x-2">
                      <Network />
                      <span>Network grap</span>
                    </div>
                  }
                >
                  <ProductionFlowDiagram />
                </Tab>
                <Tab
                  key="tree-list"
                  className="h-full"
                  title={
                    <div className="flex items-center space-x-2">
                      <ListTree />
                      <span>Tree list</span>
                    </div>
                  }
                >
                  <ProductionTreelistDiagram />
                </Tab>
                <Tab
                  key="items"
                  className="h-full"
                  title={
                    <div className="flex items-center space-x-2">
                      <Package />
                      <span>Items</span>
                    </div>
                  }
                >
                  <ProductionItemsDiagram />
                </Tab>
              </Tabs>
            </div>
          </div>
          {/* Menus/Sidebar para seleccionar items externos que se suman a la produccion (supply) */}
          <SupplySidebar />
        </Grid>
      ) : (
        // Si no hay un item seleccioando
        <Flex direction="col" align="center" justify="center" className="h-full text-center">
          <RandomItemMarquee />
          <Typography variant="h2">Select an object to begin production</Typography>
          <Typography tone="soft">
            Choose any processed item, component, or ammunition to see the necessary buildings and resource flow.
          </Typography>
        </Flex>
      )}
    </PageContainer>
  )
}

export default PagePlanner

