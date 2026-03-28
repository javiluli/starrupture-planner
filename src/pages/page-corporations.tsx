import { CorporationsAccordion, useCorporationsSummary } from '@/features/corporations'
import { Flex, PageContainer, Panel, StatLabel, Typography } from '@/shared/ui'
import { formatNumber } from '@/shared/utils'

const PageCorporations = () => {
  const stats = useCorporationsSummary()

  return (
    <PageContainer>
      <Panel padding="sm">
        <Flex align="center" justify="between" gap="lg" wrap="wrap">
          <Typography as="h1" variant="h2">
            Corporations & Rewards
          </Typography>
          <Flex gap="md" align="center">
            <StatLabel value={stats.corporationsCount} label="Corporation" />
            <StatLabel value={stats.levelsCount} label="Level" />
            <StatLabel value={`${formatNumber(stats.costCount)} G`} label="Cost" />
          </Flex>
        </Flex>
      </Panel>

      <div className="flex-1 overflow-y-auto">
        <CorporationsAccordion />
      </div>
    </PageContainer>
  )
}

export default PageCorporations
