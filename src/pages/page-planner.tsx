import {
  PlannerSidebar,
  PlannerToolbar,
  ProductionDiagramTabs,
  ProductionPlanProvider,
  RandomItemMarquee,
  useProductionPlan,
} from '@/features/planner'
import { Flex, Grid, PageContainer, PageContent, PageHeader, Panel, Typography } from '@/shared/ui'

const PlannerPageContent = () => {
  const plan = useProductionPlan()

  return (
    <PageContainer>
      <PageHeader>
        <PlannerToolbar />
      </PageHeader>

      <PageContent className="lg:overflow-hidden">
        {plan ? (
          <Grid
            gap="lg"
            className="h-full min-h-0 min-w-0 grid-cols-1 grid-rows-[minmax(32rem,1fr)_22rem] items-stretch lg:grid-cols-[minmax(0,1fr)_24rem] lg:grid-rows-1"
          >
            <Panel padding="none" variant="muted" className="min-h-0 min-w-0 overflow-hidden">
              <ProductionDiagramTabs />
            </Panel>
            <Panel padding="none" variant="muted" className="min-h-0 min-w-0 overflow-hidden">
              <PlannerSidebar />
            </Panel>
          </Grid>
        ) : (
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

export const PagePlanner = () => (
  <ProductionPlanProvider>
    <PlannerPageContent />
  </ProductionPlanProvider>
)
