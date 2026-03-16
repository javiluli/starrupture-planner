import { Flex } from '@/shared/ui'
import { Progress } from '@heroui/react'
import { Section } from '../components'

export const ProgressSection = () => (
  <Section id="progress" title="Progress" subtitle="Bars and indicators">
    <Flex direction="col" gap="sm" align="stretch">
      <Progress value={40} />
      <Progress value={70} color="primary" />
      <Progress value={90} color="success" />
    </Flex>
  </Section>
)
