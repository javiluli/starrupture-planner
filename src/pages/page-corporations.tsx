import { useCorporationsStats } from '@/features/corporations/hooks'
import { CorporationsList, StatPreview } from '@/features/corporations/ui'
import { Flex, PageContainer, Panel, Typography } from '@/shared/ui'
import { formatNumber } from '@/shared/utils'

const PageCorporations = () => {
  const stats = useCorporationsStats()

  return (
    <PageContainer>
      <Panel padding="sm">
        <Flex align="center" justify="between" gap="lg" wrap="wrap">
          <Typography as="h1" variant="h1">
            Corporations & Rewards
          </Typography>
          <Flex gap="md" align="center">
            <StatPreview value={stats.corporationsCount} title="Corporations" />
            <StatPreview value={stats.levelsCount} title="Levels" />
            <StatPreview value={`${formatNumber(stats.costCount)} G`} title="Cost" />
          </Flex>
        </Flex>
      </Panel>

      <div className="flex-1 overflow-y-auto">
        <CorporationsList />
      </div>
    </PageContainer>
  )
}

export default PageCorporations
