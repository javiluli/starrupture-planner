import { NumberInput } from '@heroui/react'
import { Section } from '../components'

export const NumberInputSection = () => (
  <Section id="numberInput" title="Number Input">
    <NumberInput variant="bordered" label="Bordered" />
    <NumberInput variant="faded" label="Faded" />
    <NumberInput variant="flat" label="Flat" />
    <NumberInput variant="underlined" label="Underlined" />
  </Section>
)
