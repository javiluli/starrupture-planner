import { BaseDesignerStats, BaseDesignerWorkspace } from '@/features/base-designer'
import { Flex, PageContainer, PageContent, PageHeader, Typography } from '@/shared/ui'

export const PageBaseDesigner = () => {
  return (
    <PageContainer>
      <PageHeader>
        <Flex justify="between" gap="lg" wrap="wrap">
          <Flex direction="col" align="start" gap="xs">
            <Typography as="h1" variant="h2">
              My Base
            </Typography>
            <Typography tone="soft">Place buildings at their in-game scale and connect production lines.</Typography>
          </Flex>
          <BaseDesignerStats />
        </Flex>
      </PageHeader>

      <PageContent className="lg:overflow-hidden">
        <BaseDesignerWorkspace />
      </PageContent>
    </PageContainer>
  )
}
