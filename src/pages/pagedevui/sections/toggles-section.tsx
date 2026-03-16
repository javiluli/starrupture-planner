import { Flex } from '@/shared/ui'
import { Checkbox, Switch } from '@heroui/react'
import { Section } from '../components'

export const TogglesSection = () => (
  <Section id="toggles" title="Switch & Checkbox" subtitle="Toggle and choice controls">
    <Flex wrap="wrap" align="center">
      <Switch defaultSelected>Enabled</Switch>
      <Switch>Disabled</Switch>
      <Checkbox defaultSelected>Checked</Checkbox>
      <Checkbox>Unchecked</Checkbox>
    </Flex>
  </Section>
)
