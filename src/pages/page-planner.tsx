import {
  CorporationLevelRequirements,
  ProductionDiagramTabs,
  RandomItemMarquee,
  SidebarPanel,
  StatsBar,
  TargetItemSelect,
  TargetRateInput,
} from '@/features/planner'
import { Flex, Grid, PageContainer, Panel, Typography } from '@/shared/ui'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'

export const PagePlanner = () => {
  const targetId = usePlannerStore(plannerSelectors.targetId)

  return (
    <PageContainer>
      {/* Submenu superior */}
      <Panel className="px-2 py-1">
        <Flex wrap="wrap" gap="md">
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
        <Grid className="flex-1 grid-cols-[minmax(0,1fr)_24rem] gap-2 items-stretch">
          {/* Diagrama principal React Flow */}
          <div className="h-full overflow-hidden">
            <div className="panel-muted border border-divider flex w-full h-full flex-col">
              <ProductionDiagramTabs />
            </div>
          </div>
          {/* Menus/Sidebar para seleccionar items externos que se suman a la produccion (supply) */}
          <SidebarPanel />
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
