import { Flex } from '@/shared/ui'
import { Button, Tooltip } from '@heroui/react'
import { Section } from '../components'

export const TooltipsSection = () => (
  <Section id="tooltips" title="Tooltip" subtitle="Hover helper text">
    <Flex>
      <Tooltip content="Tooltip example">
        <Button variant="bordered">Hover me</Button>
      </Tooltip>
    </Flex>
  </Section>
)
