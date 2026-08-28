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
      <Panel className="shrink-0 px-2 py-1" padding="sm">
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
        <Grid gap="lg" className="min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,1fr)_24rem] items-stretch overflow-hidden">
          {/* Diagrama principal React Flow */}
          <Panel padding="none" variant="muted" className="min-h-0 min-w-0 overflow-hidden border border-divider">
            <ProductionDiagramTabs />
          </Panel>
          {/* Menus/Sidebar para seleccionar items externos que se suman a la produccion (supply) */}
          <Panel padding="none" variant="muted" className="min-h-0 min-w-0 overflow-hidden border border-divider">
            <SidebarPanel />
          </Panel>
        </Grid>
      ) : (
        // Si no hay un item seleccioando
        <Flex direction="col" align="center" justify="center" className="min-h-0 flex-1 overflow-hidden text-center">
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
