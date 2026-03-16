import { Radio, RadioGroup } from '@heroui/react'
import { Section } from '../components'

export const RadiosSection = () => (
  <Section id="radios" title="Radio Group" subtitle="Grouped choices">
    <RadioGroup label="Radio Group" defaultValue="one" orientation="horizontal">
      <Radio value="one">One</Radio>
      <Radio value="two">Two</Radio>
      <Radio value="three">Three</Radio>
    </RadioGroup>
  </Section>
)
