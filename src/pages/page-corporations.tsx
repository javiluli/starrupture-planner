import { CorporationsAccordion, useCorporationsSummary } from '@/features/corporations'
import { Flex, PageContainer, PageContent, PageHeader, StatLabel, Typography } from '@/shared/ui'
import { formatNumber } from '@/shared/utils'

export const PageCorporations = () => {
  const stats = useCorporationsSummary()

  return (
    <PageContainer>
      <PageHeader>
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
      </PageHeader>

      <PageContent>
        <CorporationsAccordion />
      </PageContent>
    </PageContainer>
  )
}
