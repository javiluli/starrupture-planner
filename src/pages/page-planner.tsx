import {
  CorporationLevelRequirements,
  ProductionDiagramTabs,
  RandomItemMarquee,
  SidebarPanel,
  StatsBar,
  TargetItemSelect,
  TargetRateInput,
} from '@/features/planner'
import { Flex, Grid, PageContainer, PageContent, PageHeader, Panel, Typography } from '@/shared/ui'
import { plannerSelectors, usePlannerStore } from '@/store/planner.store'

export const PagePlanner = () => {
  const targetId = usePlannerStore(plannerSelectors.targetId)

  return (
    <PageContainer>
      {/* Submenu superior */}
      <PageHeader>
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
      </PageHeader>

      {/* Se muestra el Flow si hay un items seleccionado */}
      <PageContent className="lg:overflow-hidden">
        {targetId ? (
          <Grid
            gap="lg"
            className="h-full min-h-0 min-w-0 grid-cols-1 grid-rows-[minmax(32rem,1fr)_22rem] items-stretch lg:grid-cols-[minmax(0,1fr)_24rem] lg:grid-rows-1"
          >
            {/* Diagrama principal React Flow */}
            <Panel padding="none" variant="muted" className="min-h-0 min-w-0 overflow-hidden">
              <ProductionDiagramTabs />
            </Panel>
            {/* Menus/Sidebar para seleccionar items externos que se suman a la produccion (supply) */}
            <Panel padding="none" variant="muted" className="min-h-0 min-w-0 overflow-hidden">
              <SidebarPanel />
            </Panel>
          </Grid>
        ) : (
          // Si no hay un item seleccionado
          <Flex direction="col" align="center" justify="center" className="h-full min-h-0 overflow-hidden text-center">
            <RandomItemMarquee />
            <Typography variant="h2">Select an object to begin production</Typography>
            <Typography tone="soft">
              Choose any processed item, component, or ammunition to see the necessary buildings and resource flow.
            </Typography>
          </Flex>
        )}
      </PageContent>
    </PageContainer>
  )
}
